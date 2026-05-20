import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        leaveType: {
            type: String,
            enum: [
                "Sick Leave",
                "Casual Leave",
                "Emergency Leave",
            ],
            required: true,
        },

        fromDate: {
            type: String,
            required: true,
        },

        toDate: {
            type: String,
            required: true,
        },

        totalDays: {
            type: Number,
            default: 1,
        },

        reason: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected",
            ],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;