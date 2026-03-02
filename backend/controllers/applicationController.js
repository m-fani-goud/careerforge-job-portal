import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";


// ================= APPLY JOB =================
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resume) {
      return res.status(400).json({
        message: "Please upload resume before applying",
      });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
      isWithdrawn: { $ne: true },
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: user.resume,
      status: "applied",
      isWithdrawn: false,
    });

    // ⭐ NOTIFICATION TO RECRUITER
    await createNotification(
      job.createdBy,
      "New Applicant",
      `${user.name} applied for your job`,
      "/posted-jobs"
    );

    res.status(201).json(application);

  } catch (error) {
    console.log("Apply Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= MY APPLICATIONS =================
export const getMyApplications = async (req, res) => {
  try {

    const apps = await Application.find({
      applicant: req.user._id,
      isWithdrawn: { $ne: true },
    }).populate("job");

    res.json(apps);

  } catch (error) {
    console.log("My Apps Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= JOB APPLICANTS (RECRUITER) =================
export const getJobApplicants = async (req, res) => {
  try {

    const { jobId } = req.params;

    const apps = await Application.find({
      job: jobId,
      isWithdrawn: { $ne: true },
    })
      .populate("applicant", "name email resume avatar")
      .populate("job");

    res.json(apps);

  } catch (error) {
    console.log("Applicants Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= ⭐ RECRUITER APPLICATIONS (DASHBOARD FIXED) =================
export const getRecruiterApplications = async (req, res) => {
  try {

    // IMPORTANT: use createdBy (not recruiter)
    const jobs = await Job.find({
      createdBy: req.user._id,
    });

    const jobIds = jobs.map(job => job._id);

    const apps = await Application.find({
      job: { $in: jobIds },
      isWithdrawn: { $ne: true },
    }).populate("applicant", "name email");

    res.json(apps);

  } catch (error) {
    console.log("Recruiter Apps Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE STATUS =================
export const updateApplicationStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status;
    await application.save();

    // ⭐ NOTIFICATION TO USER
    await createNotification(
      application.applicant._id,
      "Application Update",
      `Your application was ${status}`,
      "/applications"
    );

    res.json(application);

  } catch (error) {
    console.log("Update Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= WITHDRAW APPLICATION =================
export const withdrawApplication = async (req, res) => {
  try {

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    application.isWithdrawn = true;
    await application.save();

    res.json({
      message: "Application withdrawn",
      application,
    });

  } catch (error) {
    console.log("Withdraw Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= RESTORE APPLICATION =================
export const restoreApplication = async (req, res) => {
  try {

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    application.isWithdrawn = false;
    await application.save();

    res.json({
      message: "Application restored",
      application,
    });

  } catch (error) {
    console.log("Restore Error:", error);
    res.status(500).json({ message: error.message });
  }
};