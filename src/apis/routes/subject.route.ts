import { Router, Request, Response, NextFunction } from 'express';
import { addLectureToSubject, createSubject, deleteSubject, getAllSubjects, getSubjectById, removeLectureFromSubject, updateSubject } from '../controllers/subject/subject.controller';

const subjectRoutes = Router();

subjectRoutes.post(
    "/createSubject",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await createSubject(req, res);
        next(response);
    }
);

subjectRoutes.get(
    "/getAllSubjects",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await getAllSubjects(req, res);
        next(response);
    }
);

subjectRoutes.post(
    "/getSubjectById",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await getSubjectById(req, res);
        next(response);
    }
);

subjectRoutes.put(
    "/updateSubject",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await updateSubject(req, res);
        next(response);
    }
);

subjectRoutes.delete(
    "/deleteSubject",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await deleteSubject(req, res);
        next(response);
    }
);

subjectRoutes.post(
    "/addLectureToSubject",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await addLectureToSubject(req, res);
        next(response);
    }
);

subjectRoutes.post(
    "/removeLectureFromSubject",
    async (req: Request, res: Response, next: NextFunction) => {
        let response = await removeLectureFromSubject(req, res);
        next(response);
    }
);

export default subjectRoutes;
