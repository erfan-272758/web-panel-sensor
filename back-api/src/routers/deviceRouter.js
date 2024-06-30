import { Router } from "express";
import { protect } from "../decorator/authDecorator.js";
import deviceController from "../controllers/deviceController.js";

const deviceRouter = Router();

deviceRouter
  .get("/device", protect, deviceController.getAll)
  .get("/device/:id", protect, deviceController.getOne)
  .post("/device", protect, deviceController.create)
  .put("/device/:id", protect, deviceController.updateOne)
  .delete("/device/:id", protect, deviceController.deleteOne);

export default deviceRouter;
