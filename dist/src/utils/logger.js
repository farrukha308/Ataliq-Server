"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = exports.initiateLogger = void 0;
require("dotenv").config();
const morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream"); // version 2.x
// create a rotating write stream
var accessLogStream = rfs.createStream(`access.log`, {
    interval: process.env.LOGS_FILE_TIME,
    path: path.join(__dirname, process.env.LOGS_PATH),
});
const initiateLogger = (app) => {
    if (process.env.IS_LOGGER_ENABLE === "Y")
        app.use(morgan('combined', { stream: accessLogStream }));
    else
        app.use(morgan("dev"));
};
exports.initiateLogger = initiateLogger;
const auditLog = (msg) => {
    if (process.env.server_env === "dev")
        console.log(`${msg} \n`);
    if (process.env.IS_LOGGER_ENABLE === "Y")
        accessLogStream.write(`Audit Logs: [${new Date()}] ${msg} \n`);
};
exports.auditLog = auditLog;
//# sourceMappingURL=logger.js.map