import { NextFunction, Request, Response } from "express";
import { catchAsync, ErrorHandler } from "../helpers";
import cloudinary from "../helpers/cloudy";
import { Project } from "../models";
import { nanoid } from "nanoid";

const plcholder =
  "https://res.cloudinary.com/dlw7wjlp3/image/upload/v1686575064/placeholder-product_zhkvqu.webp";
const plcId = "fghksdju374gdfhg";

const getAllProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();
  res.status(200).json(projects);
});

const addProject = async (req: Request, res: Response<any>) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      const project = Project.create({
        title,
        description,
        image: { url: plcholder, id: "" },
      });
      return res.status(201).json(project);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${nanoid()}`,
      folder: "products",
    });
    const project = Project.create({
      title,
      description,
      image: { url: result.secure_url, id: result.public_id },
    });
    res.status(201).json(project);
  } catch (error) {
    console.log(error);
  }
};

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;

    if (!req.file) {
      const project = await Project.findByIdAndUpdate(
        projectId,
        {
          title,
          description,
          image: { url: plcholder, id: "" },
        },
        { new: true }
      );
      if (!project) {
        throw ErrorHandler(404, "Project not found.");
      }
      return res.status(200).json(project);
    }

    const projectOld = await Project.findById(projectId);
    if (!projectOld) {
      throw ErrorHandler(404, "Project not found.");
    }
    if (projectOld.image.id) {
      await cloudinary.uploader.destroy(projectOld.image.id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${nanoid()}`,
      folder: "products",
      width: 250,
      height: 100,
      crop: 'fill'
    });
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        image: { url: result.secure_url, id: result.public_id },
      },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error) {
    next(error)
  }
};

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await Project.findByIdAndDelete(projectId);
  res.status(200).json({ message: "Deleted succesfully" });
});

export default { getAllProjects, addProject, updateProject, deleteProject };
