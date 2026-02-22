import express from "express";
import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
  removeAvatar,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= PROFILE =================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ================= AVATAR =================
router.post(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

router.delete("/remove-avatar", protect, removeAvatar);

// ================= RESUME =================
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;