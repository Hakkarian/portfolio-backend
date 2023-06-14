"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = __importDefault(require("../middlewares"));
const router = express_1.default.Router();
router.get('/:projectId/comments', middlewares_1.default.authenticate, controllers_1.commentCtrl.getAllComments);
router.post("/:projectId/comments", middlewares_1.default.authenticate, controllers_1.commentCtrl.addComment);
router.patch("/:projectId/comments/:commentId", middlewares_1.default.authenticate, controllers_1.commentCtrl.updateComment);
router.delete("/:projectId/comments/:commentId", middlewares_1.default.authenticate, controllers_1.commentCtrl.deleteComment);
exports.default = router;
