import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import fs from 'fs';
import { catchAsync, ErrorHandler } from "../helpers";
import cloudinary from "../helpers/cloudy";
import { Project } from "../models";

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
      console.log('no such photo');
      const project = await Project.create({
        title,
        description,
        image: { url: plcholder, id: "" },
      });
      return res.status(200).json(project);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${nanoid()}`,
      folder: "products",
    });
    const project = await Project.create({
      title,
      description,
      image: { url: result.secure_url, id: result.public_id },
    });
    console.log(project);
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
  }
};

const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;

    if (!req.file) {
      console.log("file does not exist");
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
      const projects = await Project.find()
      return res.status(200).json(projects);
    }
    console.log('file exists')
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
    });
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log('An error occured while deleting your file');
        return res.status(404).json({message: 'File does not exist'})
      }
    })
    
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        image: { url: result.secure_url, id: result.public_id },
      },
      { new: true }
    );
    const projects = await Project.find();
    console.log('projects', projects)
    res.status(200).json(projects);
  } catch (error) {
    next(error)
  }
};

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await Project.findByIdAndDelete(projectId);
  res.status(200).json({ message: "Deleted succesfully" });
});

const projectLike = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { likes } = req.body;

  const result = await Project.findByIdAndUpdate(projectId, {likes})
})

const projectDislike = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { dislikes } = req.body;

  const result = await Project.findByIdAndUpdate(projectId, {dislikes});
});

export default { getAllProjects, addProject, updateProject, deleteProject, projectLike, projectDislike };
