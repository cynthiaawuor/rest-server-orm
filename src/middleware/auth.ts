import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from "jose";
import { createSecretKey } from "crypto";

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

// export interface JwtPayload {
//   id: string;
//   name: string;
//   email: string;
//   username: string;
//   role: "user" | "admin";
// }

// const getSecretKey = () => {
//   const secret = process.env.JWT_SECRET;
//   if (!secret)
//     throw new Error("JWT_SECRET is not defined in environment variables");
//   return createSecretKey(secret, "utf-8");
// };

// export const generateToken = async (payload: JwtPayload): Promise<string> => {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256", typ: "JWT" })
//     .setIssuedAt()
//     .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
//     .sign(getSecretKey());
// };

// export const verifyToken = async (token: string): Promise<JwtPayload> => {
//   const { payload } = await jwtVerify(token, getSecretKey());
//   return payload as JwtPayload;
// };
