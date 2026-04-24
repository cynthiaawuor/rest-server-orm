import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/connection.js";
import { users } from "../db/schema.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, age, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (user) {
      return res.status(401).json({ error: "user with the same email exists" });
    }
    const newUser = {
      name,
      age,
      email,
      password: hashedPassword,
      role,
    };
    const result = await db
      .insert(users)
      .values(newUser)
      .returning({ id: users.id, role: users.role });
    if (result.length === 0) {
      throw new Error(
        "Failed to create user: No data returned from the database.",
      );
    }
    const createdUser = result[0]!;
    const userPayload = {
      userId: createdUser.id,
      role: createdUser.role,
    };
    const token = jwt.sign(userPayload, `${process.env.SECRET_KEY}`, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (err: any) {
    res.status(500).json({ message: `${err.message}` });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Password does not match" });
      return;
    }

    const userPayload = {
      userId: user.id,
      role: user.role,
    };
    const token = jwt.sign(userPayload, `${process.env.SECRET_KEY}`, {
      expiresIn: "7d",
    });
    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};
