import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
    {
        holidayName: {
            type: String,
            required: true,
        },

        holidayDate: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
            default: "",
        },
    },
    {timestamps: true}
);

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;