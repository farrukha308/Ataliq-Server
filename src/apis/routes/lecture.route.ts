import { Request, Response, NextFunction } from "express";
import {
    createLecture,
    getLectureById,
    getAllLectures,
    updateLecture, 
    deleteLecture
} from "../controllers/lecture/lecture.controller";

const express = require("express");
const lectureRoutes = express.Router();

// Create Lecture
lectureRoutes.post(
    "/createLecture",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await createLecture(req, res);
        next(response);
    }
);

// Get Lecture by ID
lectureRoutes.get(
    "/getLectureById",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await getLectureById(req, res);
        next(response);
    }
);

// Get All Lectures
lectureRoutes.post(
    "/getAllLectures",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await getAllLectures(req, res);
        next(response);
    }
);

// Update Lecture
lectureRoutes.put(
    "/updateLecture",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await updateLecture(req, res);
        next(response);
    }
);

// Delete Lecture
lectureRoutes.delete(
    "/deleteLecture",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await deleteLecture(req, res);
        next(response);
    }
);

export default lectureRoutes;
