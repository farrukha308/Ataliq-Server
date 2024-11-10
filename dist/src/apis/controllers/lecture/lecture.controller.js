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
exports.deleteLecture = exports.updateLecture = exports.getAllLectures = exports.getLectureById = exports.createLecture = void 0;
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const logger_1 = require("../../../utils/logger");
const constant_1 = __importDefault(require("../../../constant/constant"));
const models_1 = __importDefault(require("../../models"));
// Create a new Lecture
const createLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, videoLink, subjectId } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        const subject = yield subjectMongoObj.findById(subjectId);
        if (!subject) {
            (0, logger_1.auditLog)(`Get subject Failed: subject not found with ID: ${subjectId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        const lectureMongoObj = new mongodb_1.default(models_1.default.SUBJECT_LECTURE);
        const newLecture = yield lectureMongoObj.create({
            title,
            description,
            videoLink,
            subjectId
        });
        (0, logger_1.auditLog)(`Lecture Created: ${JSON.stringify(newLecture)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture created successfully.",
            data: newLecture,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Create Lecture Failed: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Failed to create lecture.",
        };
    }
});
exports.createLecture = createLecture;
// Get a Lecture by ID
const getLectureById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const lectureMongoObj = new mongodb_1.default(models_1.default.SUBJECT_LECTURE);
        const lecture = yield lectureMongoObj.findById(id);
        if (!lecture) {
            (0, logger_1.auditLog)(`Get Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }
        (0, logger_1.auditLog)(`Lecture Retrieved: ${JSON.stringify(lecture)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture retrieved successfully.",
            data: lecture,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Get Lecture Failed: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Failed to get lecture.",
        };
    }
});
exports.getLectureById = getLectureById;
// Get All Lectures
const getAllLectures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lectureMongoObj = new mongodb_1.default(models_1.default.SUBJECT_LECTURE);
        let lectures;
        if (!req.body)
            lectures = yield lectureMongoObj.findAll();
        else
            lectures = yield lectureMongoObj.find(req.body);
        (0, logger_1.auditLog)(`Retrieved all lectures. Count: ${lectures.length}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lectures retrieved successfully.",
            data: lectures,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Get All Lectures Failed: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Failed to retrieve lectures.",
        };
    }
});
exports.getAllLectures = getAllLectures;
// Update a Lecture
const updateLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, description, videoLink } = req.body;
        const lectureMongoObj = new mongodb_1.default(models_1.default.SUBJECT_LECTURE);
        const lecture = yield lectureMongoObj.findById(id);
        if (!lecture) {
            (0, logger_1.auditLog)(`Update Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }
        const updatedLecture = yield lectureMongoObj.updateById(id, {
            title,
            description,
            videoLink,
            updatedAt: new Date(),
        });
        (0, logger_1.auditLog)(`Lecture Updated: ID: ${id}, New Data: ${JSON.stringify(updatedLecture)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture updated successfully.",
            data: updatedLecture,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Update Lecture Failed: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Failed to update lecture.",
        };
    }
});
exports.updateLecture = updateLecture;
// Delete a Lecture
const deleteLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const lectureMongoObj = new mongodb_1.default(models_1.default.SUBJECT_LECTURE);
        const lecture = yield lectureMongoObj.findById(id);
        if (!lecture) {
            (0, logger_1.auditLog)(`Delete Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }
        yield lectureMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });
        (0, logger_1.auditLog)(`Lecture Archived: ID: ${id}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture archived successfully.",
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Delete Lecture Failed: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Failed to delete lecture.",
        };
    }
});
exports.deleteLecture = deleteLecture;
//# sourceMappingURL=lecture.controller.js.map