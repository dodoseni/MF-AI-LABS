const request = require("supertest");
const app = require("../app");

describe("GET /api/career/levels", () => {
  it("returns the full career ladder with the user's completed/current/upcoming status", async () => {
    const res = await request(app).get("/api/career/levels");
    expect(res.status).toBe(200);
    expect(res.body.currentLevel).toBe("senior");
    expect(res.body.levels.map((l) => l.id)).toEqual([
      "consultant",
      "senior",
      "principal",
      "architect",
      "expert",
    ]);
    const senior = res.body.levels.find((l) => l.id === "senior");
    expect(senior.status).toBe("completed");
    expect(senior.progress).toBe(100);

    const principal = res.body.levels.find((l) => l.id === "principal");
    expect(principal.status).toBe("current");
    expect(principal.progress).toBe(58);
    expect(principal.requirements.length).toBeGreaterThan(0);

    const architect = res.body.levels.find((l) => l.id === "architect");
    expect(architect.status).toBe("upcoming");
    expect(architect.progress).toBe(0);
  });

  it("reflects a junior consultant's earlier position on the ladder", async () => {
    const res = await request(app).get(
      "/api/career/levels?userId=usr-jonas-eide"
    );
    expect(res.status).toBe(200);
    expect(res.body.currentLevel).toBe("consultant");
    // Already-achieved level is 'completed'; the next level he is working
    // toward is 'current'; everything beyond that is locked ('upcoming').
    const consultant = res.body.levels.find((l) => l.id === "consultant");
    expect(consultant.status).toBe("completed");
    const senior = res.body.levels.find((l) => l.id === "senior");
    expect(senior.status).toBe("current");
    expect(senior.progress).toBe(25);
    const principal = res.body.levels.find((l) => l.id === "principal");
    expect(principal.status).toBe("upcoming");
  });
});
