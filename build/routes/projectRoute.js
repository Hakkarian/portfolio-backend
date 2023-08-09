"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = __importDefault(require("../middlewares"));
const controllers_1 = require("../controllers");
const multerPhoto_1 = require("../helpers/multerPhoto");
const router = express_1.default.Router();
router.get("/all", controllers_1.projectCtrl.getAllProjects);
router.get("/", controllers_1.projectCtrl.getPaginatedProjects);
router.get("/liked", middlewares_1.default.authenticate, controllers_1.projectCtrl.getLikedProjects);
router.post("/", middlewares_1.default.authenticate, multerPhoto_1.upload.single('image'), controllers_1.projectCtrl.addProject);
router.patch("/:projectId", middlewares_1.default.authenticate, multerPhoto_1.upload.single("image"), controllers_1.projectCtrl.updateProject);
router.delete("/:projectId", middlewares_1.default.authenticate, controllers_1.projectCtrl.deleteProject);
router.put("/:projectId/like", middlewares_1.default.authenticate, controllers_1.projectCtrl.projectLike);
router.put("/:projectId/dislike", middlewares_1.default.authenticate, controllers_1.projectCtrl.projectDislike);
exports.default = router;
