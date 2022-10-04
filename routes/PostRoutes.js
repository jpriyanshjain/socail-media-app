import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getTimeLinePost,
  likePost,
  updatePost,
} from "../controllers/PostController.js";

const router = Router();

router.post("/", createPost);
router.get("/:id", getPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/timeline/:id", getTimeLinePost);

export default router;
