import express from "express";

import {
  approveFromEmail,
  rejectFromEmail,
  rejectPage,
} from "../controllers/adminEmailController.js";

const router = express.Router();


// Approve
router.get("/approve-email/:token", approveFromEmail);

// Reject page
router.get("/reject-email/:token", rejectPage);

// Reject submit
router.post("/reject-email/:token", rejectFromEmail);


export default router;