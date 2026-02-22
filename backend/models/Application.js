import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    resume: String,

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },

    // ⭐ REQUIRED FOR WITHDRAW / UNDO
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);