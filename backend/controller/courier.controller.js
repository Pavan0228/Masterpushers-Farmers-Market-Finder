import { Courier } from "../models/courier.model.js";


export const getCouriers = async (req, res) => {
    try {
        const couriers = await Courier.find().populate("user");
        res.status(200).json({ success: true, data: couriers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourierById = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCourier = async (req, res) => {
    try {
        const { fullName, location, description, phoneNumber } = req.body;
        let profile = req.body.profile;

        if (req.file) {
            const uploadResult = req.file.location;
            profile = uploadResult.Location;
        }

        const courier = await Courier.findByIdAndUpdate(
            req.params.id,
            { fullName, location, description, phoneNumber, profile },
            { new: true }
        );

        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const makeVerify = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        courier.isVerified = !courier.isVerified;
        await courier.save();

        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCourier = async (req, res) => {
    try {
        const courier = await Courier.findByIdAndDelete(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({
            success: true,
            message: "Courier deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
