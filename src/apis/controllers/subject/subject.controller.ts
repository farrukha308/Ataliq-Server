import { Request, Response, NextFunction } from 'express';
import MongooseWrapper from '../../../wrapper/mongodb';
import MODELS from '../../models';
import { auditLog } from '../../../utils/logger';
import CONSTANT from '../../../constant/constant';

// Function to create a new subject
export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        const existingSubject = await subjectMongoObj.find({ name });
        if (existingSubject.length > 0) {
            auditLog(`Create Subject Failed: Subject with name ${name} already exists.`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject already exists.",
            };
        }

        const newSubject = await subjectMongoObj.create({ name, description });
        auditLog(`Subject Created: ${JSON.stringify(newSubject)}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject created successfully.",
            data: newSubject,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};

// Function to get all subjects
export const getAllSubjects = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        let subjects;
        if (!name)
            subjects = await subjectMongoObj.findAll();
        else 
            subjects = await subjectMongoObj.find({name});

        auditLog(`Retrieved all subjects. Count: ${subjects.length}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subjects retrieved successfully.",
            data: subjects,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};

// Function to get a subject by ID
export const getSubjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        const subject = await subjectMongoObj.findById(id);
        if (!subject) {
            auditLog(`Get Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        auditLog(`Subject Retrieved: ${JSON.stringify(subject)}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject retrieved successfully.",
            data: subject,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};

// Function to update a subject by ID
export const updateSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        const subject = await subjectMongoObj.findById(id);
        if (!subject) {
            auditLog(`Update Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        const updatedSubject = await subjectMongoObj.updateById(id, { ...req.body, updatedAt: new Date() });
        auditLog(`Subject Updated: ID: ${id}, New Data: ${JSON.stringify(updatedSubject)}`);

        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject updated successfully.",
            data: updatedSubject,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};

// Function to delete a subject by ID
export const deleteSubject = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        const subject = await subjectMongoObj.findById(id);
        if (!subject) {
            auditLog(`Delete Subject Failed: Subject not found with ID: ${id}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        await subjectMongoObj.updateById(id, { isArchive: true, updatedAt: new Date() });
        auditLog(`Subject Archived: ID: ${id}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Subject archived successfully.",
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};

// Function to add a lecture ID to a subject
export const addLectureToSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId, lectureId } = req.body;

        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        // Find the subject by ID
        const subject = await subjectMongoObj.findById(subjectId);
        if (!subject) {
            auditLog(`Add Lecture Failed: Subject not found with ID: ${subjectId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        // Check if the lecture ID already exists in the subject's lectureIds array
        if (subject.lectureIds.includes(lectureId)) {
            auditLog(`Add Lecture Failed: Lecture ID ${lectureId} is already in subject ${subjectId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Lecture ID already exists in the subject.",
            };
        }

        // Add lecture ID to the subject's lectureIds array
        const updatedSubject = await subjectMongoObj.updateById(subjectId, {
            $push: { lectureIds: lectureId },
            updatedAt: new Date(),
        });

        auditLog(`Lecture Added: Lecture ID ${lectureId} added to Subject ID ${subjectId}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture added to subject successfully.",
            data: updatedSubject,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};


// Function to remove a lecture ID from a subject
export const removeLectureFromSubject = async (req: Request, res: Response) => {
    try {
        const { subjectId, lectureId } = req.body;

        const subjectMongoObj = new MongooseWrapper<any>(MODELS.COURSE_SUBJECT);

        // Find the subject by ID
        const subject = await subjectMongoObj.findById(subjectId);
        if (!subject) {
            auditLog(`Remove Lecture Failed: Subject not found with ID: ${subjectId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Subject not found.",
            };
        }

        // Check if the lecture ID exists in the subject's lectureIds array
        if (!subject.lectureIds.includes(lectureId)) {
            auditLog(`Remove Lecture Failed: Lecture ID ${lectureId} not found in subject ${subjectId}`);
            return {
                status: CONSTANT.RESPONSE_STATUS.FAIL,
                message: "Lecture ID not found in the subject.",
            };
        }

        // Remove lecture ID from the subject's lectureIds array
        const updatedSubject = await subjectMongoObj.updateById(subjectId, {
            $pull: { lectureIds: lectureId },
            updatedAt: new Date(),
        });

        auditLog(`Lecture Removed: Lecture ID ${lectureId} removed from Subject ID ${subjectId}`);
        
        return {
            status: CONSTANT.RESPONSE_STATUS.SUCCESS,
            message: "Lecture removed from subject successfully.",
            data: updatedSubject,
        };
    } catch (error: any) {
        console.log("Error ", error.message)
        return { status: CONSTANT.RESPONSE_STATUS.FAIL, message: "Internal Server Error" };
    }
};
