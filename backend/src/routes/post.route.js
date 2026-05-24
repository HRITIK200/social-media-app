import express from "express";
import upload from "../middleware/upload.middleware.js";

import protectRoute from "../middleware/auth.middleware.js";

import {
  createPost,
  getAllPosts,
  getUserPosts,
  likeUnlikePost,
  addComment,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Create post
router.post(
  "/",
  protectRoute,
  upload.single("image"),
  createPost
);

// Get all posts
router.get("/", protectRoute, getAllPosts);

// Get user posts
router.get("/user/:userId", protectRoute, getUserPosts);

// Like/Unlike post
router.put("/like/:id", protectRoute, likeUnlikePost);

// Add comment
router.post("/comment/:id", protectRoute, addComment);

// Delete post
router.delete("/:id", protectRoute, deletePost);

// Update post
router.put("/:id", protectRoute, updatePost);

export default router;