import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "canceled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "online"],
            default: "cash",
        },
        location: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);
