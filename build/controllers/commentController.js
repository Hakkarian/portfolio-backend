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
const helpers_1 = require("../helpers");
// import { AuthenticatedRequest } from "../middlewares/authenticate";
const models_1 = require("../models");
// import { UserType } from "../models/userModel";
const getAllComments = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const comments = yield models_1.Comment.find({ projectId });
    console.log(comments);
    res.status(200).json(comments);
}));
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { _id, username, email, avatar } = req.user;
    const userId = _id;
    const { content } = req.body;
    const comment = yield models_1.Comment.create({
        projectId,
        content,
        author: { username, email, avatar, userId },
    });
    res.status(201).json(comment);
});
const updateComment = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = yield models_1.Comment.findByIdAndUpdate(commentId, req.body, { new: true });
    res.status(201).json(comment);
}));
const deleteComment = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const comment = yield models_1.Comment.findByIdAndDelete(commentId);
    res.status(201).json({ message: "Comment has been deleted succesfully" });
}));
exports.default = { getAllComments, addComment, updateComment, deleteComment };
