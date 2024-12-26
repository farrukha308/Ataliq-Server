import { Request, Response, NextFunction, Router } from "express";
import session from "express-session";
import {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    removeSubjectFromCourse,
    addSubjectToCourse,
    getCourseDetailsByGrade
} from "../controllers/course/course.controller"; // adjust import path based on your project structure

const courseRoutes = Router();

courseRoutes.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || "",
    })
);

//! Create a new course
courseRoutes.post(
    "/createCourse",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await createCourse(req, res);
        next(response);
    }
);

//! Get all courses
courseRoutes.get(
    "/getAllCourses",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await getAllCourses(req, res);
        next(response);
    }
);

//! Get a course by ID
courseRoutes.post(
    "/getCourseById",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await getCourseById(req, res);
        next(response);
    }
);

//! Update a course
courseRoutes.put(
    "/updateCourse",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await updateCourse(req, res);
        next(response);
    }
);

//! Delete (Archive) a course
courseRoutes.delete(
    "/deleteCourse",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await deleteCourse(req, res);
        next(response);
    }
);

//! Delete (Archive) a course
courseRoutes.post(
    "/addSubjectToCourse",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await addSubjectToCourse(req, res);
        next(response);
    }
);

//! Remove a subject from a course
courseRoutes.post(
    "/removeSubjectFromCourse",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await removeSubjectFromCourse(req, res);
        next(response);
    }
);

courseRoutes.post(
    "/getCourseDetailsByGrade",
    async (req: Request, res: Response, next: NextFunction) => {
        const response = await getCourseDetailsByGrade(req, res);
        next(response);
    }
);


export default courseRoutes;
