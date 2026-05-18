import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const loginUser = async (req, res) => {
    try {
        const {employeeEmail, employeePassword} = req.body;
        const user = await User.findOne({employeeEmail})

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const isMatch = await bcrypt.compare(
            employeePassword,
            user.employeePassword
        )

        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        )

        res.status(200).json({
            token,
            user: {
                id: user._id,
                employeeName: user.employeeName,
                employeeEmail: user.employeeEmail,
                role: user.role,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}