import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminEmailRoutes from "./routes/adminEmailRoutes.js";

const app = express();


// ✅ DEBUG BREVO ENV
console.log(
  "BREVO CONFIG:",
  process.env.BREVO_SMTP_USER ? "LOADED ✅" : "MISSING ❌"
);


// ================= DATABASE =================
connectDB();


// ================= CORS =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://careerforge-job-portal.vercel.app",
    ],
    credentials: true,
  })
);


// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= STATIC FILES =================
app.use("/uploads", express.static("uploads"));


// ================= ROUTES =================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminEmailRoutes);


// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("🚀 CareerForge API running successfully");
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);