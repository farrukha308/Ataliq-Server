import { NextFunction, Request, Response } from "express";
import validateRequest from "../middlewares/validateRequest";
import userRoutes from "../apis/routes/user.routes";
import MongooseWrapper from "../wrapper/mongodb";
import MODELS from "../apis/models";
import { ResponseHandler } from "../middlewares/responseHandler";
import { validateToken } from "../middlewares/auth";
import CONSTANT from "../constant/constant";
import courseRoutes from "../apis/routes/course.route";
import subjectRoutes from "../apis/routes/subject.route";
import lectureRoutes from "../apis/routes/lecture.route";

const express = require("express");
const router = express.Router();


router.use(validateToken)
//! Router Level request validator middleware
router.use((req: Request, res: Response, next: NextFunction) => {
  validateRequest(req, res, next);
});


router.use("/user", userRoutes);
router.use("/course", courseRoutes);
router.use("/subject", subjectRoutes);
router.use("/lecture", lectureRoutes);

// ! for run script only
router.post("/runScript", async (req: Request, res: Response) => {
  let { data1, schema, data2 } = req.body;
  if (
    data1 !== process.env.SCRIPT_PASS ||
    schema === undefined ||
    data2 === undefined
  ) {
    res.status(400).json({ status: "Invalid Data" });
  } else {
    let cacheData = new MongooseWrapper<any>(MODELS[schema]);
    console.log("cacheData ", data2)
    let data = await cacheData.bulkCreate(data2);

    res.status(200).json({ status: CONSTANT.RESPONSE_STATUS.SUCCESS });
  }
});

router.use(ResponseHandler)

module.exports = router;
// 