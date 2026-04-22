import type { ZodType } from "zod";
import { userInsertSchema } from "../db/schema.js";
import type { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json(parsedBody.error.message);
    }
    req.body = parsedBody.data;
    next();
  };
