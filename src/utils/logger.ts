import { Application } from "express";
require("dotenv").config();

const morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream"); // version 2.x
// create a rotating write stream
var accessLogStream: any = rfs.createStream(`access.log`, {
  interval: process.env.LOGS_FILE_TIME,
  path: path.join(__dirname, process.env.LOGS_PATH),
});

const initiateLogger = (app: Application) => {
  if (process.env.IS_LOGGER_ENABLE === "Y") app.use(morgan('combined', { stream: accessLogStream }));
  else app.use(morgan("dev"));
};

const auditLog = (msg: string) => {
  if (process.env.server_env === "dev") console.log(`${msg} \n`)
  if (process.env.IS_LOGGER_ENABLE === "Y") accessLogStream.write(`Audit Logs: [${new Date()}] ${msg} \n`)
};

export {
  initiateLogger,
  auditLog
}
