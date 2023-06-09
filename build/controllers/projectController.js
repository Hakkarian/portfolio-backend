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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../helpers");
const cloudy_1 = __importDefault(require("../helpers/cloudy"));
const models_1 = require("../models");
const plcholder = "https://res.cloudinary.com/dlw7wjlp3/image/upload/v1686575064/placeholder-product_zhkvqu.webp";
const plcId = "fghksdju374gdfhg";
const getAllProjects = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield models_1.Project.find();
    res.status(200).json(projects);
}));
const addProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (!req.file) {
            const project = yield models_1.Project.create({
                title,
                description,
                image: { url: plcholder, id: "" },
            });
            return res.status(200).json(project);
        }
        const result = yield cloudy_1.default.uploader.upload(req.file.path, {
            public_id: `${(0, nanoid_1.nanoid)()}`,
            folder: "products",
        });
        const project = yield models_1.Project.create({
            title,
            description,
            image: { url: result.secure_url, id: result.public_id },
        });
        res.status(200).json(project);
    }
    catch (error) {
        console.log(error);
    }
});
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { title, description } = req.body;
        if (!req.file) {
            const project = yield models_1.Project.findByIdAndUpdate(projectId, {
                title,
                description,
                image: { url: plcholder, id: "" },
            }, { new: true });
            if (!project) {
                throw (0, helpers_1.ErrorHandler)(404, "Project not found.");
            }
            const projects = yield models_1.Project.find();
            return res.status(200).json(projects);
        }
        const projectOld = yield models_1.Project.findById(projectId);
        if (!projectOld) {
            throw (0, helpers_1.ErrorHandler)(404, "Project not found.");
        }
        if (projectOld.image.id) {
            yield cloudy_1.default.uploader.destroy(projectOld.image.id);
        }
        const result = yield cloudy_1.default.uploader.upload(req.file.path, {
            public_id: `${(0, nanoid_1.nanoid)()}`,
            folder: "products",
        });
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                console.log('An error occured while deleting your file');
                return res.status(404).json({ message: 'File does not exist' });
            }
        });
        const project = yield models_1.Project.findByIdAndUpdate(projectId, {
            title,
            description,
            image: { url: result.secure_url, id: result.public_id },
        }, { new: true });
        const projects = yield models_1.Project.find();
        res.status(200).json(projects);
    }
    catch (error) {
        next(error);
    }
});
const deleteProject = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const result = yield models_1.Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Deleted succesfully" });
}));
const projectLike = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { likes, liked } = req.body;
    const { id } = req.user;
    const likedUser = liked.find((item) => item === id);
    if (likedUser) {
        const filtered = liked.filter((item) => item !== id);
        const result = yield models_1.Project.findByIdAndUpdate(projectId, { liked: filtered, likes }, { new: true });
        const projects = yield models_1.Project.find();
        return res.status(200).json(projects);
    }
    const result = yield models_1.Project.findByIdAndUpdate(projectId, { $push: { liked: id }, likes });
    const projects = yield models_1.Project.find();
    res.status(200).json(projects);
}));
const projectDislike = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { dislikes, disliked } = req.body;
    const { id } = req.user;
    const dislikedUser = disliked.find((item) => item === id);
    if (dislikedUser) {
        const filtered = disliked.filter((item) => item !== id);
        const result = yield models_1.Project.findByIdAndUpdate(projectId, { disliked: filtered, dislikes }, { new: true });
        const projects = yield models_1.Project.find();
        return res.status(200).json(projects);
    }
    const result = yield models_1.Project.findByIdAndUpdate(projectId, {
        $push: { disliked: id },
        dislikes,
    });
    const projects = yield models_1.Project.find();
    res.status(200).json(projects);
}));
exports.default = { getAllProjects, addProject, updateProject, deleteProject, projectLike, projectDislike };
