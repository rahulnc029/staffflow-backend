import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import holidayRoutes from "./routes/holidayRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config()
connectDB();

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("API Running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})