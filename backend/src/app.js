import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error:", err));

const PORT = 5000;

import { errorHandler } from "./middlewares/errorHandler.js";
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
