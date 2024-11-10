"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const user_routes_1 = __importDefault(require("../apis/routes/user.routes"));
const mongodb_1 = __importDefault(require("../wrapper/mongodb"));
const models_1 = __importDefault(require("../apis/models"));
const responseHandler_1 = require("../middlewares/responseHandler");
const auth_1 = require("../middlewares/auth");
const constant_1 = __importDefault(require("../constant/constant"));
const course_route_1 = __importDefault(require("../apis/routes/course.route"));
const subject_route_1 = __importDefault(require("../apis/routes/subject.route"));
const lecture_route_1 = __importDefault(require("../apis/routes/lecture.route"));
const express = require("express");
const router = express.Router();
router.use(auth_1.validateToken);
//! Router Level request validator middleware
router.use((req, res, next) => {
    (0, validateRequest_1.default)(req, res, next);
});
router.use("/user", user_routes_1.default);
router.use("/course", course_route_1.default);
router.use("/subject", subject_route_1.default);
router.use("/lecture", lecture_route_1.default);
// ! for run script only
router.post("/runScript", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data1, schema, data2 } = req.body;
    if (data1 !== process.env.SCRIPT_PASS ||
        schema === undefined ||
        data2 === undefined) {
        res.status(400).json({ status: "Invalid Data" });
    }
    else {
        let cacheData = new mongodb_1.default(models_1.default[schema]);
        console.log("cacheData ", data2);
        let data = yield cacheData.bulkCreate(data2);
        res.status(200).json({ status: constant_1.default.RESPONSE_STATUS.SUCCESS });
    }
}));
router.use(responseHandler_1.ResponseHandler);
module.exports = router;
// 
//# sourceMappingURL=index.js.map