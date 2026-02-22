import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user",
    },

    // ================= JOB SEEKER PROFILE =================

    profileSummary: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    education: [
      {
        degree: String,
        college: String,
        year: String,
      },
    ],

    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],

    internships: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],

    achievements: [
      {
        title: String,
        description: String,
      },
    ],

    certifications: [
      {
        name: String,
        organization: String,
        year: String,
      },
    ],

    resume: {
      type: String,
      default: "",
    },

    // ================= PASSWORD RESET =================
    resetOTP: {
      type: String,
      default: "",
    },

    resetOTPExpire: Date,

    // ================= EMAIL VERIFICATION =================
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyOTP: {
      type: String,
      default: "",
    },

    verifyOTPExpire: Date,

    // ================= RECRUITER COMPANY =================
    companyName: {
      type: String,
      default: "",
    },

    companyVerified: {
      type: Boolean,
      default: false,
    },

    // ================= ADMIN APPROVAL =================
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    adminNotified: {
      type: Boolean,
      default: false,
    },

    // ================= EMAIL APPROVAL TOKEN =================
    approvalToken: {
      type: String,
      default: "",
    },

    approvalTokenExpire: {
      type: Date,
    },

    // ================= PROFILE IMAGE =================
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);