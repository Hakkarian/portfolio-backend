import { Request, Response, NextFunction } from 'express';
import { catchAsync, errorHandler } from "../helpers";
import { Project } from "../models";

const isValidId = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;
    const project = Project.findById(projectId);
    if (!project) {
        throw errorHandler(400, "Id is invalid.")
    }
    console.log('middlewares', project)

    next();
}

export default isValidId;