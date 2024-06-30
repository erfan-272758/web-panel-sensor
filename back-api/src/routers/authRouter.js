import { Router } from "express";
import authController from "../controllers/authController.js";

const authRouter = Router();

authRouter
  .get("/auth/login", authController.loginWithToken)
  .post("/auth/login", authController.loginWithUserPass);

export default authRouter;
