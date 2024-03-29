"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const middlewares_1 = __importDefault(require("../middlewares"));
const googlePassport_1 = __importDefault(require("../middlewares/googlePassport"));
const helpers_1 = require("../helpers");
const multerPhoto_1 = require("../helpers/multerPhoto");
const router = express_1.default.Router();
// paths for authentication
router.get("/google/callback", googlePassport_1.default.authenticate("google", { scope: ["email", "profile"] }), userController_1.default.google);
router.get("/verify/:verificationToken", userController_1.default.verifyEmail);
router.post("/register", helpers_1.registerLimitter, middlewares_1.default.checkRegister, userController_1.default.register);
router.post("/login", helpers_1.loginLimitter, middlewares_1.default.checkLogin, userController_1.default.login);
router.post("/logout", middlewares_1.default.authenticate, userController_1.default.logout);
router.post("/google", googlePassport_1.default.authenticate("google", { scope: ["email", "profile"] }));
router.get("/refresh", userController_1.default.refresh);
router.post("/verify", middlewares_1.default.checkEmail, userController_1.default.repeatVerifyEmail);
router.patch("/:userId/update", middlewares_1.default.authenticate, multerPhoto_1.upload.single('avatar'), userController_1.default.updateInfo);
exports.default = router;
