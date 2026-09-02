const request = require('supertest');

const createApp = require('../src/app');

describe('GET /api/learning-plan', () => {
  const app = createApp();

  it('returns HTTP 200 with goals, tasks, weeklyPlan and calendar', async () => {
    const res = await request(app).get('/api/learning-plan');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');

    const { data } = res.body;
    expect(Array.isArray(data.goals)).toBe(true);
    expect(data.goals.length).toBeGreaterThan(0);
    expect(Array.isArray(data.goals[0].milestones)).toBe(true);

    expect(Array.isArray(data.tasks)).toBe(true);
    expect(data.tasks.length).toBeGreaterThan(0);

    expect(Array.isArray(data.weeklyPlan)).toBe(true);
    expect(data.weeklyPlan.length).toBeGreaterThan(0);

    expect(Array.isArray(data.calendar)).toBe(true);
    expect(data.calendar.length).toBeGreaterThan(0);
  });
});
