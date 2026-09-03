const request = require('supertest');

// Mock @prisma/client at module level so dbTestRepository's `new PrismaClient()`
// (module-scope, executed on require) returns a controllable fake — this
// suite never hits a real database, in CI/Jest or anywhere else.
const mockPrismaClient = {
  $connect: jest.fn(),
  databaseSmokeTest: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

const createApp = require('../src/app');

describe('GET /api/db-test', () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the success shape when connect, create, and read-back all succeed', async () => {
    mockPrismaClient.$connect.mockResolvedValue(undefined);
    mockPrismaClient.databaseSmokeTest.create.mockResolvedValue({
      id: 1,
      message: 'Database connection successful',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });
    mockPrismaClient.databaseSmokeTest.findUnique.mockResolvedValue({
      id: 1,
      message: 'Database connection successful',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });

    const res = await request(app).get('/api/db-test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      databaseConnected: true,
      recordCreated: true,
      record: { id: 1, message: 'Database connection successful' },
    });
    expect(mockPrismaClient.$connect).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.databaseSmokeTest.create).toHaveBeenCalledWith({
      data: { message: 'Database connection successful' },
    });
    expect(mockPrismaClient.databaseSmokeTest.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('returns a structured failure (not an unhandled 500) when the database is unreachable', async () => {
    mockPrismaClient.$connect.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const res = await request(app).get('/api/db-test');

    expect(res.status).toBe(503);
    expect(res.body).toEqual({
      success: false,
      databaseConnected: false,
      recordCreated: false,
      error: 'Unable to connect to the database',
      details: 'connect ECONNREFUSED',
    });
    expect(mockPrismaClient.databaseSmokeTest.create).not.toHaveBeenCalled();
  });

  it('returns a structured failure distinguishing "connected but insert/read failed"', async () => {
    mockPrismaClient.$connect.mockResolvedValue(undefined);
    mockPrismaClient.databaseSmokeTest.create.mockRejectedValue(new Error('insert failed'));

    const res = await request(app).get('/api/db-test');

    expect(res.status).toBe(503);
    expect(res.body).toEqual({
      success: false,
      databaseConnected: true,
      recordCreated: false,
      error: 'Connected to the database, but failed to create/read the smoke test record',
      details: 'insert failed',
    });
  });
});
