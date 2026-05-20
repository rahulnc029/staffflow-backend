import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        checkInTime: {
            type: String,
            default: "",
        },
        checkOutTime: {
            type: String,
            default: "",
        },
        grossHours: {
            type: String,
            default: ""
        },
        arrivalStatus: {
            type: String,
            default: "",
        },

        arrivalTimeText: {
            type: String,
            default: "",
        },
        loginTime: {
            type: Date
        },
        regularizationStatus: {
            type: String,
            enum: [
                "None",
                "Pending",
                "Approved",
                "Rejected",
            ],
            default: "None",
        },

        regularizationReason: {
            type: String,
            default: "",
        },

        regularizedCheckIn: {
            type: String,
            default: "",
        },

        regularizedCheckOut: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: [
                "Present",
                "Incomplete",
                "Holiday",
                "Week Off",
                "Leave",
            ],
            default: "Incomplete",
        },
    },
    { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;