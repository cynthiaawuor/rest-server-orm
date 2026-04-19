import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const route = Router();

route.post("/login", loginUser);
route.post("/register", registerUser);

export default route;
