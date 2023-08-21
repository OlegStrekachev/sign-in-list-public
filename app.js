import path from "path";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const expressApp = express();
expressApp.use((req, res, next) => {
  req.rawBody = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });

  req.on("end", () => {
    next();
  });
});

expressApp.use(express.json());

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Connected successfully");
});

const __dirname = path.resolve();

import router from "./my_modules/router/router.js";

// Middleware

expressApp.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

// expressApp.use(express.static("public"));
// expressApp.get("/kidstable", async (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "kidstable.html"));
// });

expressApp.use("/api", router);

export default expressApp;

//affgggfwe
