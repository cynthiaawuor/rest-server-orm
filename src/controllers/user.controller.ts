import type { Request, Response } from "express";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";

import { eq } from "drizzle-orm";
import type { QueryParams } from "../types/task.js";

export const isAdmin = (req: Request) => {
  return req.user.role === "admin";
};
export const getUsers = async (_req: Request, res: Response) => {
  try {
    if (!isAdmin) {
      res.status(400).json({ message: "Unauthorized access" });
    }
    const users = await db.query.users.findMany();

    res.status(200).json(users);
  } catch (e) {
    res.status(404).json("No user Exist");
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
    const { age, name, email, password, role } = req.body;
    const newUser = {
      name,
      age,
      email,
      password,
      role,
    };
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (user) {
      return res.status(401).json({ error: "user with the same email exists" });
    }
    await db.insert(users).values(newUser);

    res.status(201).type("text").send("User created successfully");
  } catch (error) {
    res.type("text").send(`${error}`);
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
