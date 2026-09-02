const request = require('supertest');

const createApp = require('../src/app');

const VALID_STATUSES = ['current', 'completed', 'upcoming'];
const VALID_REQUIREMENT_MODES = ['all', 'choose', 'holistic'];

describe('GET /api/career-levels', () => {
  const app = createApp();

  it('returns HTTP 200 with career levels in progression order (Level 1-4)', async () => {
    const res = await request(app).get('/api/career-levels');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(4);

    const level = res.body.data[0];
    expect(typeof level.id).toBe('string');
    expect(typeof level.name).toBe('string');
    expect(typeof level.tagline).toBe('string');
    expect(typeof level.description).toBe('string');
    expect(typeof level.progress).toBe('number');
    expect(VALID_STATUSES).toContain(level.status);
    expect(VALID_REQUIREMENT_MODES).toContain(level.requirementMode);
    expect(typeof level.requirementNote).toBe('string');
    expect(Array.isArray(level.requirements)).toBe(true);

    // Order must be preserved for the career path UI: Level 1 -> Level 4,
    // and exactly one level is "current".
    expect(res.body.data.map((l) => l.id)).toEqual([
      'level-1',
      'level-2',
      'level-3',
      'level-4',
    ]);
    expect(res.body.data.map((l) => l.name)).toEqual([
      'Level 1',
      'Level 2',
      'Level 3',
      'Level 4',
    ]);
    const currentLevels = res.body.data.filter((l) => l.status === 'current');
    expect(currentLevels.length).toBe(1);
  });

  it('uses "choose" mode with chooseAtLeast for Level 2 and Level 3', async () => {
    const res = await request(app).get('/api/career-levels');

    const level2 = res.body.data.find((l) => l.id === 'level-2');
    const level3 = res.body.data.find((l) => l.id === 'level-3');

    expect(level2.requirementMode).toBe('choose');
    expect(level2.chooseAtLeast).toBe(2);
    expect(level2.requirements.length).toBeGreaterThan(level2.chooseAtLeast);

    expect(level3.requirementMode).toBe('choose');
    expect(level3.chooseAtLeast).toBe(2);
  });

  it('uses "holistic" mode with focusAreas (no fixed certification list) for Level 4', async () => {
    const res = await request(app).get('/api/career-levels');

    const level4 = res.body.data.find((l) => l.id === 'level-4');

    expect(level4.requirementMode).toBe('holistic');
    expect(level4.requirements).toEqual([]);
    expect(Array.isArray(level4.focusAreas)).toBe(true);
    expect(level4.focusAreas.length).toBeGreaterThan(0);
    expect(level4.status).toBe('upcoming');
  });
});
