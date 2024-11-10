import { Request, Response } from "express";
import CONSTANT from "../../../constant/constant";
import MongooseWrapper from "../../../wrapper/mongodb";
import MODELS from "../../models";
import { auditLog } from "../../../utils/logger";

// Function to create a course
export const createCourse = async (req: Request, res: Response) => {
    const { name, description, grade } = req.body;

    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        // Check if course already exists
        const existingCourse = await courseMongoObj.find({ name });

        if (existingCourse && existingCourse.length > 0) {
            auditLog(`Create Course Failed: Course with name ${name} already exists.`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course already exists.",
            };
        }

        // Create new course
        const newCourse = await courseMongoObj.create({
            name,
            description,
            grade,
            subjectIds: []
        });

        auditLog(`Course Created: ${JSON.stringify(newCourse)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Course created successfully.",
            data: newCourse,
        };
    } catch (error: any) {
        auditLog(`Error creating course: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error creating course.",
        };
    }
};

// Function to get all courses
export const getAllCourses = async (req: Request, res: Response) => {
    const { name, grade } = req.body;
    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        let courses;

        if (!name && !grade)
            courses = await courseMongoObj.findAll();
        else
            courses = await courseMongoObj.find(req.body);


        if (!courses || courses.length === 0) {
            auditLog(`Get All Courses Failed: No courses found.`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "No courses found.",
            };
        }

        auditLog(`Retrieved all courses. Count: ${courses.length}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Courses retrieved successfully.",
            data: courses,
        };
    } catch (error: any) {
        auditLog(`Error retrieving courses: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error retrieving courses.",
        };
    }
};

// Function to get a course by ID
export const getCourseById = async (req: Request, res: Response) => {
    const { id } = req.body;

    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        const course = await courseMongoObj.findById(id);

        if (!course) {
            auditLog(`Get Course Failed: Course not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }

        auditLog(`Course Retrieved: ${JSON.stringify(course)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Course retrieved successfully.",
            data: course,
        };
    } catch (error: any) {
        auditLog(`Error retrieving course by ID: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error retrieving course.",
        };
    }
};

// Function to update a course
export const updateCourse = async (req: Request, res: Response) => {
    const { id, name, description, grade } = req.body;

    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        const course = await courseMongoObj.findById(id);

        if (!course) {
            auditLog(`Update Course Failed: Course not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }

        const updatedCourse = await courseMongoObj.updateById(id, {
            name,
            description,
            grade,
            updatedAt: new Date(),
        });

        auditLog(`Course Updated: ID: ${id}, New Data: ${JSON.stringify(updatedCourse)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Course updated successfully.",
            data: updatedCourse,
        };
    } catch (error: any) {
        auditLog(`Error updating course: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error updating course.",
        };
    }
};

// Function to delete a course
export const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.body;
    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        const course = await courseMongoObj.findById(id);

        if (!course) {
            auditLog(`Delete Course Failed: Course not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }

        await courseMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });

        auditLog(`Course Archived: ID: ${id}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Course archived successfully.",
        };
    } catch (error: any) {
        auditLog(`Error deleting course: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error deleting course.",
        };
    }
};


// Function to add a subject ID to a course
export const addSubjectToCourse = async (req: Request, res: Response) => {
    const { courseId, subjectId } = req.body; // Assuming courseId and subjectId are passed in the request body

    const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

    try {
        // Check if the course exists
        const course = await courseMongoObj.findById(courseId);

        if (!course) {
            auditLog(`Add Subject to Course Failed: Course not found with ID: ${courseId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }

        // Check if the subject is already associated with the course
        if (course.subjectIds.includes(subjectId)) {
            auditLog(`Add Subject to Course Failed: Subject already added to Course ID: ${courseId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject already added to this course.",
            };
        }

        // Add the subject ID to the course's subjectIds array
        course.subjectIds.push(subjectId);

        // Update the course with the new subjectIds array
        const updatedCourse = await courseMongoObj.updateById(courseId, { subjectIds: course.subjectIds });

        auditLog(`Subject added to Course ID: ${courseId} | Updated Course: ${JSON.stringify(updatedCourse)}`);

        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject added to course successfully.",
            data: updatedCourse,
        };
    } catch (error: any) {
        auditLog(`Error adding subject to course: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error adding subject to course.",
        };
    }
};

// Function to remove a subject from a course
export const removeSubjectFromCourse = async (req: Request, res: Response) => {
    try {
        const { courseId, subjectId } = req.body;

        const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);

        // Find the course by ID
        const course = await courseMongoObj.findById(courseId);

        if (!course) {
            auditLog(`Remove Subject Failed: Course not found with ID: ${courseId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Course not found.",
            };
        }

        // Check if the subjectId exists in the course's subjectIds
        const subjectIndex = course.subjectIds.indexOf(subjectId);
        if (subjectIndex === -1) {
            auditLog(`Remove Subject Failed: Subject not found in course with ID: ${courseId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found in course.",
            };
        }

        // Remove the subjectId from the subjectIds array
        course.subjectIds.splice(subjectIndex, 1);

        // Update the course with the modified subjectIds
        const updatedCourse = await courseMongoObj.updateById(courseId, {
            subjectIds: course.subjectIds,
            updatedAt: new Date(),
        });

        auditLog(`Subject Removed: Course ID: ${courseId}, Subject ID: ${subjectId}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject removed from course successfully.",
            data: updatedCourse,
        };
    } catch (error: any) {
        auditLog(`Error removing subject from course: ${error.message}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error removing subject from course.",
        };
    }
};

// Function to get course details by grade
export const getCourseDetailsByGrade = async (req: Request, res: Response) => {
    try {
        const { grade } = req.body;

        const courseMongoObj = new MongooseWrapper<any>(MODELS.COURSE);
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        // Fetch courses for the specified grade
        const courses = await courseMongoObj.find({ grade });

        if (!courses || courses.length === 0) {
            auditLog(`Get Courses by Grade Failed: No courses found for grade ${grade}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "No courses found for the specified grade.",
            };
        }

        // Populate subjects for each course based on subjectIds
        const result = [];
        for (const course of courses) {
            // Fetch subjects by `subjectIds` for each course
            const subjects = await subjectMongoObj.find({ _id: { $in: course.subjectIds } });

            result.push({
                course: {
                    _id: course._id,
                    name: course.name,
                    grade: course.grade,
                    createdAt: course.createdAt,
                    subjectIds: course.subjectIds,
                    isArchive: course.isArchive
                },
                subjects
            });
        }


        auditLog(`Courses and Subjects Retrieved for Grade ${grade}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Courses and subjects retrieved successfully.",
            data: result,
        };
    } catch (error: any) {
        auditLog(`Error retrieving courses and subjects for grade: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Error retrieving courses and subjects.",
            error: error.message,
        };
    }
};
