import express from "express";
import {
  getAllRecruiters,
  approveRecruiter,
  rejectRecruiter,
  getNotifications,
  markNotificationsRead,
} from "../controllers/adminController.js";

import { adminAuth } from "../middleware/adminMiddleware.js";

const router = express.Router();


// ======================================
// GET ALL RECRUITERS
// ======================================
router.get("/recruiters", adminAuth, getAllRecruiters);


// ======================================
// APPROVE RECRUITER
// ======================================
router.put("/approve/:id", adminAuth, approveRecruiter);


// ======================================
// REJECT RECRUITER
// ======================================
router.put("/reject/:id", adminAuth, rejectRecruiter);


// ======================================
// ADMIN NOTIFICATIONS
// ======================================
router.get("/notifications", adminAuth, getNotifications);

router.put("/notifications/read", adminAuth, markNotificationsRead);


export default router;