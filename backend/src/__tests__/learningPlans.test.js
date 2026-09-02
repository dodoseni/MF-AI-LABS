const request = require("supertest");
const app = require("../app");

describe("GET /api/learning-plans", () => {
  it("returns goals with milestones and a study plan for the default user", async () => {
    const res = await request(app).get("/api/learning-plans");
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("usr-amalie-berg");
    expect(res.body.goals.length).toBeGreaterThan(0);
    expect(res.body.goals[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        status: expect.any(String),
        progress: expect.any(Number),
        milestones: expect.any(Array),
      })
    );
    expect(res.body.studyPlan.length).toBeGreaterThan(0);
  });

  it("404s for an unknown userId", async () => {
    const res = await request(app).get("/api/learning-plans?userId=nope");
    expect(res.status).toBe(404);
  });
});
