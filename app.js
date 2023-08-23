import path from "path";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const expressApp = express();

expressApp.use(express.json());

expressApp.use("/api/deploy", (req, res, next) => {
  req.rawBody = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });

  req.on("end", () => {
    next();
  });
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Connected successfully");
});

const __dirname = path.resolve();

import router from "./my_modules/router/router.js";

expressApp.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

expressApp.use("/api", router);

export default expressApp;
