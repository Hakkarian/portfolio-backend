// commentController interacts straight with database, specifically for comments
//
import { Request, RequestHandler, Response } from "express";
// *just a wrapper for try&catch block
import { catchAsync } from "../helpers";
// import { AuthenticatedRequest } from "../middlewares/authenticate";
// *model for a comment
import { Comment } from "../models";
import { UserType } from "../models/userModel";
// import { AuthenticatedRequest } from "../middlewares/authenticate";
// import { UserType } from "../models/userModel";

// *find all comments by id of the project of the project list
const getAllComments = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const comments = await Comment.find({ projectId });

  res.status(200).json(comments);
});

// *add comment  by id of the project of the project list
const addComment = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { _id, username, email, location, phone, avatar } =
    req.user as UserType;
  console.log('user credentials', req.user); 
  const userId = _id;
  const { content } = req.body;
  const comment = await Comment.create({
    projectId,
    content: content,
    author: { username, email, location, phone, avatar, userId },
  });
  res.status(201).json(comment);
};

// *update comment by its own id and id of the project of the project list
const updateComment = catchAsync(async (req, res) => {
  const { projectId, commentId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );
  const comments = await Comment.find({ projectId });
  res.status(200).json(comments);
});

// *delete comment by its own id and id of the project of the project list
const deleteComment = catchAsync(async (req, res) => {
  const { projectId, commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId);
  const comments = await Comment.find({ projectId });
  res.status(200).json(comments);
});

export default { getAllComments, addComment, updateComment, deleteComment };
