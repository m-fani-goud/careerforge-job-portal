import express from "express";
import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  restoreApplication,
  getRecruiterApplications, // ⭐ ADD
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, applyJob);

router.get("/me", protect, getMyApplications);

// ⭐ ADD THIS
router.get("/recruiter", protect, getRecruiterApplications);

router.get("/job/:jobId", protect, getJobApplicants);

router.put("/:id", protect, updateApplicationStatus);

router.delete("/:id", protect, withdrawApplication);

router.put("/restore/:id", protect, restoreApplication);

export default router;