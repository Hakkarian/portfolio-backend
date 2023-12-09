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
const models_1 = require("../models");
// check to see if project exist by this id
// if not, throw an error, else continue
const isValidId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const project = models_1.Project.findById(projectId);
    if (!project) {
        throw (0, helpers_1.ErrorHandler)(400, "Id is invalid.");
    }
    next();
});
exports.default = isValidId;
