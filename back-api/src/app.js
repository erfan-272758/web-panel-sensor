import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";
import userRouter from "./routers/userRouter.js";
import errorController from "./controllers/errorController.js";
import deviceRouter from "./routers/deviceRouter.js";
import dataRouter from "./routers/dataRouter.js";
import { isTest } from "./config.js";

const app = express();

if (!isTest) app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", deviceRouter);
app.use("/api/v1", dataRouter);

app.use(errorController.errorCatch);

export default app;
