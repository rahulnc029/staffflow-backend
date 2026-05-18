import express from "express";
import { createUser, getUsers, getSingleUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/", getUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);

export default router;