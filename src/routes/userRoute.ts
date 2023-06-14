import express from "express";
import limitter from 'express-rate-limit';
import userController from "../controllers/userController";
import middlewares from "../middlewares";
import googlePassport from '../middlewares/googlePassport';
import { loginLimitter, registerLimitter } from "../helpers";

const router = express.Router();

router.post("/register", registerLimitter, middlewares.checkRegister, userController.register);
router.post("/login", loginLimitter, middlewares.checkLogin, userController.login);
router.post("/logout", middlewares.authenticate, userController.logout);
router.post(
  "/google",
  googlePassport.authenticate("google", { scope: ["email", "profile"] })
);
router.post("/verify", middlewares.checkEmail, userController.repeatVerifyEmail)
router.get(
  "/google/callback",
  googlePassport.authenticate("google", { scope: ["email", "profile"] }),
  userController.google
);
router.get("/current", middlewares.authenticate, userController.current)
router.get("/verify/:verificationToken", userController.verifyEmail)


export default router;
