import express from "express";
import { postsController } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, postsController.getPosts);
router.get("/:userId", verifyToken, postsController.getUserPosts);
router.get("/post/:postId", verifyToken, postsController.getPostByPostId);

router.patch("/:id/like", verifyToken, postsController.likePost);
router.patch("/:id/comment", verifyToken, postsController.addComment);

router.delete("/:postId", verifyToken, postsController.deletePost);

export default router;
