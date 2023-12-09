import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../helpers";
import { Project } from "../models";

// check to see if project exist by this id
// if not, throw an error, else continue
const isValidId = async (req: Request, res: Response, next: NextFunction) => {
  const { projectId } = req.params;
  const project = Project.findById(projectId);
  if (!project) {
    throw ErrorHandler(400, "Id is invalid.");
  }

  next();
};

export default isValidId;
