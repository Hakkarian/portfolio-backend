import { Request, Response, NextFunction } from "express";
import { catchAsync, ErrorHandler } from "../helpers";
import { Project } from "../models";

const isValidId = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  const project = Project.findById(projectId);
  if (!project) {
    throw ErrorHandler(400, "Id is invalid.");
  }

  next();
};

export default isValidId;
