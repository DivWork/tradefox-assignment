const request = require("supertest");
const app = require("../src/app");

describe("Portfolio API", () => {
    beforeAll(async () => {
        await request(app)
            .post("/api/symbols")
            .send({ ETH: 2000 });

        await request(app)
            .post("/api/trade")
            .send({
                id: "3",
                symbol: "ETH",
                side: "buy",
                price: 1800,
                quantity: 2
            });
    });

    it("should return portfolio holdings", async () => {
        const res = await request(app).get("/api/portfolio");

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const eth = res.body.find(p => p.symbol === "ETH");
        expect(eth.quantity).toBe(2);
        expect(eth.avgEntryPrice).toBe(1800);
    });
});
