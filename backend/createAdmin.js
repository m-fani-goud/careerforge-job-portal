import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {

    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // Check if admin already exists
    const exists = await User.findOne({
      email: "admin@gmail.com",
    });

    if (exists) {
      console.log("❗ Admin already exists");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",

      isVerified: true,
      companyVerified: true,
    });

    console.log("✅ Admin Created Successfully");
    console.log("Email:", admin.email);
    console.log("Password: admin123");

    process.exit();

  } catch (error) {

    console.log("❌ Error:", error.message);
    process.exit();

  }
};

createAdmin();