const request = require('supertest');

const createApp = require('../src/app');

const VALID_STATUSES = ['current', 'completed', 'upcoming'];

describe('GET /api/career-levels', () => {
  const app = createApp();

  it('returns HTTP 200 with career levels in progression order', async () => {
    const res = await request(app).get('/api/career-levels');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const level = res.body.data[0];
    expect(typeof level.id).toBe('string');
    expect(typeof level.name).toBe('string');
    expect(typeof level.description).toBe('string');
    expect(typeof level.progress).toBe('number');
    expect(VALID_STATUSES).toContain(level.status);
    expect(Array.isArray(level.requirements)).toBe(true);

    // Order must be preserved for the career path UI: first entry is the
    // earliest level (Consultant), and exactly one level is "current".
    expect(res.body.data[0].id).toBe('consultant');
    const currentLevels = res.body.data.filter((l) => l.status === 'current');
    expect(currentLevels.length).toBe(1);
  });
});
