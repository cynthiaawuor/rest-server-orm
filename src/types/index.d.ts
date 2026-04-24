import { Request } from "express";
import type { AuthContext } from "./auth/auth-context.ts";

// declare namespace Express {
//   interface Request {
//     user?: {
//       userId: string;
//       role: string;
//     };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: AuthContext;
    }
  }
}
