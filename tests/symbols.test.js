const request = require("supertest");
const app = require("../src/app");

describe("Symbols API", () => {
    it("should register supported symbols", async () => {
        const res = await request(app)
            .post("/api/symbols")
            .send({
                BTC: 44000,
                ETH: 2000
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBeDefined();
    });

    it("should fetch supported symbols", async () => {
        const res = await request(app).get("/api/symbols");

        expect(res.statusCode).toBe(200);
        expect(res.body.BTC).toBe(44000);
        expect(res.body.ETH).toBe(2000);
    });
});
