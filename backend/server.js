import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminEmailRoutes from "./routes/adminEmailRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files (IMPORTANT for resume access)
app.use("/uploads", express.static("uploads"));


// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminEmailRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("🚀 CareerForge API is running successfully");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));