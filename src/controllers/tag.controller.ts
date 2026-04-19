import { db } from "../db/connection.js";
import type { Request, Response } from "express";
import type { QueryParams } from "../types/task.js";
import { tags } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getTags = async (_req: Request, res: Response) => {
  try {
    const tagsList = await db.query.tags.findMany();
    res.status(200).json(tagsList);
  } catch (e) {
    res.status(500).json(`${e}`);
  }
};

export const getTagById = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await db.query.tags.findFirst({
      where: (tags, { eq }) => eq(tags.id, id),
    });
    if (!tag) {
      res.type("text").status(404).send("Tag not found");
    } else {
      res.status(200).json(tag);
    }
  } catch (e) {
    res.status(500).json(`${e}`);
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;

    const newTag = {
      name,
      color,
    };
    const [createdTag] = await db.insert(tags).values(newTag).returning();
    res.status(201).json(createdTag);
  } catch (e) {
    res.status(500).json({ error: "Failed to create tag" });
  }
};

export const updateTag = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;

    const updateTag = await db
      .update(tags)
      .set({
        name: req.body.name,
        color: req.body.color,
      })
      .where(eq(tags.id, id))
      .returning();
    res.type("json").status(202).send(updateTag);
  } catch (e) {
    res.json({ error: "Failed to update tag" });
  }
};

export const deleteTag = async (req: Request<QueryParams>, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(tags).where(eq(tags.id, id));
    res.status(204).send("Tag deleted successfully");
  } catch (e) {
    res.status(500).json({ error: "could not delete tag" });
  }
};
