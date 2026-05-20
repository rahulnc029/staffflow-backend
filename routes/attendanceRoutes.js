import express from "express";

import {
    clockIn,
    clockOut,
    getMyAttendance,
    requestRegularization,
    getRegularizationRequests,
    approveRegularization,
    rejectRegularization,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/clock-in", clockIn);

router.post("/clock-out", clockOut);

router.post(
    "/regularization",
    requestRegularization
);

router.get(
    "/regularizations",
    getRegularizationRequests
);

router.put(
    "/regularizations/approve/:id",
    approveRegularization
);

router.put(
    "/regularizations/reject/:id",
    rejectRegularization
);

router.get(
    "/:employeeId",
    getMyAttendance
);

export default router;