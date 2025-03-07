import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        adminLevel: {
            type: String,
            enum: ["super", "moderate"],
            default: "moderate"
        },
        permissions: [{
            type: String,
            enum: ["manage_users", "manage_products", "manage_orders", "manage_content"]
        }]
    },
    {
        timestamps: true
    }
);

export const Admin = mongoose.model("Admin", adminSchema); 