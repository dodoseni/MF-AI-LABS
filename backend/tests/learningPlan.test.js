const request = require('supertest');

const createApp = require('../src/app');

describe('GET /api/learning-plan', () => {
  const app = createApp();

  it('returns HTTP 200 with a list of study checklists', async () => {
    const res = await request(app).get('/api/learning-plan');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('every checklist has id, certificationId, certificationName and items', async () => {
    const res = await request(app).get('/api/learning-plan');

    for (const plan of res.body.data) {
      expect(typeof plan.id).toBe('string');
      expect(typeof plan.certificationId).toBe('string');
      expect(typeof plan.certificationName).toBe('string');
      expect(Array.isArray(plan.items)).toBe(true);
    }
  });

  it('every checklist item has id, label and done', async () => {
    const res = await request(app).get('/api/learning-plan');

    for (const plan of res.body.data) {
      for (const item of plan.items) {
        expect(typeof item.id).toBe('string');
        expect(typeof item.label).toBe('string');
        expect(typeof item.done).toBe('boolean');
      }
    }
  });

  it('does not include the old goals/tasks/weeklyPlan/calendar contract', () => {
    return request(app)
      .get('/api/learning-plan')
      .then((res) => {
        expect(res.body.data).not.toHaveProperty('goals');
        expect(res.body.data).not.toHaveProperty('tasks');
        expect(res.body.data).not.toHaveProperty('weeklyPlan');
        expect(res.body.data).not.toHaveProperty('calendar');

        for (const plan of res.body.data) {
          expect(plan).not.toHaveProperty('goals');
          expect(plan).not.toHaveProperty('tasks');
          expect(plan).not.toHaveProperty('weeklyPlan');
          expect(plan).not.toHaveProperty('calendar');
        }
      });
  });
});
