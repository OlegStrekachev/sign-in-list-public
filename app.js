import path from "path";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import router from "./my_modules/router/router.js";

const expressApp = express();

expressApp.use(express.json());

// Creating a middleware to get the raw body of the request for storing webhook secret

expressApp.use("/api/deploy", (req, res, next) => {

  // A new property rawBody is added to the req object and initialized to an empty string. 
  //This property will be used to store the raw content of the incoming request.

  req.rawBody = "";
  req.setEncoding("utf8");

  // The data event is emitted multiple times as chunks of the request body are received. Every time a chunk of data is received, it's appended to req.rawBody. 
  //This ensures that even if the request body is large and received in multiple chunks, the entire body gets captured in the req.rawBody string.

  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });

  // The end event is emitted once when all the data from the request has been read and captured.
  // At this point, the middleware calls next(), signaling Express to proceed to the next middleware or route handler in the stack.

  req.on("end", () => {
    next();
  });
});

// Connecting to MongoDB

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Connected successfully");
});

//  Recreating the __dirname functionality for ES6 modules.

const __dirname = path.resolve();

// Allows the client to access the server and perform CRUD operations

expressApp.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type"],
  })
);

expressApp.use("/api", router);

export default expressApp;
