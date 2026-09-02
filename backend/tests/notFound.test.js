const request = require('supertest');

const createApp = require('../src/app');

describe('Unknown routes', () => {
  const app = createApp();

  it('returns HTTP 404 for an unknown route', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not Found' });
  });
});
