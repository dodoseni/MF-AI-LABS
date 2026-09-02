const request = require('supertest');

const createApp = require('../src/app');

const VALID_STATUSES = ['completed', 'in-progress', 'missing', 'recommended'];

describe('GET /api/certifications', () => {
  const app = createApp();

  it('returns HTTP 200 with a non-empty list of certifications', async () => {
    const res = await request(app).get('/api/certifications');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const cert = res.body.data[0];
    expect(typeof cert.id).toBe('string');
    expect(typeof cert.name).toBe('string');
    expect(typeof cert.issuer).toBe('string');
    expect(VALID_STATUSES).toContain(cert.status);
    expect(typeof cert.category).toBe('string');
    expect(typeof cert.level).toBe('string');
    expect(Array.isArray(cert.requiredFor)).toBe(true);
    expect(typeof cert.description).toBe('string');
  });

  it('aligns requiredFor with the Level 1-4 career roadmap (MIKK-28)', async () => {
    const res = await request(app).get('/api/certifications');

    const requiredForValues = res.body.data.flatMap((cert) => cert.requiredFor);
    const levelValues = requiredForValues.filter((value) => /^Level [1-4]$/.test(value));

    // At least one certification is required for each of Level 1-3
    // (Level 4 is holistic and has no certification requirements).
    expect(levelValues).toEqual(expect.arrayContaining(['Level 1', 'Level 2', 'Level 3']));
    // The old consulting-title requiredFor values must be gone.
    expect(requiredForValues).not.toEqual(
      expect.arrayContaining([
        'Consultant',
        'Senior Consultant',
        'Principal Consultant',
        'Enterprise Architect',
      ])
    );
  });
});
