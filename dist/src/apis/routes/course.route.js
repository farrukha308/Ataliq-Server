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
const express_1 = require("express");
const express_session_1 = __importDefault(require("express-session"));
const course_controller_1 = require("../controllers/course/course.controller"); // adjust import path based on your project structure
const courseRoutes = (0, express_1.Router)();
courseRoutes.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || "",
}));
//! Create a new course
courseRoutes.post("/createCourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.createCourse)(req, res);
    next(response);
}));
//! Get all courses
courseRoutes.get("/getAllCourses", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.getAllCourses)(req, res);
    next(response);
}));
//! Get a course by ID
courseRoutes.post("/getCourseById", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.getCourseById)(req, res);
    next(response);
}));
//! Update a course
courseRoutes.put("/updateCourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.updateCourse)(req, res);
    next(response);
}));
//! Delete (Archive) a course
courseRoutes.delete("/deleteCourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.deleteCourse)(req, res);
    next(response);
}));
//! Delete (Archive) a course
courseRoutes.post("/addSubjectToCourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.addSubjectToCourse)(req, res);
    next(response);
}));
//! Remove a subject from a course
courseRoutes.post("/removeSubjectFromCourse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, course_controller_1.removeSubjectFromCourse)(req, res);
    next(response);
}));
courseRoutes.get("/getCourseDetailsByGrade", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, course_controller_1.getCourseDetailsByGrade)(req, res);
    next(response);
}));
exports.default = courseRoutes;
//# sourceMappingURL=course.route.js.map