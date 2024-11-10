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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("../controllers/subject/subject.controller");
const subjectRoutes = (0, express_1.Router)();
subjectRoutes.post("/createSubject", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.createSubject)(req, res);
    next(response);
}));
subjectRoutes.get("/getAllSubjects", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.getAllSubjects)(req, res);
    next(response);
}));
subjectRoutes.post("/getSubjectById", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.getSubjectById)(req, res);
    next(response);
}));
subjectRoutes.put("/updateSubject", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.updateSubject)(req, res);
    next(response);
}));
subjectRoutes.delete("/deleteSubject", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.deleteSubject)(req, res);
    next(response);
}));
subjectRoutes.post("/addLectureToSubject", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.addLectureToSubject)(req, res);
    next(response);
}));
subjectRoutes.post("/removeLectureFromSubject", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, subject_controller_1.removeLectureFromSubject)(req, res);
    next(response);
}));
exports.default = subjectRoutes;
//# sourceMappingURL=subject.route.js.map