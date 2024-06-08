import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;
