import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validation.js";
import { loginSchema } from "../db/schema.js";

const route = Router();

route.post("/login", validateBody(loginSchema), loginUser);
route.post("/register", registerUser);

export default route;
