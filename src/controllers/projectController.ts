import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import fs from 'fs';
import { catchAsync, ErrorHandler } from "../helpers";
import cloudinary from "../helpers/cloudy";
import { Project } from "../models";
import { UserType } from "../models/userModel";

interface IQuery {
  page: number,
  limit: number
}


const plcholder =
  "https://res.cloudinary.com/dlw7wjlp3/image/upload/v1686575064/placeholder-product_zhkvqu.webp";
const plcId = "fghksdju374gdfhg";

const getAllProjects = catchAsync(async (req, res) => {
  const result = await Project.find()
  res.status(200).json(result);
})
const getPaginatedProjects = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = Number(page) || 1;
  const pageLimit = Number(limit) || 1;

  const projects = await Project.find().skip((pageNumber - 1) * pageLimit).limit(pageLimit);
  const totalProjects = await Project.countDocuments();
  res.status(200).json({projects, currentPage: pageNumber, totalPages: Math.ceil(totalProjects / pageLimit)})
})

const getLikedProjects = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const { id } = req.user as UserType;
  const pageNumber = Number(page || 1);
  const pageLimit = Number(limit || 1);

  const favorite = await Project.find({ liked: { $in: [id] } }).skip((pageNumber - 1) * pageLimit);

  res.status(200).json({favorite, currentPage: pageNumber, totalPages: Math.ceil(favorite.length / pageLimit)});
})

const addProject = async (req: Request, res: Response<any>) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
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

    fs.unlink(req.file.path, (err) => console.log(err));

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
    fs.unlink(req.file.path, (err) => console.log(err))
    
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
    res.status(200).json(projects);
  } catch (error) {
    next(error)
  }
};

const deleteProject = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw ErrorHandler(404, "Project not found.");
  }
  if (project.image.id) {
    await cloudinary.uploader.destroy(project.image.id);
  }
  const result = await Project.findByIdAndDelete(projectId);

  res.status(200).json({ message: "Deleted succesfully" });
});

const projectLike = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { page, limit } = req.query;
  const { likes, liked } = req.body;
  const { id } = req.user as UserType;
  const likedUser = liked.find((item: string) => item === id);

  const pageNumber = Number(page || 1);
  const pageLimit = Number(limit || 1);

  if (likedUser) {
    const filtered = liked.filter((item: string) => item !== id);
    const result = await Project.findByIdAndUpdate(projectId, { liked: filtered, likes }, { new: true });
    const projects = await Project.find()
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).json(projects);
  }

  const result = await Project.findByIdAndUpdate(projectId, { $push: { liked: id }, likes })
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);
  res.status(200).json(projects);
})

const projectDislike = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const { page, limit } = req.query;
  const { dislikes, disliked } = req.body;
  const { id } = req.user as UserType;
  const dislikedUser = disliked.find((item: string) => item === id);

  const pageNumber = Number(page || 1);
  const pageLimit = Number(limit || 1);

  if (dislikedUser) {
    const filtered = disliked.filter((item: string) => item !== id);
    const result = await Project.findByIdAndUpdate(
      projectId,
      { disliked: filtered, dislikes },
      { new: true }
    );
      
    const projects = await Project.find()
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).json(projects);
  }

  const result = await Project.findByIdAndUpdate(projectId, {
    $push: { disliked: id },
    dislikes,
  });
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);
  res.status(200).json(projects);
});

export default { getAllProjects, getPaginatedProjects, getLikedProjects, addProject, updateProject, deleteProject, projectLike, projectDislike };
