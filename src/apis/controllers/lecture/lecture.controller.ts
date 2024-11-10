import { Request, Response } from "express";
import MongooseWrapper from "../../../wrapper/mongodb";
import { auditLog } from "../../../utils/logger";
import CONSTANT from "../../../constant/constant";
import MODELS from "../../models";

// Create a new Lecture
export const createLecture = async (req: Request, res: Response) => {
    try {
        const { title, description, videoLink, subjectId } = req.body;
        
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);
        const subject = await subjectMongoObj.findById(subjectId);

        if (!subject) {
            auditLog(`Get subject Failed: subject not found with ID: ${subjectId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        const lectureMongoObj = new MongooseWrapper<any>(MODELS.SUBJECT_LECTURE);
        const newLecture = await lectureMongoObj.create({
            title,
            description,
            videoLink,
            subjectId
        });

        auditLog(`Lecture Created: ${JSON.stringify(newLecture)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture created successfully.",
            data: newLecture,
        };
    } catch (error) {
        auditLog(`Create Lecture Failed: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Failed to create lecture.",
        };
    }
};

// Get a Lecture by ID
export const getLectureById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        
        const lectureMongoObj = new MongooseWrapper<any>(MODELS.SUBJECT_LECTURE);
        const lecture = await lectureMongoObj.findById(id);

        if (!lecture) {
            auditLog(`Get Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }

        auditLog(`Lecture Retrieved: ${JSON.stringify(lecture)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture retrieved successfully.",
            data: lecture,
        };
    } catch (error) {
        auditLog(`Get Lecture Failed: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Failed to get lecture.",
        };
    }
};

// Get All Lectures
export const getAllLectures = async (req: Request, res: Response) => {
    try {
        const lectureMongoObj = new MongooseWrapper<any>(MODELS.SUBJECT_LECTURE);
        
        let lectures;
        if (!req.body)
            lectures = await lectureMongoObj.findAll();
        else
            lectures = await lectureMongoObj.find(req.body);

        auditLog(`Retrieved all lectures. Count: ${lectures.length}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lectures retrieved successfully.",
            data: lectures,
        };
    } catch (error) {
        auditLog(`Get All Lectures Failed: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Failed to retrieve lectures.",
        };
    }
};

// Update a Lecture
export const updateLecture = async (req: Request, res: Response) => {
    try {
        const { id, title, description, videoLink } = req.body;
        
        const lectureMongoObj = new MongooseWrapper<any>(MODELS.SUBJECT_LECTURE);
        const lecture = await lectureMongoObj.findById(id);

        if (!lecture) {
            auditLog(`Update Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }

        const updatedLecture = await lectureMongoObj.updateById(id, {
            title,
            description,
            videoLink,
            updatedAt: new Date(),
        });

        auditLog(`Lecture Updated: ID: ${id}, New Data: ${JSON.stringify(updatedLecture)}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture updated successfully.",
            data: updatedLecture,
        };
    } catch (error) {
        auditLog(`Update Lecture Failed: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Failed to update lecture.",
        };
    }
};

// Delete a Lecture
export const deleteLecture = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        
        const lectureMongoObj = new MongooseWrapper<any>(MODELS.SUBJECT_LECTURE);
        const lecture = await lectureMongoObj.findById(id);

        if (!lecture) {
            auditLog(`Delete Lecture Failed: Lecture not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Lecture not found.",
            };
        }

        await lectureMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });

        auditLog(`Lecture Archived: ID: ${id}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture archived successfully.",
        };
    } catch (error) {
        auditLog(`Delete Lecture Failed: ${error}`);
        return {
            status: CONSTANT.RESPONSE_STATUS.FAIL,
            message: "Failed to delete lecture.",
        };
    }
};
