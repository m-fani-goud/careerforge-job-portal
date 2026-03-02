import express from "express";
import {
  createJob,
  getJobs,
  getMyJobs,
  getRecruiterStats,   // ⭐ ADD THIS
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= CREATE JOB =================
router.post("/", protect, createJob);


// ================= GET ALL JOBS =================
router.get("/", getJobs);


// ================= GET RECRUITER JOBS =================
router.get("/my", protect, getMyJobs);


// ================= ⭐ RECRUITER DASHBOARD STATS =================
router.get("/recruiter-stats", protect, getRecruiterStats);


export default router;