const request = require("supertest");
const app = require("../app");

describe("GET /api/competencies", () => {
  it("returns the 5 competency areas with current/target/gap for the default user", async () => {
    const res = await request(app).get("/api/competencies");
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("usr-amalie-berg");
    expect(res.body.areas).toHaveLength(5);
    const areaCodes = res.body.areas.map((a) => a.area);
    expect(areaCodes).toEqual([
      "Sales",
      "Delivery",
      "Manage",
      "Entrepreneurship",
      "Develop",
    ]);
    const sales = res.body.areas.find((a) => a.area === "Sales");
    expect(sales).toEqual(
      expect.objectContaining({ current: 3, target: 4, previous: 2, gap: 1 })
    );
  });

  it("tells a different story for a more senior consultant", async () => {
    const res = await request(app).get(
      "/api/competencies?userId=usr-kristine-solberg"
    );
    expect(res.status).toBe(200);
    expect(res.body.averageCurrent).toBeGreaterThan(4);
  });
});

describe("GET /api/competencies/export.csv", () => {
  it("returns real CSV with headers and rows", async () => {
    const res = await request(app).get("/api/competencies/export.csv");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/csv/);
    const lines = res.text.trim().split("\n");
    expect(lines[0]).toBe("area,label,current,target,previous,gap");
    expect(lines).toHaveLength(6); // header + 5 areas
  });
});
