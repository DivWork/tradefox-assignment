const express = require("express");
const {
    addTrade,
    getPortfolio,
    getPnL,
    addSymbols,
    getSymbols
} = require("./tradeService");

const router = express.Router();

router.post("/symbols", addSymbols);
router.get("/symbols", getSymbols);

router.post("/trade", addTrade);
router.get("/portfolio", getPortfolio);
router.get("/pnl", getPnL);

module.exports = router;
