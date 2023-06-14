"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const multerPhoto_1 = require("../helpers/multerPhoto");
const router = express_1.default.Router();
router.get("/", controllers_1.projectCtrl.getAllProjects);
router.post("/", multerPhoto_1.upload.single('image'), controllers_1.projectCtrl.addProject);
router.patch("/:projectId", multerPhoto_1.upload.single('image'), controllers_1.projectCtrl.updateProject);
router.delete("/:projectId", controllers_1.projectCtrl.deleteProject);
exports.default = router;
