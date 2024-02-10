"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// *just a wrapper for try&catch block
const helpers_1 = require("../helpers");
// import { AuthenticatedRequest } from "../middlewares/authenticate";
// *model for a comment
const models_1 = require("../models");
// import { AuthenticatedRequest } from "../middlewares/authenticate";
// import { UserType } from "../models/userModel";
// *find all comments by id of the project of the project list
const getAllComments = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const comments = yield models_1.Comment.find({ projectId });
    res.status(200).json(comments);
}));
// *add comment  by id of the project of the project list
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { _id, username, email, location, phone, avatar } = req.user;
    console.log('user credentials', req.user);
    const userId = _id;
    const { content } = req.body;
    const comment = yield models_1.Comment.create({
        projectId,
        content: content,
        author: { username, email, location, phone, avatar, userId },
    });
    res.status(201).json(comment);
});
// *update comment by its own id and id of the project of the project list
const updateComment = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, commentId } = req.params;
    const { content } = req.body;
    const comment = yield models_1.Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    const comments = yield models_1.Comment.find({ projectId });
    res.status(200).json(comments);
}));
// *delete comment by its own id and id of the project of the project list
const deleteComment = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, commentId } = req.params;
    const comment = yield models_1.Comment.findByIdAndDelete(commentId);
    const comments = yield models_1.Comment.find({ projectId });
    res.status(200).json(comments);
}));
exports.default = { getAllComments, addComment, updateComment, deleteComment };
