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

  it('does not include the removed Competency goal or its milestone events', async () => {
    const res = await request(app).get('/api/learning-plan');
    const { data } = res.body;

    // g2 ("Strengthen Sales competency to level 4") was removed after the
    // Competency feature was deleted from the frontend (MIKK-36/MIKK-42).
    expect(data.goals.some((g) => g.id === 'g2')).toBe(false);

    // e6, e9, e13 were the calendar milestones that only existed to support
    // the removed g2 goal.
    const calendarIds = data.calendar.map((e) => e.id);
    expect(calendarIds).not.toEqual(expect.arrayContaining(['e6', 'e9', 'e13']));
  });
});
