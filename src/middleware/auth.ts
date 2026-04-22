import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization?.split(/\s+/);

    if (!authHeader || authHeader.length !== 2) {
      res.status(401).json({ error: "Unauthorized Access" });
      return;
    }
    const decodedToken = jwt.verify(
      `${authHeader[1]}`,
      `${process.env.SECRET_KEY}`,
    );
    req.user = decodedToken;
  } catch (err) {
    res.status(401).json({ error: "Unauthorized Access" });
    return;
  }
  next();
};
