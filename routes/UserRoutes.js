import { Router } from "express";
import {
  deleteUser,
  followUser,
  getUser,
  UnFollowUser,
  updateUser,
  getAllUsers,
  getFollowedUser,
  updateNotifications,
} from "../controllers/UserController.js";
import authMiddleWare from "../middleware/AuthMiddleware.js";

const router = Router();
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.get("/followedUser/:id", getFollowedUser);
router.put("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", authMiddleWare, UnFollowUser);
router.put("/notification/:id", updateNotifications);

export default router;
