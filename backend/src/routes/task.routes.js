import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
const router = express.Router();
router.use(protect);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateTaskStatus);

export default router;
