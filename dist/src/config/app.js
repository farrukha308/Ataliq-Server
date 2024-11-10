"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("../utils/logger");
const db_1 = require("./db");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routes");
const { initiateCache, } = require("../middlewares/cache");
const app = (0, express_1.default)();
const bodyParser = require("body-parser");
(0, db_1.initDB)();
(0, logger_1.initiateLogger)(app);
initiateCache();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(cors());
app.use(helmet());
app.use(express_1.default.json({
    limit: "50mb",
}));
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use("/api/v1", routes);
app.use("*", (req, res) => {
    res.status(404).send("No route exists");
});
module.exports = app;
//# sourceMappingURL=app.js.map