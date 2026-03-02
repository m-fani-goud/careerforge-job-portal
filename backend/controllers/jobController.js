import Job from "../models/Job.js";
import Application from "../models/Application.js";


// ================= CREATE JOB =================
export const createJob = async (req, res) => {
  try {

    const job = await Job.create({
      ...req.body,
      createdBy: req.user._id, // recruiter id
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



// ================= RECRUITER DASHBOARD STATS =================
export const getRecruiterStats = async (req, res) => {
  try {

    const recruiterId = req.user._id;

    // 1️⃣ Get recruiter jobs
    const jobs = await Job.find({
      createdBy: recruiterId,
    });

    const jobIds = jobs.map(job => job._id);

    // 2️⃣ Get applications for those jobs
    const applications = await Application.find({
      job: { $in: jobIds },
      isWithdrawn: { $ne: true },
    });

    // 3️⃣ Calculate numbers
    const totalJobs = jobs.length;
    const totalApplicants = applications.length;

    const shortlisted = applications.filter(
      app => app.status === "shortlisted"
    ).length;

    const rejected = applications.filter(
      app => app.status === "rejected"
    ).length;

    const pending = applications.filter(
      app => app.status === "applied"
    ).length;

    res.json({
      totalJobs,
      totalApplicants,
      shortlisted,
      rejected,
      pending,
    });

  } catch (error) {
    console.log("Stats Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};