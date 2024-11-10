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
exports.getCourseDetailsByGrade = exports.removeSubjectFromCourse = exports.addSubjectToCourse = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const constant_1 = __importDefault(require("../../../constant/constant"));
const mongodb_1 = __importDefault(require("../../../wrapper/mongodb"));
const models_1 = __importDefault(require("../../models"));
const logger_1 = require("../../../utils/logger");
// Function to create a course
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, grade } = req.body;
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        // Check if course already exists
        const existingCourse = yield courseMongoObj.find({ name });
        if (existingCourse && existingCourse.length > 0) {
            (0, logger_1.auditLog)(`Create Course Failed: Course with name ${name} already exists.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course already exists.",
            };
        }
        // Create new course
        const newCourse = yield courseMongoObj.create({
            name,
            description,
            grade,
            subjectIds: []
        });
        (0, logger_1.auditLog)(`Course Created: ${JSON.stringify(newCourse)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Course created successfully.",
            data: newCourse,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error creating course: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error creating course.",
        };
    }
});
exports.createCourse = createCourse;
// Function to get all courses
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, grade } = req.body;
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        let courses;
        if (!name && !grade)
            courses = yield courseMongoObj.findAll();
        else
            courses = yield courseMongoObj.find(req.body);
        if (!courses || courses.length === 0) {
            (0, logger_1.auditLog)(`Get All Courses Failed: No courses found.`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "No courses found.",
            };
        }
        (0, logger_1.auditLog)(`Retrieved all courses. Count: ${courses.length}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Courses retrieved successfully.",
            data: courses,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error retrieving courses: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error retrieving courses.",
        };
    }
});
exports.getAllCourses = getAllCourses;
// Function to get a course by ID
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        const course = yield courseMongoObj.findById(id);
        if (!course) {
            (0, logger_1.auditLog)(`Get Course Failed: Course not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }
        (0, logger_1.auditLog)(`Course Retrieved: ${JSON.stringify(course)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Course retrieved successfully.",
            data: course,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error retrieving course by ID: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error retrieving course.",
        };
    }
});
exports.getCourseById = getCourseById;
// Function to update a course
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, description, grade } = req.body;
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        const course = yield courseMongoObj.findById(id);
        if (!course) {
            (0, logger_1.auditLog)(`Update Course Failed: Course not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }
        const updatedCourse = yield courseMongoObj.updateById(id, {
            name,
            description,
            grade,
            updatedAt: new Date(),
        });
        (0, logger_1.auditLog)(`Course Updated: ID: ${id}, New Data: ${JSON.stringify(updatedCourse)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Course updated successfully.",
            data: updatedCourse,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error updating course: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error updating course.",
        };
    }
});
exports.updateCourse = updateCourse;
// Function to delete a course
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        const course = yield courseMongoObj.findById(id);
        if (!course) {
            (0, logger_1.auditLog)(`Delete Course Failed: Course not found with ID: ${id}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }
        yield courseMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });
        (0, logger_1.auditLog)(`Course Archived: ID: ${id}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Course archived successfully.",
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error deleting course: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error deleting course.",
        };
    }
});
exports.deleteCourse = deleteCourse;
// Function to add a subject ID to a course
const addSubjectToCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, subjectId } = req.body; // Assuming courseId and subjectId are passed in the request body
    const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
    try {
        // Check if the course exists
        const course = yield courseMongoObj.findById(courseId);
        if (!course) {
            (0, logger_1.auditLog)(`Add Subject to Course Failed: Course not found with ID: ${courseId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }
        // Check if the subject is already associated with the course
        if (course.subjectIds.includes(subjectId)) {
            (0, logger_1.auditLog)(`Add Subject to Course Failed: Subject already added to Course ID: ${courseId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject already added to this course.",
            };
        }
        // Add the subject ID to the course's subjectIds array
        course.subjectIds.push(subjectId);
        // Update the course with the new subjectIds array
        const updatedCourse = yield courseMongoObj.updateById(courseId, { subjectIds: course.subjectIds });
        (0, logger_1.auditLog)(`Subject added to Course ID: ${courseId} | Updated Course: ${JSON.stringify(updatedCourse)}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject added to course successfully.",
            data: updatedCourse,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error adding subject to course: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error adding subject to course.",
        };
    }
});
exports.addSubjectToCourse = addSubjectToCourse;
// Function to remove a subject from a course
const removeSubjectFromCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, subjectId } = req.body;
        const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
        // Find the course by ID
        const course = yield courseMongoObj.findById(courseId);
        if (!course) {
            (0, logger_1.auditLog)(`Remove Subject Failed: Course not found with ID: ${courseId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }
        // Check if the subjectId exists in the course's subjectIds
        const subjectIndex = course.subjectIds.indexOf(subjectId);
        if (subjectIndex === -1) {
            (0, logger_1.auditLog)(`Remove Subject Failed: Subject not found in course with ID: ${courseId}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "Subject not found in course.",
            };
        }
        // Remove the subjectId from the subjectIds array
        course.subjectIds.splice(subjectIndex, 1);
        // Update the course with the modified subjectIds
        const updatedCourse = yield courseMongoObj.updateById(courseId, {
            subjectIds: course.subjectIds,
            updatedAt: new Date(),
        });
        (0, logger_1.auditLog)(`Subject Removed: Course ID: ${courseId}, Subject ID: ${subjectId}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Subject removed from course successfully.",
            data: updatedCourse,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error removing subject from course: ${error.message}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error removing subject from course.",
        };
    }
});
exports.removeSubjectFromCourse = removeSubjectFromCourse;
// Function to get course details by grade
const getCourseDetailsByGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { grade } = req.body;
        const courseMongoObj = new mongodb_1.default(models_1.default.COURSE);
        const subjectMongoObj = new mongodb_1.default(models_1.default.COURSE_SUBJECT);
        // Fetch courses for the specified grade
        const courses = yield courseMongoObj.find({ grade });
        if (!courses || courses.length === 0) {
            (0, logger_1.auditLog)(`Get Courses by Grade Failed: No courses found for grade ${grade}`);
            return {
                status: constant_1.default.RESPONSE_STATUS.FAIL,
                message: "No courses found for the specified grade.",
            };
        }
        // Populate subjects for each course based on subjectIds
        const result = [];
        for (const course of courses) {
            // Fetch subjects by `subjectIds` for each course
            const subjects = yield subjectMongoObj.find({ _id: { $in: course.subjectIds } });
            result.push(
            //{
            // course: {
            //     _id: course._id,
            //     name: course.name,
            //     grade: course.grade,
            //     createdAt: course.createdAt,
            //     subjectIds: course.subjectIds,
            //     isArchive: course.isArchive
            // },
            ...subjects
            //}
            );
        }
        (0, logger_1.auditLog)(`Courses and Subjects Retrieved for Grade ${grade}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.SUCCESS,
            message: "Courses and subjects retrieved successfully.",
            data: result,
        };
    }
    catch (error) {
        (0, logger_1.auditLog)(`Error retrieving courses and subjects for grade: ${error}`);
        return {
            status: constant_1.default.RESPONSE_STATUS.FAIL,
            message: "Error retrieving courses and subjects.",
            error: error.message,
        };
    }
});
exports.getCourseDetailsByGrade = getCourseDetailsByGrade;
//# sourceMappingURL=course.controller.js.map