const request = require("supertest");
const app = require("../app");

describe("GET /api/certifications", () => {
  it("returns the certification catalog personalised for the default user", async () => {
    const res = await request(app).get("/api/certifications");
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("usr-amalie-berg");
    expect(Array.isArray(res.body.certifications)).toBe(true);
    expect(res.body.certifications.length).toBeGreaterThan(0);
    expect(res.body.summary).toEqual(
      expect.objectContaining({
        held: expect.any(Number),
        total: expect.any(Number),
        percent: expect.any(Number),
      })
    );
    const az900 = res.body.certifications.find((c) => c.id === "az-900");
    expect(az900).toEqual(
      expect.objectContaining({
        name: "Microsoft Azure Fundamentals",
        status: "completed",
        earnedDate: "2022-03-14",
      })
    );
  });

  it("returns a different, internally-consistent story for another user", async () => {
    const res = await request(app).get(
      "/api/certifications?userId=usr-jonas-eide"
    );
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("usr-jonas-eide");
    const az104 = res.body.certifications.find((c) => c.id === "az-104");
    expect(az104.status).toBe("in-progress");
    expect(az104.progress).toBe(40);
  });

  it("404s for an unknown userId", async () => {
    const res = await request(app).get("/api/certifications?userId=nope");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Unknown userId/);
  });
});

describe("GET /api/certifications/export.csv", () => {
  it("returns real CSV with headers and rows", async () => {
    const res = await request(app).get("/api/certifications/export.csv");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/csv/);
    const lines = res.text.trim().split("\n");
    expect(lines[0]).toBe(
      "id,name,issuer,category,level,status,earnedDate,progress,requiredFor,description"
    );
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[1]).toMatch(/^az-900,/);
  });
});

describe("GET /api/certifications/:id/certificate.pdf", () => {
  it("generates a real, valid PDF for a completed certification", async () => {
    const res = await request(app).get(
      "/api/certifications/az-900/certificate.pdf"
    );
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.body.slice(0, 4).toString()).toBe("%PDF");
    expect(res.body.length).toBeGreaterThan(500);
  });

  it("rejects generating a certificate for a cert the user has not completed", async () => {
    const res = await request(app).get(
      "/api/certifications/az-305/certificate.pdf"
    );
    expect(res.status).toBe(409);
  });

  it("404s for an unknown certification id", async () => {
    const res = await request(app).get(
      "/api/certifications/does-not-exist/certificate.pdf"
    );
    expect(res.status).toBe(404);
  });
});
