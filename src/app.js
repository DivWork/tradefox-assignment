const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

module.exports = app;
