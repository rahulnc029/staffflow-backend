import express from "express";
import { applyLeave, getMyLeaves, getLeaveRequests, approveLeave, rejectLeave } from "../controllers/leaveController.js";

const router = express.Router();

router.post("/apply", applyLeave);
router.get("/my/:employeeId", getMyLeaves);
router.get("/requests", getLeaveRequests);
router.put("/approve/:id", approveLeave);
router.put("/reject/:id", rejectLeave);

export default router;