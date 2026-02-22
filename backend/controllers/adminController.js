import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";


// ======================================================
// GET ALL RECRUITERS (pending + approved + rejected)
// ======================================================
export const getAllRecruiters = async (req, res) => {
  try {

    const recruiters = await User.find({
      role: "recruiter",
    }).select("-password");

    res.json(recruiters);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch recruiters",
    });
  }
};



// ======================================================
// GET ONLY PENDING RECRUITERS
// ======================================================
export const getPendingRecruiters = async (req, res) => {
  try {

    const recruiters = await User.find({
      role: "recruiter",
      approvalStatus: "pending",
    }).select("-password");

    res.json(recruiters);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch pending recruiters",
    });
  }
};



// ======================================================
// APPROVE RECRUITER + EMAIL
// ======================================================
export const approveRecruiter = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(400).json({
        message: "Not a recruiter account",
      });
    }

    // Update status
    user.approvalStatus = "approved";
    user.companyVerified = true;

    await user.save();

    // ================= EMAIL =================
    const message = `
      <h2 style="color:green;">🎉 Recruiter Account Approved</h2>

      <p>Hello <b>${user.name}</b>,</p>

      <p>Your recruiter account has been <b>approved</b> successfully.</p>

      <p><b>Company:</b> ${user.companyName || "N/A"}</p>

      <p>You can now login and start posting jobs.</p>

      <br/>
      <p>Best Regards,<br/>JobPortal Team</p>
    `;

    await sendEmail(
      user.email,
      "Recruiter Account Approved",
      message
    );

    res.json({
      message: "Recruiter approved successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to approve recruiter",
    });
  }
};



// ======================================================
// REJECT RECRUITER + EMAIL + REASON
// ======================================================
export const rejectRecruiter = async (req, res) => {
  try {

    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "recruiter") {
      return res.status(400).json({
        message: "Not a recruiter account",
      });
    }

    // Update status
    user.approvalStatus = "rejected";
    user.companyVerified = false;

    await user.save();

    // ================= EMAIL =================
    const message = `
      <h2 style="color:red;">❌ Recruiter Request Rejected</h2>

      <p>Hello <b>${user.name}</b>,</p>

      <p>We regret to inform you that your recruiter account request has been rejected.</p>

      <p><b>Reason:</b> ${reason || "Not specified"}</p>

      <p>If you believe this is a mistake, please contact support.</p>

      <br/>
      <p>Regards,<br/>JobPortal Team</p>
    `;

    await sendEmail(
      user.email,
      "Recruiter Account Rejected",
      message
    );

    res.json({
      message: "Recruiter rejected successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to reject recruiter",
    });
  }
};
// ============================================
// GET ADMIN NOTIFICATIONS
// ============================================
export const getNotifications = async (req, res) => {
  try {

    const recruiters = await User.find({
      role: "recruiter",
      approvalStatus: "pending",
      adminNotified: false,
    }).select("-password");

    res.json(recruiters);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ============================================
// MARK NOTIFICATIONS AS READ
// ============================================
export const markNotificationsRead = async (req, res) => {
  try {

    await User.updateMany(
      { role: "recruiter", approvalStatus: "pending" },
      { adminNotified: true }
    );

    res.json({ message: "Notifications marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};