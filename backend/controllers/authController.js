import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";


// ================= TOKEN =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};



// =====================================================
// REGISTER (USER + RECRUITER + ADMIN EMAIL)
// =====================================================
export const register = async (req, res) => {
  try {

    const { name, email, password, role, companyName } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const approvalToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",

      companyName: role === "recruiter" ? companyName : "",

      approvalStatus: role === "recruiter" ? "pending" : "approved",

      verifyOTP: otp,
      verifyOTPExpire: Date.now() + 10 * 60 * 1000,
      isVerified: false,

      approvalToken: role === "recruiter" ? approvalToken : "",
      approvalTokenExpire:
        role === "recruiter"
          ? Date.now() + 24 * 60 * 60 * 1000
          : null,
    });


    // ================= OTP EMAIL =================
    await sendEmail(
      user.email,
      "Verify Your Email",
      `
      <h2>Email Verification</h2>
      <p>Hello ${name}</p>
      <h1>${otp}</h1>
      <p>OTP expires in 10 minutes</p>
      `
    );


    // ================= ADMIN EMAIL =================
    if (role === "recruiter") {

      const approveLink =
        `${process.env.BASE_URL}/api/admin/approve-email/${approvalToken}`;

      const rejectLink =
        `${process.env.BASE_URL}/api/admin/reject-email/${approvalToken}`;

      const adminMessage = `
        <h2>New Recruiter Request</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Company:</b> ${companyName}</p>

        <br/>

        <a href="${approveLink}"
        style="background:#16a34a;color:white;padding:12px 20px;border-radius:6px;">
        Approve
        </a>

        <a href="${rejectLink}"
        style="background:#dc2626;color:white;padding:12px 20px;border-radius:6px;margin-left:10px;">
        Reject
        </a>
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL,
        "Recruiter Approval Needed",
        adminMessage
      );
    }


    res.json({
      message: "Registration successful. OTP sent.",
      email: user.email,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// =====================================================
// VERIFY EMAIL
// =====================================================
export const verifyEmail = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      verifyOTP: otp,
      verifyOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.verifyOTP = undefined;
    user.verifyOTPExpire = undefined;

    await user.save();

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// =====================================================
// ⭐ RESEND OTP (IMPORTANT FIX)
// =====================================================
export const resendOTP = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOTP = otp;
    user.verifyOTPExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "OTP Resent",
      `<h2>Your OTP: ${otp}</h2>`
    );

    res.json({
      message: "OTP resent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// =====================================================
// LOGIN
// =====================================================
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    if (
      user.role === "recruiter" &&
      user.approvalStatus !== "approved"
    ) {
      return res.status(403).json({
        message: "Waiting for admin approval",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      token: generateToken(user._id),
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// =====================================================
// FORGOT PASSWORD
// =====================================================
export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `<h2>Your OTP: ${otp}</h2>`
    );

    res.json({
      message: "OTP sent",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// =====================================================
// RESET PASSWORD
// =====================================================
export const resetPassword = async (req, res) => {
  try {

    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};