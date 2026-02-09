const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api", routes);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

module.exports = app;
