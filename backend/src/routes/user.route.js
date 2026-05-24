import express from "express";

import protectRoute from "../middleware/auth.middleware.js";

import {
  followUnfollowUser,
  getUserProfile,
  suggestedUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

// Follow/unfollow
router.put(
  "/follow/:id",
  protectRoute,
  followUnfollowUser
);

// User profile
router.get(
  "/profile/:id",
  protectRoute,
  getUserProfile
);

// Suggested users
router.get(
  "/suggested",
  protectRoute,
  suggestedUsers
);

export default router;