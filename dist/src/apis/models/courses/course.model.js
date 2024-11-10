"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constant_1 = __importDefault(require("../../../constant/constant"));
const courseSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    // gradeId: { type: Schema.Types.ObjectId, ref: CONSTANT.SCHEMA.STUDENT_GRADE, required: true },
    grade: { type: String, required: true },
    subjectIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: constant_1.default.SCHEMA.COURSE_SUBJECT }],
    isArchive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const Course = (0, mongoose_1.model)(constant_1.default.SCHEMA.COURSE, courseSchema);
exports.default = Course;
//# sourceMappingURL=course.model.js.map