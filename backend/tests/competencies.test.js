const request = require('supertest');

const createApp = require('../src/app');

describe('GET /api/competencies', () => {
  const app = createApp();

  it('returns HTTP 200 with a non-empty list of competencies', async () => {
    const res = await request(app).get('/api/competencies');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const competency = res.body.data[0];
    expect(typeof competency.area).toBe('string');
    expect(typeof competency.label).toBe('string');
    expect(typeof competency.description).toBe('string');
    expect(typeof competency.current).toBe('number');
    expect(typeof competency.target).toBe('number');
    expect(typeof competency.previous).toBe('number');
  });
});
