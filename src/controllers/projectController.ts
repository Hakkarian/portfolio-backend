// *commentController interacts straight with database, specifically for comments
//
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import { catchAsync, ErrorHandler } from "../helpers";
// *import cloudinary to handle photos in database
import cloudinary from "../helpers/cloudy";
import { Project } from "../models";
import { UserType } from "../models/userModel";

// *for pagination
interface IQuery {
  page: number;
  limit: number;
}

// *placeholder for photos
const plcholder =
  "https://res.cloudinary.com/dlw7wjlp3/image/upload/v1686575064/placeholder-product_zhkvqu.webp";
const plcId = "fghksdju374gdfhg";

// find all projects
const getAllProjects = catchAsync(async (req, res) => {
  const result = await Project.find();
  res.status(200).json(result);
});

// find all paginated projects
const getPaginatedProjects = catchAsync(async (req, res) => {
  // *page starts for first page, limit is to determine how many elements are possible per one page
  const { page, limit } = req.query;

  // if page is undefined, start from first
  const pageNumber = Number(page) || 1;
  // if limit is undefined, then only 1 element per page is our limitation
  const pageLimit = Number(limit) || 1;

  // find all projects. then skip pages lesser than current page. For instance, if we have 5 pages with 50 elements each
  // and we want to go to the "4" page, then SKIP 3 pages and 150 elements overall.
  // after skipping, restrict chosen page to have no more than fixed number of elements
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);
  const totalProjects = await Project.find().count();

  // display in .json format
  res.status(200).json({
    projects,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalProjects / pageLimit),
  });
});

// every user has an array of favorite projects. Find the id of this user, page number and page limit as described before
// then find this favorite collection of elements by the user id, along with the length of this collection
// the display in .json format a collection of favorites by every user, current page and liked elements,
// divided by the total limit of the page
const getLikedProjects = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const { id } = req.user as UserType;
  const pageNumber = Number(page || 1);
  const pageLimit = Number(limit || 1);

  const favorite = await Project.find({ liked: { $in: [id] } }) 
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);

  const totalLikedProjects = await Project.find({
    liked: { $in: [id] },
  }).count();

  res.status(200).json({
    favorite,
    currentLikedPage: pageNumber,
    totalLikedPages: Math.ceil(totalLikedProjects / pageLimit),
  });
});

// *admin feature
// add project with option of adding with photo or without. If without, display placeholder of a photo instead
// if with the photo, upload it to the cloudinary
// then retrieve the information about uploaded photo, and paste this info to the "image" field
// and delete the old photo from the cloudinary
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

// update project by using existing project id
// if photo is not there, update only text
// if photo is there, save it to the cloudinary, and delete the old photo
const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        // to display new .json format, not old one
        { new: true }
      );
      if (!project) {
        throw ErrorHandler(404, "Project not found.");
      }
      const projects = await Project.find();
      return res.status(200).json(projects);
    }
    const projectOld = await Project.findById(projectId);
    // remove the project by its own id
    // if there is no such an id, throw an error
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
    fs.unlink(req.file.path, (err) => console.log(err));

    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// remove project by its own id
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

// check if user liked the project
// if it is, remove the liked project from an array of liked projects, and return the list of projects
// if not, add to the liked array, and return the list of projects
// it goes similarly with dislike functionality
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
    await Project.findByIdAndUpdate(
      projectId,
      { liked: filtered, likes },
      { new: true }
    );
    const projects = await Project.find()
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).json(projects);
  }
  await Project.findByIdAndUpdate(projectId, {
    $push: { liked: id },
    likes,
  });
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);
  res.status(200).json(projects);
});
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
    await Project.findByIdAndUpdate(
      projectId,
      { disliked: filtered, dislikes },
      { new: true }
    );

    const projects = await Project.find()
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);
    return res.status(200).json(projects);
  }

  await Project.findByIdAndUpdate(projectId, {
    $push: { disliked: id },
    dislikes,
  });
  const projects = await Project.find()
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit);
  res.status(200).json(projects);
});

export default {
  getAllProjects,
  getPaginatedProjects,
  getLikedProjects,
  addProject,
  updateProject,
  deleteProject,
  projectLike,
  projectDislike,
};
