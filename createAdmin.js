import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("admin123", 10);

await User.create({
    employeeName: "Admin",
    employeeCode: "ADMIN001",
    employeeEmail: "admin@staffflow.com",
    employeePassword: hashedPassword,
    location: "Bengaluru",
    role: "Admin",
});

console.log("Admin Created");

process.exit();