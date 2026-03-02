import express from "express";
import {
  getAllRecruiters,
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
  getNotifications,
  markNotificationsRead,
} from "../controllers/adminController.js";

import { adminAuth } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ======================================================
// ⭐ RECRUITERS
// ======================================================

// Get all recruiters (approved + rejected + pending)
router.get("/recruiters", adminAuth, getAllRecruiters);

// Get only pending recruiters
router.get("/recruiters/pending", adminAuth, getPendingRecruiters);


// ======================================================
// ⭐ APPROVAL ACTIONS
// ======================================================

// Approve recruiter
router.put("/recruiters/:id/approve", adminAuth, approveRecruiter);

// Reject recruiter
router.put("/recruiters/:id/reject", adminAuth, rejectRecruiter);


// ======================================================
// ⭐ ADMIN NOTIFICATIONS
// ======================================================

// Get new recruiter notifications
router.get("/notifications", adminAuth, getNotifications);

// Mark notifications as read
router.put("/notifications/read", adminAuth, markNotificationsRead);


export default router;