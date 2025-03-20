const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const app = require("../../app");

const router = express.Router();

const swaggerOptions = {};

router.use("/", swaggerUi.serve);
router.get("/" , swaggerUi.setup(swaggerDocument , swaggerOptions ));

module.exports = router;
