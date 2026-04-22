import type { Request, Response } from "express";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";

import { eq } from "drizzle-orm";
import type { QueryParams } from "../types/task.js";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await db.query.users.findMany();

    res.status(200).json(users);
  } catch (e) {
    res.status(404).json("Not found");
  }
};

export const getUserById = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      with: {
        tasks: true,
      },
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ message: "user not found" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { age, name, email, password } = req.body;
    const newUser = {
      name,
      age,
      email,
      password,
    };
    await db.insert(users).values(newUser);
    res.status(201).type("text").send("User created successfully");
  } catch (error) {
    res.type("text").send("Couldn't create user");
  }
};

export const updateUser = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;

    const updateUser = await db
      .update(users)
      .set({
        name: req.body.summary,
        age: req.body.details,
      })
      .where(eq(users.id, id))
      .returning();
    res.type("json").status(202).send(updateUser);
  } catch (e) {
    res.json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, id));
    res.status(204).send();
  } catch (e) {
    res.type("application/json").json({ error: "could not delete user" });
  }
};
