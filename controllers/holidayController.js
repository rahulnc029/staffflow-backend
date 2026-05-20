import Holiday from "../models/Holidays.js";

export const addHoliday = async (req, res) => {
    try {
        const {
            holidayName,
            holidayDate,
            description,
        } = req.body;

        const existingHoliday = await Holiday.findOne({
            holidayDate,
        });

        if(existingHoliday) {
            return res.status(400).json({
                message: "Holiday already exists",
            });
        }

        const holiday = await Holiday.create({
            holidayName,
            holidayDate,
            description,
        });

        res.status(201).json({
            message: "Holiday added successfully",
            holiday,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


export const getHolidays = async (req, res) => {
    try {
        const holidays = (await Holiday.find()).sort({
            holidayDate: 1,
        });

        res.status(200).json(holidays);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};