const request = require("supertest");
const app = require("../app");

describe("GET /api/manager/overview", () => {
  it("returns a summary for every consultant", async () => {
    const res = await request(app).get("/api/manager/overview");
    expect(res.status).toBe(200);
    expect(res.body.teamSize).toBe(3);
    expect(res.body.consultants).toHaveLength(3);
    for (const consultant of res.body.consultants) {
      expect(consultant).toEqual(
        expect.objectContaining({
          userId: expect.any(String),
          name: expect.any(String),
          currentLevel: expect.any(String),
          certifications: expect.objectContaining({
            held: expect.any(Number),
            total: expect.any(Number),
            percent: expect.any(Number),
          }),
          competencies: expect.objectContaining({
            averageCurrent: expect.any(Number),
            averageTarget: expect.any(Number),
          }),
          activeGoals: expect.any(Number),
        })
      );
    }
  });
});

describe("GET /api/users", () => {
  it("lists the demo consultants available in the mock layer", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBe(3);
    expect(res.body.users.map((u) => u.userId)).toContain("usr-amalie-berg");
  });
});
