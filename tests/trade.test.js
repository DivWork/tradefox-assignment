const request = require("supertest");
const app = require("../src/app");

describe("Trade API", () => {
    beforeAll(async () => {
        await request(app)
            .post("/api/symbols")
            .send({ BTC: 44000 });
    });

    it("should add a buy trade", async () => {
        const res = await request(app)
            .post("/api/trade")
            .send({
                id: "1",
                symbol: "BTC",
                side: "buy",
                price: 40000,
                quantity: 1
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Trade added successfully");
    });

    it("should reject unsupported symbol", async () => {
        const res = await request(app)
            .post("/api/trade")
            .send({
                id: "2",
                symbol: "DOGE",
                side: "buy",
                price: 10,
                quantity: 1
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/Unsupported symbol/);
    });
});
