import express, { Express, Request, Response } from "express";
import cookieParser from 'cookie-parser';

import { initiateLogger } from "../utils/logger";
import { initDB } from "./db";

require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routes");
const {
  initiateCache,
} = require("../middlewares/cache");

const app: Express = express();

const bodyParser: any = require("body-parser");

initDB()
initiateLogger(app);
initiateCache();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());
app.use(helmet());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/v1", routes);
app.use("*", (req: Request, res: Response) => {
  res.status(404).send("No route exists");
});

module.exports = app;
