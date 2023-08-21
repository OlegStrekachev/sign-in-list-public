import dotenv from "dotenv";
// Don't forget this line to access the .env variables!
dotenv.config();

import mongoose from "mongoose";

import app from "./app.js";

// console.log(app)

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
});

app.listen(process.env.EXPRESS_PORT, process.env.EXPRESS_HOST, () => {
  console.log(`Listening on port ${process.env.EXPRESS_PORT}...`);
});
