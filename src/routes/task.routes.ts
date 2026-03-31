import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller";

const route = Router();

route.get("/", getTasks);
route.get("/:id", getTaskById);
route.post("/", createTask);
route.patch("/:id", updateTask);
route.delete("/:id", deleteTask);

export default route;
