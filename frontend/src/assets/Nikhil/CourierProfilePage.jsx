import React, { useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Truck,
    Edit,
    Camera,
    Clock,
    FileText,
    FileImage,
    ShoppingBag,
    BarChart3,
    Bike,
    Shield,
    Award,
    Package,
} from "lucide-react";

const CourierProfilePage = () => {
    // Sample courier data
    const [courier, setCourier] = useState({
        displayName: "Anastasia Grady",
        email: "curr@gmail.com",
        phoneNumber: "800-486-4619",
        address: "9276 Eleazar Lodge",
        description: "Professional courier service provider",
        memberSince: "March 2025",
        profileImage:
            "https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/profiles/1741374991144-zoro3.jpg",
        vehicleType: "Bike",
        rating: 0,
        totalDeliveries: 0,
        verifiedStatus: false,
        documents: {
            licenseDocument:
                "https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/profiles/1741375011349-zoro2.jpg",
            drivingLicenseNumber: "452",
            identityType: "Aadhar Card",
            cardNumber: "650",
            idProof:
                "https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/profiles/1741375011936-Sukuna1.jpg",
        },
    });

    // Sample recent activities
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: "delivery",
            orderNumber: "ORD-001",
            location: "Sector 12, Mumbai",
            date: "2025-03-07",
            status: "completed",
            customerName: "John Doe",
        },
        {
            id: 2,
            type: "pickup",
            orderNumber: "ORD-002",
            location: "Andheri East",
            date: "2025-03-07",
            status: "in-progress",
            vendorName: "Fresh Farms",
        },
        {
            id: 3,
            type: "verification",
            documentType: "Vehicle Insurance",
            date: "2025-03-06",
            status: "pending",
        },
        {
            id: 4,
            type: "rating",
            orderNumber: "ORD-003",
            rating: 5,
            date: "2025-03-05",
            customerName: "Sarah Smith",
            feedback: "Very professional and on-time delivery",
        },
    ]);

    // Delivery statistics
    const [deliveryStats, setDeliveryStats] = useState([
        { label: "On-Time Delivery", value: "98%", status: "up" },
        { label: "Customer Rating", value: "4.8/5", status: "up" },
        { label: "Total Distance", value: "1,234 km", status: "up" },
        { label: "Active Hours", value: "180 hrs", status: "up" },
    ]);

    // Functions to render activity icons
    const getActivityIcon = (type) => {
        switch (type) {
            case "delivery":
                return <Truck className="h-6 w-6 text-green-600" />;
            case "pickup":
                return <Package className="h-6 w-6 text-blue-500" />;
            case "verification":
                return <Shield className="h-6 w-6 text-amber-500" />;
            case "rating":
                return <Star className="h-6 w-6 text-purple-500" />;
            default:
                return <Clock className="h-6 w-6 text-gray-500" />;
        }
    };

    // Handle profile image upload
    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setCourier({ ...courier, profileImage: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-40 relative">
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                                    {courier.profileImage ? (
                                        <img
                                            src={courier.profileImage}
                                            alt={courier.displayName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                                            <User className="h-16 w-16 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-blue-100 p-2 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-blue-200 transition-colors"
                                >
                                    <Camera className="h-4 w-4 text-blue-600" />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3 ml-4">
                                <h1 className="text-2xl font-bold text-white flex items-center">
                                    {courier.displayName}
                                    {courier.verifiedStatus && (
                                        <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                                            Verified
                                        </span>
                                    )}
                                </h1>
                                <p className="text-blue-100">
                                    Courier • Member since {courier.memberSince}
                                </p>
                            </div>
                        </div>
                        <div className="absolute right-6 top-6">
                            <button className="bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 text-white font-medium backdrop-blur-sm flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-gray-800">
                                            {courier.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-gray-800">
                                            {courier.phoneNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                                        <div>
                                            <span className="text-gray-800 block">
                                                {courier.address}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Bike className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-gray-800">
                                            Vehicle Type: {courier.vehicleType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-gray-700">
                                            Courier Stats
                                        </h3>
                                        <Award className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Rating
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.rating}/5.0
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Deliveries
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.totalDeliveries}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Verification
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.verifiedStatus
                                                    ? "Verified"
                                                    : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Documents & Verification */}
                    <div className="col-span-1">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                Documents & Verification
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Driving License
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Number:{" "}
                                        {courier.documents.drivingLicenseNumber}
                                    </p>
                                    <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                courier.documents
                                                    .licenseDocument
                                            }
                                            alt="License"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Identity Verification
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Type: {courier.documents.identityType}
                                        <br />
                                        Number: {courier.documents.cardNumber}
                                    </p>
                                    <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={courier.documents.idProof}
                                            alt="ID Proof"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Stats */}
                        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                                Delivery Statistics
                            </h2>

                            <div className="space-y-4">
                                {deliveryStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                {stat.label}
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {stat.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Recent Activity */}
                    <div className="col-span-2">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                Recent Activity
                            </h2>

                            <div className="space-y-6">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex">
                                        <div className="mr-4">
                                            <div className="bg-blue-100 p-3 rounded-full">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 border-b border-gray-100 pb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg text-gray-800">
                                                        {activity.type ===
                                                            "delivery" &&
                                                            `Delivered Order ${activity.orderNumber}`}
                                                        {activity.type ===
                                                            "pickup" &&
                                                            `Pickup from ${activity.vendorName}`}
                                                        {activity.type ===
                                                            "verification" &&
                                                            `Document Verification`}
                                                        {activity.type ===
                                                            "rating" &&
                                                            `New Rating Received`}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        {activity.type ===
                                                            "delivery" &&
                                                            `Delivered to ${activity.customerName} at ${activity.location}`}
                                                        {activity.type ===
                                                            "pickup" &&
                                                            `Pickup location: ${activity.location}`}
                                                        {activity.type ===
                                                            "verification" &&
                                                            `${activity.documentType} verification`}
                                                        {activity.type ===
                                                            "rating" &&
                                                            `${activity.customerName} gave ${activity.rating} stars`}
                                                    </p>
                                                    {activity.feedback && (
                                                        <p className="text-gray-500 text-sm mt-2 italic">
                                                            "{activity.feedback}
                                                            "
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            activity.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    {activity.status && (
                                                        <span
                                                            className={`text-xs px-2 py-1 mt-2 rounded-full ${
                                                                activity.status ===
                                                                "completed"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : activity.status ===
                                                                      "in-progress"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                        >
                                                            {activity.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                activity.status
                                                                    .slice(1)
                                                                    .replace(
                                                                        "-",
                                                                        " "
                                                                    )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 transition py-3 rounded-lg font-medium">
                                View All Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierProfilePage;
