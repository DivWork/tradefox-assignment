const request = require("supertest");
const app = require("../src/app");

describe("PnL API", () => {
    beforeAll(async () => {
        await request(app)
            .post("/api/symbols")
            .send({ BTC: 44000 });

        await request(app)
            .post("/api/trade")
            .send({
                id: "4",
                symbol: "BTC",
                side: "buy",
                price: 40000,
                quantity: 1
            });

        await request(app)
            .post("/api/trade")
            .send({
                id: "5",
                symbol: "BTC",
                side: "sell",
                price: 42000,
                quantity: 1
            });
    });

    it("should return realized and unrealized PnL", async () => {
        const res = await request(app).get("/api/pnl");

        expect(res.statusCode).toBe(200);
        expect(res.body.realizedPnL).toBeGreaterThanOrEqual(2000);
        expect(res.body.unrealizedPnL).toBeDefined();
        expect(res.body.totalPnL).toBeDefined();
    });
});
