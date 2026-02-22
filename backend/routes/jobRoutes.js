import express from "express";
import {
  createJob,
  getJobs,
  getMyJobs,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// Create job (recruiter)
router.post("/", protect, createJob);

// Get all jobs (public)
router.get("/", getJobs);

// Get recruiter jobs
router.get("/my", protect, getMyJobs);


export default router;