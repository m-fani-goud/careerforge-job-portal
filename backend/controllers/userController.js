import User from "../models/User.js";


// ==========================================
// GET USER PROFILE
// ==========================================
export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// UPDATE PROFILE
// ==========================================
export const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Only update allowed fields
    const allowedFields = [
      "phone",
      "location",
      "linkedin",
      "portfolio",
      "profileSummary",
      "skills",
      "education",
      "experience",
      "internships",
      "projects",
      "certifications",
      "achievements",
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// UPLOAD RESUME
// ==========================================
export const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.resume = req.file.path;

    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resume: user.resume,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// UPLOAD AVATAR
// ==========================================
export const uploadAvatar = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.avatar = req.file.path;

    await user.save();

    res.json({
      message: "Profile image updated",
      avatar: user.avatar,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// REMOVE AVATAR
// ==========================================
export const removeAvatar = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.avatar = "";

    await user.save();

    res.json({
      message: "Avatar removed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};