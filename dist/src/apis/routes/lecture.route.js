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
const lecture_controller_1 = require("../controllers/lecture/lecture.controller");
const express = require("express");
const lectureRoutes = express.Router();
// Create Lecture
lectureRoutes.post("/createLecture", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, lecture_controller_1.createLecture)(req, res);
    next(response);
}));
// Get Lecture by ID
lectureRoutes.get("/getLectureById", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, lecture_controller_1.getLectureById)(req, res);
    next(response);
}));
// Get All Lectures
lectureRoutes.get("/getAllLectures", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, lecture_controller_1.getAllLectures)(req, res);
    next(response);
}));
// Update Lecture
lectureRoutes.put("/updateLecture", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, lecture_controller_1.updateLecture)(req, res);
    next(response);
}));
// Delete Lecture
lectureRoutes.delete("/deleteLecture", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, lecture_controller_1.deleteLecture)(req, res);
    next(response);
}));
exports.default = lectureRoutes;
//# sourceMappingURL=lecture.route.js.map