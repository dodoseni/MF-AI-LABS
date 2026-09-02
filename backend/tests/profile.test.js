const request = require('supertest');

const createApp = require('../src/app');

describe('GET /api/profile', () => {
  const app = createApp();

  it('returns HTTP 200 with a single profile object', async () => {
    const res = await request(app).get('/api/profile');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(false);

    const { data } = res.body;
    expect(typeof data.id).toBe('string');
    expect(typeof data.name).toBe('string');
    expect(typeof data.role).toBe('string');
    expect(typeof data.level).toBe('string');
    expect(typeof data.nextLevel).toBe('string');
    expect(typeof data.office).toBe('string');
    expect(typeof data.memberSince).toBe('string');
    expect(typeof data.avatarInitials).toBe('string');

    // Level 1-4 roadmap (MIKK-28): level/nextLevel are "Level N", not a
    // consulting title, and role is a distinct free-text job title.
    expect(data.level).toMatch(/^Level [1-4]$/);
    expect(data.nextLevel).toMatch(/^Level [1-4]$/);
    expect(data.role).not.toBe(data.level);
  });
});
