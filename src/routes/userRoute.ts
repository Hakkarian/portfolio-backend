import express from "express";
import userController from "../controllers/userController";
import middlewares from "../middlewares";
import googlePassport from '../middlewares/googlePassport';
import { loginLimitter, registerLimitter } from "../helpers";
import { upload } from "../helpers/multerPhoto";

const router = express.Router();

// paths for authentication

router.get(
  "/google/callback",
  googlePassport.authenticate("google", { scope: ["email", "profile"] }),
  userController.google
);
router.get("/verify/:verificationToken", userController.verifyEmail);
router.post("/register", registerLimitter, middlewares.checkRegister, userController.register);
router.post("/login", loginLimitter, middlewares.checkLogin, userController.login);
router.post("/logout", middlewares.authenticate, userController.logout);
router.post(
  "/google",
  googlePassport.authenticate("google", { scope: ["email", "profile"] })
);
router.get("/refresh", userController.refresh);
router.post("/verify", middlewares.checkEmail, userController.repeatVerifyEmail);
router.patch("/:userId/update", middlewares.authenticate, upload.single('avatar'), userController.updateInfo)


export default router;
