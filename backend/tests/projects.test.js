const request = require('supertest');

// Mock the Azure SQL connection pool module so tests never touch real Azure
// SQL / require a managed identity or network path — only the repository's
// use of `getPool()`/`sql` is exercised.
jest.mock('../src/db/pool', () => {
  const NVarChar = jest.fn(() => 'NVarChar');

  const request = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  const pool = { request: jest.fn(() => request) };

  return {
    getPool: jest.fn(() => Promise.resolve(pool)),
    sql: { NVarChar },
    __mockRequest: request,
  };
});

const { __mockRequest: mockRequest } = require('../src/db/pool');
const createApp = require('../src/app');

describe('POST /api/projects', () => {
  const app = createApp();

  beforeEach(() => {
    mockRequest.input.mockClear();
    mockRequest.query.mockReset();
  });

  it('returns 201 with the created project on a valid name', async () => {
    const createdAt = '2026-09-02T13:00:00.000Z';
    mockRequest.query.mockResolvedValueOnce({
      recordset: [{ Id: 1, Name: 'Multica Database Test', CreatedAt: createdAt }],
    });

    const res = await request(app).post('/api/projects').send({ name: 'Multica Database Test' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      data: { id: 1, name: 'Multica Database Test', createdAt },
    });
    expect(mockRequest.input).toHaveBeenCalledWith('name', 'NVarChar', 'Multica Database Test');
    expect(mockRequest.query.mock.calls[0][0]).toMatch(/INSERT INTO dbo\.Projects/);
  });

  it('trims the name before persisting it', async () => {
    mockRequest.query.mockResolvedValueOnce({
      recordset: [{ Id: 2, Name: 'Trimmed', CreatedAt: '2026-09-02T13:00:00.000Z' }],
    });

    await request(app).post('/api/projects').send({ name: '  Trimmed  ' });

    expect(mockRequest.input).toHaveBeenCalledWith('name', 'NVarChar', 'Trimmed');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/projects').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(mockRequest.query).not.toHaveBeenCalled();
  });

  it('returns 400 when name is an empty/whitespace-only string', async () => {
    const res = await request(app).post('/api/projects').send({ name: '   ' });

    expect(res.status).toBe(400);
    expect(mockRequest.query).not.toHaveBeenCalled();
  });

  it('propagates unexpected repository errors via the centralized error handler', async () => {
    mockRequest.query.mockRejectedValueOnce(new Error('Login failed for user'));

    const res = await request(app).post('/api/projects').send({ name: 'Will Fail' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Login failed for user' });
  });
});

describe('GET /api/projects', () => {
  const app = createApp();

  beforeEach(() => {
    mockRequest.input.mockClear();
    mockRequest.query.mockReset();
  });

  it('returns 200 with the list of projects, most recent first', async () => {
    mockRequest.query.mockResolvedValueOnce({
      recordset: [
        { Id: 2, Name: 'Second', CreatedAt: '2026-09-02T14:00:00.000Z' },
        { Id: 1, Name: 'First', CreatedAt: '2026-09-02T13:00:00.000Z' },
      ],
    });

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [
        { id: 2, name: 'Second', createdAt: '2026-09-02T14:00:00.000Z' },
        { id: 1, name: 'First', createdAt: '2026-09-02T13:00:00.000Z' },
      ],
    });
    expect(mockRequest.query.mock.calls[0][0]).toMatch(/SELECT Id, Name, CreatedAt FROM dbo\.Projects/);
  });

  it('returns 200 with an empty array when there are no projects', async () => {
    mockRequest.query.mockResolvedValueOnce({ recordset: [] });

    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: [] });
  });
});
