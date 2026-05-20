import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
    try {

        const {
            employeeId,
            leaveType,
            fromDate,
            toDate,
            reason,
        } = req.body;

        // Calculate total leave days
        const start = new Date(fromDate);
        const end = new Date(toDate);

        const diffMs = end - start;

        const totalDays =
            Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

        // Monthly leave validation
        const currentMonth = start.getMonth() + 1;
        const currentYear = start.getFullYear();

        const existingLeaves = await Leave.find({
            employeeId,
            status: "Approved",
        });

        let monthlyLeaveCount = 0;

        existingLeaves.forEach((leave) => {

            const leaveMonth =
                new Date(leave.fromDate).getMonth() + 1;

            const leaveYear =
                new Date(leave.fromDate).getFullYear();

            if (
                leaveMonth === currentMonth &&
                leaveYear === currentYear
            ) {
                monthlyLeaveCount += leave.totalDays;
            }
        });

        // Only for normal leaves
        if (
            leaveType !== "Emergency Leave" &&
            monthlyLeaveCount + totalDays > 2
        ) {
            return res.status(400).json({
                message:
                    "Only 2 leave days allowed per month. Contact manager for exception.",
            });
        }

        const leave = await Leave.create({
            employeeId,
            leaveType,
            fromDate,
            toDate,
            totalDays,
            reason,
        });

        res.status(201).json({
            message: "Leave request submitted",
            leave,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            employeeId: req.params.employeeId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(leaves);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.find().populate(
            "employeeId",
            "employeeName employeeCode"
        ).sort({
            createdAt: -1,
        });

        res.status(200).json(leaves);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};

export const approveLeave = async (req, res) => {
    try {
        await Leave.findByIdAndUpdate(
            req.params.id,
            {
                status: "Approved",
            }
        );

        res.status(200).json({
            message: "Leave approved",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const rejectLeave = async (req, res) => {
    try {
        await Leave.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected" }
        );

        res.status(200).json({
            message: "Leave rejected",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};