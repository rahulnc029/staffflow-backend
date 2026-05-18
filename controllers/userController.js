import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    try {
        const{
            employeeName,
            employeeCode,
            employeeEmail,
            employeePassword,
            location,
            role,
        } = req.body;

        const existingEmail = await User.findOne({
            employeeEmail,
        });

        if(existingEmail) {
            return res.status(400).json({
                message: "Email already exixts",
            });
        }

        const existingCode = await User.findOne({
            employeeCode,
        });

        if(existingCode) {
            return res.status(400).json({
                message: "Employee code already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(
            employeePassword,
            10
        );

        const user = await User.create({
            employeeName,
            employeeCode,
            employeeEmail,
            employeePassword: hashedPassword,
            location,
            role,
        });

        res.status(201).json({
            message: "User created successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            "-employeePassword"
        );

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}


export const getSingleUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-employeePassword");

        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.status(200).json({
            message: "User updated successfully",
            updateUser,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}