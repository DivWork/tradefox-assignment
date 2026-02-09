const trades = [];
const positions = new Map();
const supportedSymbols = new Map();
let realizedPnL = 0;


/**
 * POST /symbols
 * {
 *   "BTC": 44000,
 *   "ETH": 2000,
 *   "SOL": 120
 * }
 */
function addSymbols(req, res) {
    const symbols = req.body;

    if (!symbols || typeof symbols !== "object") {
        return res.status(400).json({ error: "Invalid symbols payload" });
    }

    for (const [symbol, price] of Object.entries(symbols)) {
        if (typeof price !== "number" || price <= 0) {
            return res
                .status(400)
                .json({ error: `Invalid price for ${symbol}` });
        }

        supportedSymbols.set(symbol.toUpperCase(), price);
    }

    res.json({ message: "Symbols added/updated successfully" });
}

/**
 * GET /symbols
 */
function getSymbols(req, res) {
    const result = {};
    for (const [symbol, price] of supportedSymbols.entries()) {
        result[symbol] = price;
    }
    res.json(result);
}

/**
 * POST /trade
 */
function addTrade(req, res) {
    try {
        let { id, symbol, side, price, quantity, timestamp } = req.body;

        if (!id || !symbol || !side || !price || !quantity) {
            return res.status(400).json({ error: "Invalid trade data" });
        }

        symbol = symbol.toUpperCase();

        if (!supportedSymbols.has(symbol)) {
            return res
                .status(400)
                .json({ error: `Unsupported symbol: ${symbol}` });
        }

        const trade = {
            id,
            symbol,
            side,
            price,
            quantity,
            timestamp: timestamp || Date.now()
        };

        processTrade(trade);
        trades.push(trade);

        res.json({ message: "Trade added successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

/**
 * Average Cost logic
 */
function processTrade(trade) {
    const { symbol, side, price, quantity } = trade;

    let position = positions.get(symbol) || {
        symbol,
        quantity: 0,
        avgPrice: 0
    };

    if (side === "buy") {
        const totalCost =
            position.quantity * position.avgPrice +
            quantity * price;

        position.quantity += quantity;
        position.avgPrice = totalCost / position.quantity;
    }

    if (side === "sell") {
        if (quantity > position.quantity) {
            throw new Error(`Insufficient quantity to sell ${symbol}`);
        }

        realizedPnL += (price - position.avgPrice) * quantity;
        position.quantity -= quantity;

        if (position.quantity === 0) {
            position.avgPrice = 0;
        }
    }

    positions.set(symbol, position);
}

/**
 * GET /portfolio
 */
function getPortfolio(req, res) {
    const portfolio = [];

    for (const position of positions.values()) {
        const marketPrice = supportedSymbols.get(position.symbol) ?? 0;

        portfolio.push({
            symbol: position.symbol,
            quantity: position.quantity,
            avgEntryPrice: position.avgPrice,
            marketPrice,
            unrealizedPnL:
                (marketPrice - position.avgPrice) * position.quantity
        });
    }

    res.json(portfolio);
}

/**
 * GET /pnl
 */
function getPnL(req, res) {
    let unrealizedPnL = 0;

    for (const position of positions.values()) {
        const marketPrice = supportedSymbols.get(position.symbol) ?? 0;
        unrealizedPnL +=
            (marketPrice - position.avgPrice) * position.quantity;
    }

    res.json({
        realizedPnL,
        unrealizedPnL,
        totalPnL: realizedPnL + unrealizedPnL
    });
}

module.exports = {
    addTrade,
    getPortfolio,
    getPnL,
    addSymbols,
    getSymbols
};
