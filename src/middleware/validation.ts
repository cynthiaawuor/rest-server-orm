import { z, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        errors: parsedBody.error?.issues.map((issue) => {
          return {
            field: issue.path.join("."),
            message: issue.message,
          };
        }),
      });
    }
    req.body = parsedBody.data;
    next();
  };
