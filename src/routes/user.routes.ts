import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { updateUserSchema, userInsertSchema } from "../db/schema.js";
import { validateBody } from "../middleware/validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validateBody(userInsertSchema), createUser);
router.patch("/:id", validateBody(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
