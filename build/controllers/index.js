"use strict";
// exporting for the sake of the further simplicity
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentCtrl = exports.projectCtrl = exports.userCtrl = void 0;
const userController_1 = __importDefault(require("./userController"));
exports.userCtrl = userController_1.default;
const projectController_1 = __importDefault(require("./projectController"));
exports.projectCtrl = projectController_1.default;
const commentController_1 = __importDefault(require("./commentController"));
exports.commentCtrl = commentController_1.default;
