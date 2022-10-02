import { Router } from "express";
import { createChat, findChat, userChats } from "../controllers/ChatController.js";

const router = Router();

router.post('/', createChat);
router.get("/:userId", userChats)
router.get("/find/:firstId/:secondId", findChat)




export default router;