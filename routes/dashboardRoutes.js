import express from "express";
import { getManagerDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/manager", getManagerDashboard);

export default router;