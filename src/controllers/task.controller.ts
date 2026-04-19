import type { Task, CreateTaskInput, QueryParams } from "../types/task.js";
import { db } from "../db/connection.js";
import type { Request, Response } from "express";
import { tasks } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const taskList = await db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, req.user.userId),
    });
    res.status(200).json(taskList);
  } catch (e) {
    res.status(500).json(`${e}`);
  }
};

export const getTaskById = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    const task = await db.query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, id),
    });
    if (!task) {
      res.type("text").status(404).send("Task not found");
    } else {
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(500).json(`${error}`);
  }
};
export const createTask = async (req: Request, res: Response) => {
  try {
    const { summary, details, completed, userId } = req.body as Task;

    const newTask: CreateTaskInput = {
      summary,
      details: details ?? null,
      completed,
      userId: req.user.userId,
    };
    const [createdTask] = await db.insert(tasks).values(newTask).returning();
    res.status(201).json(createdTask);
  } catch (e) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;

    const updateTask = await db
      .update(tasks)
      .set({
        summary: req.body.summary,
        details: req.body.details,
        completed: req.body.completed,
      })
      .where(eq(tasks.id, id))
      .returning();
    res.type("json").status(202).send(updateTask);
  } catch (e) {
    res.json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(tasks).where(eq(tasks.id, id));
    res.status(204).send("Task deleted successfully");
  } catch (e) {
    res.status(500).json({ error: "could not delete task" });
  }
};
