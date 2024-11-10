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
exports.removeLectureFromSubject = exports.addLectureToSubject = exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const logger_1 = require("../../../utils/logger");
const constant_1 = __importDefault(require("../../../constant/constant"));
// Function to create a new subject
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        const existingSubject = yield subjectMongoObj.find({ name });
        if (existingSubject.length > 0) {
            (0, logger_1.auditLog)(`Create Subject Failed: Subject with name ${name} already exists.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject already exists.",
            };
        }
        const newSubject = yield subjectMongoObj.create({ name, description });
        (0, logger_1.auditLog)(`Subject Created: ${JSON.stringify(newSubject)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject created successfully.",
            data: newSubject,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.createSubject = createSubject;
// Function to get all subjects
const getAllSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        let subjects;
        if (!name)
            subjects = yield subjectMongoObj.findAll();
        else
            subjects = yield subjectMongoObj.find({ name });
        (0, logger_1.auditLog)(`Retrieved all subjects. Count: ${subjects.length}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subjects retrieved successfully.",
            data: subjects,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.getAllSubjects = getAllSubjects;
// Function to get a subject by ID
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        const subject = yield subjectMongoObj.findById(id);
        if (!subject) {
            (0, logger_1.auditLog)(`Get Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        (0, logger_1.auditLog)(`Subject Retrieved: ${JSON.stringify(subject)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject retrieved successfully.",
            data: subject,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.getSubjectById = getSubjectById;
// Function to update a subject by ID
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        const subject = yield subjectMongoObj.findById(id);
        if (!subject) {
            (0, logger_1.auditLog)(`Update Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        const updatedSubject = yield subjectMongoObj.updateById(id, Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }));
        (0, logger_1.auditLog)(`Subject Updated: ID: ${id}, New Data: ${JSON.stringify(updatedSubject)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject updated successfully.",
            data: updatedSubject,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.updateSubject = updateSubject;
// Function to delete a subject by ID
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        const subject = yield subjectMongoObj.findById(id);
        if (!subject) {
            (0, logger_1.auditLog)(`Delete Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        yield subjectMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });
        (0, logger_1.auditLog)(`Subject Archived: ID: ${id}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject archived successfully.",
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.deleteSubject = deleteSubject;
// Function to add a lecture ID to a subject
const addLectureToSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId, lectureId } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        // Find the subject by ID
        const subject = yield subjectMongoObj.findById(subjectId);
        if (!subject) {
            (0, logger_1.auditLog)(`Add Lecture Failed: Subject not found with ID: ${subjectId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        // Check if the lecture ID already exists in the subject's lectureIds array
        if (subject.lectureIds.includes(lectureId)) {
            (0, logger_1.auditLog)(`Add Lecture Failed: Lecture ID ${lectureId} is already in subject ${subjectId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Lecture ID already exists in the subject.",
            };
        }
        // Add lecture ID to the subject's lectureIds array
        const updatedSubject = yield subjectMongoObj.updateById(subjectId, {
            $push: { lectureIds: lectureId },
            updatedAt: new Date(),
        });
        (0, logger_1.auditLog)(`Lecture Added: Lecture ID ${lectureId} added to Subject ID ${subjectId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture added to subject successfully.",
            data: updatedSubject,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.addLectureToSubject = addLectureToSubject;
// Function to remove a lecture ID from a subject
const removeLectureFromSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId, lectureId } = req.body;
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        // Find the subject by ID
        const subject = yield subjectMongoObj.findById(subjectId);
        if (!subject) {
            (0, logger_1.auditLog)(`Remove Lecture Failed: Subject not found with ID: ${subjectId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }
        // Check if the lecture ID exists in the subject's lectureIds array
        if (!subject.lectureIds.includes(lectureId)) {
            (0, logger_1.auditLog)(`Remove Lecture Failed: Lecture ID ${lectureId} not found in subject ${subjectId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Lecture ID not found in the subject.",
            };
        }
        // Remove lecture ID from the subject's lectureIds array
        const updatedSubject = yield subjectMongoObj.updateById(subjectId, {
            $pull: { lectureIds: lectureId },
            updatedAt: new Date(),
        });
        (0, logger_1.auditLog)(`Lecture Removed: Lecture ID ${lectureId} removed from Subject ID ${subjectId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Lecture removed from subject successfully.",
            data: updatedSubject,
        };
    }
    catch (error) {
        console.log("Error ", error.message);
        return { status: constant_1.default.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
});
exports.removeLectureFromSubject = removeLectureFromSubject;
//# sourceMappingURL=subject.controller.js.map