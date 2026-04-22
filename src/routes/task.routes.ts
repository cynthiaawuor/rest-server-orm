import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { taskInsertSchema, updateTaskSchema } from "../db/schema.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", validateBody(taskInsertSchema), createTask);
router.patch("/:id", validateBody(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
