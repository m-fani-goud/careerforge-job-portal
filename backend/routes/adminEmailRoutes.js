import express from "express";

import {
  approveFromEmail,
  rejectFromEmail,
  rejectPage,
} from "../controllers/adminEmailController.js";

const router = express.Router();


// ======================================================
// ⭐ RECRUITER APPROVAL FROM EMAIL
// ======================================================

// Admin clicks approve button from email
// GET → approve recruiter
router.get("/approve-email/:token", approveFromEmail);


// ======================================================
// ⭐ RECRUITER REJECTION FROM EMAIL
// ======================================================

// Admin opens reject page (form)
router.get("/reject-email/:token", rejectPage);

// Admin submits rejection reason
router.post("/reject-email/:token", rejectFromEmail);


export default router;