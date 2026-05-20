import express from "express";
import { addHoliday, getHolidays } from "../controllers/holidayController.js";

const router = express.Router();
router.post("/add", addHoliday);
router.get("/", getHolidays);

export default router;