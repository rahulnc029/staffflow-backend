import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";

export const getManagerDashboard = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        // Total Employees
        const totalEmployees = await User.countDocuments({ role: "User" });
        // Present Today
        const presentToday = await Attendance.countDocuments({
            date: today,
            status: "Present",
        });
        // Incomplete
        const incompleteAttendance = await Attendance.countDocuments({
            date: today,
            status: "Incomplete",
        });
        // Leave Today
        const onLeaveToday = await Leave.countDocuments({
            fromDate: { $lte: today },
            toDate: { $gte: today },
            status: "Approved",
        });
        // Pending Leaves
        const pendingLeaves = await Leave.countDocuments({
            status: "Pending"
        });
        // Pending Regularization
        const pendingRegularizations = await Attendance.countDocuments({ regularizationStatus: "Pending" });

        // Recent Leave Requests
        const recentLeaves = await Leave.find().populate(
            "employeeId",
            "employeeName employeeCode"
        ).sort({ createdAt: -1 }).limit(5);

        // Recent Regularizations
        const recentRegularizations = await Attendance.find({
            regularizationStatus: {
                $ne: "None",
            }
        }).populate(
            "employeeId",
            "employeeName employeeCode"
        ).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            totalEmployees,
            presentToday,
            incompleteAttendance,
            onLeaveToday,
            pendingLeaves,
            pendingRegularizations,
            recentLeaves,
            recentRegularizations,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}