import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect } from "../decorator/authDecorator.js";
const userRouter = Router();

userRouter
  .get("/user", protect, userController.getAll)
  .post("/user", protect, userController.createOne)
  .put("/user/:id", protect, userController.updateOne)
  .delete("/user/:id", protect, userController.deleteOne);

export default userRouter;
