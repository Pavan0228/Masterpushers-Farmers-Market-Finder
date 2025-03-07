import mongoose from "mongoose";

const courierSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    profile: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
},
{
    timestamps: true
}
);

export const Courier = mongoose.model("Courier", courierSchema);