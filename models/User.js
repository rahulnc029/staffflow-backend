import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        employeeName: {
            type: String,
            required: true,
        },

        employeeCode: {
            type: String,
            required: true,
            unique: true,
        },

        employeeEmail: {
            type: String,
            required: true,
            unique: true,
        },

        employeePassword: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        companyName: {
            type: String,
            default: "Company Name",
        },

        role: {
            type: String,
            enum: ["Admin", "Manager", "User"],
            default: "User",
        },
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User;