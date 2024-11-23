import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import uploadRouter from "./routes/fileRoutes.js"; 

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error in connection to DB");
  });

  // Use the router for handling `/upload` routes
app.use("/api/files", uploadRouter);

export default app;
