import { Router } from "express";
import {
  createTag,
  deleteTag,
  getTagById,
  getTags,
  updateTag,
} from "../controllers/tag.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { tagsInsertSchema, updateTagsSchema } from "../db/schema.js";

const router = Router();
router.use(authMiddleware);

router.get("/", getTags);
router.get("/:id", getTagById);
router.post("/", validateBody(tagsInsertSchema), createTag);
router.patch("/:id", validateBody(updateTagsSchema), updateTag);
router.delete("/:id", deleteTag);

export default router;
