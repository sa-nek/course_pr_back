import express from "express";
import { userController } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//Read
router.get("/:id", verifyToken, userController.getUser);
router.get("/:id/friends", verifyToken, userController.getUserFriends);

//Update
router.patch("/friend", verifyToken, userController.addOrRemoveFriend);

export default router;
