import User from "../models/User.js";


// ==========================================
// GET USER PROFILE
// ==========================================
export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

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
// UPDATE PROFILE (Skills, Summary, etc.)
// ==========================================
export const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

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

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);

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
// UPLOAD PROFILE IMAGE (AVATAR)
// ==========================================
export const uploadAvatar = async (req, res) => {
  try {

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);

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

    const user = await User.findById(req.user.id);

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