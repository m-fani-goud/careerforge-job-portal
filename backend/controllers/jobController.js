import Job from "../models/Job.js";


// ================= CREATE JOB =================
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id,   // ✅ FIXED
    });

    res.json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET RECRUITER JOBS =================
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};