import Attendance from "../models/Attendance.js";
import Holiday from "../models/Holidays.js";
import Leave from "../models/Leave.js";

// Clock In
export const clockIn = async (req, res) => {
    try {
        const { employeeId } = req.body;

        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        });

        // Check Sunday
        const currentDate = new Date();
        if (currentDate.getDay() === 0) {
            return res.status(400).json({
                message: "Today is week off",
            });
        }

        // Check Holiday
        const holiday = await Holiday.findOne({
            holidayDate: today,
        });

        if (holiday) {
            return res.status(400).json({
                message: `Holiday: ${holiday.holidayName}`,
            });
        }

        // Check Approved Leave
        const approvedLeave = await Leave.findOne({
            employeeId,
            fromDate: { $lte: today },
            toDate: { $gte: today },
            status: "Approved",
        });

        if (approvedLeave) {
            return res.status(400).json({
                message: "Approved leave exists for today",
            });
        }

        const existingAttendance = await Attendance.findOne({ employeeId, date: today });

        if (existingAttendance) {
            return res.status(400).json({
                message: "Already clocked in today"
            });
        }

        const currentDateTime = new Date();

        const nowIST = new Date(
            currentDateTime.toLocaleString("en-us", {
                timeZone: "Asia/Kolkata",
            })
        );

        const currentHour = nowIST.getHours();
        const currentMinute = nowIST.getMinutes();
        const totalCurrentMinutes = currentHour * 60 + currentMinute;
        const shiftStartMinutes = 9 * 60;
        const diffMinutes = totalCurrentMinutes - shiftStartMinutes;

        let arrivalStatus = "";
        let arrivalTimeText = "";

        const formatArrivalTime = (minutes) => {
            const absMinutes = Math.abs(minutes);
            const hrs = Math.floor(absMinutes / 60);
            const mins = absMinutes % 60;

            if (hrs === 0) {
                return `${mins} mins`;
            }

            return `${hrs}h ${mins}m`;
        };

        // Before 9:00
        if (diffMinutes < 0) {
            arrivalStatus = "Early";
            arrivalTimeText = formatArrivalTime(diffMinutes);
        }

        // 9:00 to 9:05
        else if (diffMinutes <= 5) {
            arrivalStatus = "On Time";
            arrivalTimeText = "00:00";
        }

        else {
            arrivalStatus = "Late";
            arrivalTimeText = formatArrivalTime(diffMinutes);
        }

        const currentTime = currentDateTime.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const attendance = await Attendance.create({
            employeeId,
            date: today,
            checkInTime: currentTime,
            loginTime: currentDateTime,
            arrivalStatus,
            arrivalTimeText,
        });

        res.status(201).json({
            message: "Clock In Successful",
            attendance,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}


// Clock Out
export const clockOut = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        });
        const attendance = await Attendance.findOne({ employeeId, date: today, });
        if (!attendance) {
            return res.status(404).json({ message: "No clock in found" })
        }
        if (attendance.checkOutTime) {
            return res.status(400).json({ message: "Already clocked out" })
        }
        const logoutDateTime = new Date();
        attendance.checkOutTime = logoutDateTime.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
        // Calculate Hours 
        const diffMs = logoutDateTime - attendance.loginTime;
        const totalMinutes = Math.floor(diffMs / 1000 / 60);
        // Gross Hours
        const grossHours = Math.floor(totalMinutes / 60);
        const grossMinutes = totalMinutes % 60;
        attendance.grossHours = `${grossHours} h ${grossMinutes} m`;
         
        attendance.status = "Present"; await attendance.save();
        res.status(200).json({ message: "Clock Out Successful", attendance, });
    } catch (error) {
        res.status(500).json({ message: error.message, })
    }
};



// Get User Attendance

export const getMyAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const attendance = await Attendance.find({
            employeeId
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(attendance);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

// Request Regularization
export const requestRegularization = async (req, res) => {
    try {
        const {
            attendanceId,
            regularizationReason,
            regularizedCheckIn,
            regularizedCheckOut,
        } = req.body;

        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found",
            });
        }

        // VALIDATION
        if (
            !regularizedCheckIn ||
            !regularizedCheckOut ||
            !regularizationReason
        ) {
            return res.status(400).json({
                message:
                    "Check In, Check Out and Reason are required",
            });
        }

        // CHECK BEFORE UPDATING
        if (attendance.regularizationStatus === "Pending") {
            return res.status(400).json({
                message: "Regularization already requested",
            });
        }

        // 24 HOURS VALIDATION
        const attendanceDate = new Date(attendance.date);
        const currentDate = new Date();

        attendanceDate.setHours(23, 59, 59, 999);

        if (currentDate > attendanceDate) {
            return res.status(400).json({
                message:
                    "Regularization allowed only on same day",
            });
        }

        attendance.regularizationStatus = "Pending";
        attendance.regularizationReason =
            regularizationReason;
        attendance.regularizedCheckIn =
            regularizedCheckIn;
        attendance.regularizedCheckOut =
            regularizedCheckOut;

        await attendance.save();

        res.status(200).json({
            message:
                "Regularization request submitted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Regularizations
export const getRegularizationRequests = async (req, res) => {
    try {
        const requests = await Attendance.find({
            regularizationStatus: {
                $ne: "None",
            },
        }).populate(
            "employeeId",
            "employeeName employeeCode"
        ).sort({
            createdAt: -1,
        });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Approve Request
export const approveRegularization = async (req, res) => {
    try {

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found",
            });
        }

        // ORIGINAL 24HR VALUES
        const checkIn24 = attendance.regularizedCheckIn;
        const checkOut24 = attendance.regularizedCheckOut;

        // CONVERT TO DATE OBJECT
        const inTime = new Date(`2000-01-01T${checkIn24}:00`);
        const outTime = new Date(`2000-01-01T${checkOut24}:00`);

        // CONVERT TO 12HR FORMAT
        const checkIn12 = inTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const checkOut12 = outTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        // SAVE DISPLAY VALUES
        attendance.checkInTime = checkIn12;
        attendance.checkOutTime = checkOut12;

        attendance.status = "Present";

        // CALCULATE GROSS HOURS
        const diffMs = outTime - inTime;

        const totalMinutes = Math.floor(diffMs / 1000 / 60);

        const hrs = Math.floor(totalMinutes / 60);

        const mins = totalMinutes % 60;

        attendance.grossHours = `${hrs}h ${mins}m`;

        attendance.regularizationStatus = "Approved";

        await attendance.save();

        res.status(200).json({
            message: "Regularization approved successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

// Reject Request
export const rejectRegularization = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found",
            });
        }

        attendance.regularizationStatus = "Rejected";

        await attendance.save();

        res.status(200).json({
            message: "Regularization rejected",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}