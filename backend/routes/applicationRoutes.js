import express from "express";
import {
  applyJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
  restoreApplication,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= APPLY =================
router.post("/", protect, applyJob);


// ================= MY APPLICATIONS =================
router.get("/me", protect, getMyApplications);


// ================= JOB APPLICANTS (RECRUITER) =================
router.get("/job/:jobId", protect, getJobApplicants);


// ================= UPDATE STATUS =================
router.put("/:id", protect, updateApplicationStatus);


// ================= WITHDRAW =================
// soft delete (isWithdrawn = true)
router.delete("/:id", protect, withdrawApplication);


// ================= RESTORE =================
// undo withdraw
router.put("/restore/:id", protect, restoreApplication);


export default router;