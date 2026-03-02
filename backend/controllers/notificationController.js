import Notification from "../models/Notification.js";


// CREATE NOTIFICATION
export const createNotification = async (userId, title, message, link = "") => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      link,
    });
  } catch (err) {
    console.log("Notification Error:", err);
  }
};


// GET MY NOTIFICATIONS
export const getMyNotifications = async (req, res) => {
  try {
    const data = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// MARK READ
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }
    );

    res.json({ message: "Updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};