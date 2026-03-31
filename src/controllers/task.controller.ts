import Task, { createTaskInput, QueryParams } from "../../types/task";
import { db } from "../db/connection";
import { Request, Response } from "express";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const taskList = await db.query.tasks.findMany();
    res.status(200).json(taskList);
  } catch (e) {
    console.log(e);
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
    console.log(error);
  }
};
export const createTask = async (req: Request, res: Response) => {
  try {
    const { summary, details, completed, userId } = req.body as Task;
    if (!userId) {
      res.type("application/json").status(422).send("userId is required");
      return;
    }
    const newTask: createTaskInput = {
      summary,
      details,
      completed,
      userId,
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
