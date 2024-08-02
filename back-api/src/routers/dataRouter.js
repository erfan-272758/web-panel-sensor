import { Router } from "express";
import { protect } from "../decorator/authDecorator.js";
import dataController from "../controllers/dataController.js";

const dataRouter = Router();

dataRouter.get(
  "/data/:sensorClass/:sensorId",
  protect,
  dataController.getSensorData
);

export default dataRouter;
