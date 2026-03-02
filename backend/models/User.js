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

    // ================= CONTACT INFO =================
    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },

    // ================= CAREER INFO =================
    headline: {
      type: String,
      default: "",
    },

    currentCompany: {
      type: String,
      default: "",
    },

    totalExperience: {
      type: String,
      default: "",
    },

    expectedSalary: {
      type: String,
      default: "",
    },

    // ================= PROFILE =================
    profileSummary: {
      type: String,
      default: "",
    },

    skills: [String],

    // ================= EDUCATION =================
    education: [
      {
        degree: String,
        college: String,
        year: String,
      },
    ],

    // ================= EXPERIENCE =================
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],

    // ================= INTERNSHIPS =================
    internships: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],

    // ================= PROJECTS =================
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],

    // ================= CERTIFICATIONS =================
    certifications: [
      {
        name: String,
        organization: String,
        year: String,
      },
    ],

    // ================= ACHIEVEMENTS =================
    achievements: [
      {
        title: String,
        description: String,
      },
    ],

    // ================= FILES =================
    resume: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

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

    // ================= PASSWORD RESET =================
    resetOTP: {
      type: String,
      default: "",
    },

    resetOTPExpire: Date,

    // ================= RECRUITER INFO =================
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

    approvalToken: {
      type: String,
      default: "",
    },

    approvalTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);