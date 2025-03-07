import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    Star,
    Truck,
    Edit,
    Camera,
    Tractor,
    Sprout,
    BarChart3,
    FileText,
    Clock,
    Sun,
    FileImage,
    ShoppingBag,
    ArrowUp,
    ArrowDown,
    ExternalLink,
} from "lucide-react";

const FarmerProfilePage = () => {
    // Replace static farmer state with API data
    const [farmer, setFarmer] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        address: "",
        profileImage: null,
        memberSince: "",
    });

    // Add dashboard stats state
    const [dashboardStats, setDashboardStats] = useState({
        totalOrders: 0,
        totalAmount: 0,
        totalQuantity: 0,
        pendingOrders: 0,
        completedOrders: 0,
        averageOrderValue: 0,
        recentOrders: [],
    });

    // Fetch farmer profile and dashboard data
    useEffect(() => {
        const fetchFarmerData = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    throw new Error("No access token found");
                }

                // Fetch auth data
                const authResponse = await fetch(
                    "http://localhost:3000/api/v1/auth",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const authData = await authResponse.json();

                if (authData.user) {
                    setFarmer({
                        displayName: authData.user.fullName,
                        email: authData.user.email,
                        phoneNumber: authData.user.profile?.phoneNumber || "",
                        address: authData.user.profile?.location || "",
                        profileImage: authData.user.profile?.profile || null,
                        memberSince: new Date(
                            authData.user.createdAt
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        }),
                    });
                }

                // Fetch dashboard stats
                const dashboardResponse = await fetch(
                    "http://localhost:3000/api/v1/farmer/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const dashboardData = await dashboardResponse.json();

                setDashboardStats({
                    totalOrders: dashboardData.totalOrders,
                    totalAmount: dashboardData.totalAmount,
                    totalQuantity: dashboardData.totalQuantity,
                    pendingOrders: dashboardData.pendingOrders,
                    completedOrders: dashboardData.completedOrders,
                    averageOrderValue: dashboardData.averageOrderValue,
                    recentOrders: dashboardData.recentOrders,
                });
            } catch (error) {
                console.error("Error fetching farmer data:", error);
                // Handle error appropriately (show error message, redirect to login, etc.)
            }
        };

        fetchFarmerData();
    }, []);

    // Update cropInsights to be dynamic
    const [cropInsights, setCropInsights] = useState([]);

    // Functions to render activity icons
    const getActivityIcon = (type) => {
        switch (type) {
            case "pending":
                return <Clock className="h-6 w-6 text-amber-500" />;
            case "completed":
                return <ShoppingBag className="h-6 w-6 text-green-600" />;
            case "canceled":
                return <FileText className="h-6 w-6 text-red-500" />;
            default:
                return <Package className="h-6 w-6 text-gray-500" />;
        }
    };

    // Handle profile image upload
    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setFarmer({ ...farmer, profileImage: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    // Update the stats section to show more details
    const statsSection = (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Order Statistics</h3>
                <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium text-gray-800">
                        {dashboardStats.totalOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.totalAmount}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Quantity</span>
                    <span className="font-medium text-gray-800">
                        {dashboardStats.totalQuantity} units
                    </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pending Orders</span>
                    <span className="font-medium text-amber-600">
                        {dashboardStats.pendingOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Completed Orders</span>
                    <span className="font-medium text-green-600">
                        {dashboardStats.completedOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Canceled Orders</span>
                    <span className="font-medium text-red-600">
                        {dashboardStats.canceledOrders || 0}
                    </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Average Order</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.averageOrderValue}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Highest Order</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.highestOrderAmount}
                    </span>
                </div>
            </div>
        </div>
    );

    // Add payment stats section
    const paymentStatsSection = (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">
                    Payment Statistics
                </h3>
                <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Cash Orders</span>
                    <div className="text-right">
                        <div className="font-medium text-gray-800">
                            {dashboardStats.cashOrders}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats.revenueFromCash}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Online Orders</span>
                    <div className="text-right">
                        <div className="font-medium text-gray-800">
                            {dashboardStats.onlineOrders}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats.revenueFromOnline}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pending Payments</span>
                    <div className="text-right">
                        <div className="font-medium text-amber-600">
                            {dashboardStats.pendingPayments}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats.pendingRevenue}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-green-600 to-green-800 h-40 relative">
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                                    {farmer.profileImage ? (
                                        <img
                                            src={farmer.profileImage}
                                            alt={farmer.displayName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-green-100 flex items-center justify-center">
                                            <User className="h-16 w-16 text-green-600" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-green-100 p-2 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-green-200 transition-colors"
                                >
                                    <Camera className="h-4 w-4 text-green-600" />
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
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    {farmer.displayName}
                                </h1>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <span className="font-semibold">
                                        Farmer
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">
                                        Member since {farmer.memberSince}
                                    </span>
                                </div>
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
                                            {farmer.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-gray-800">
                                            {farmer.phoneNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                                        <div>
                                            <span className="text-gray-800 block">
                                                {farmer.address}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                                        <span className="text-gray-800">
                                            Joined{" "}
                                            {new Date(
                                                farmer.memberSince
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                {statsSection}
                                {paymentStatsSection}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Active Crops */}
                    <div className="col-span-1">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Sprout className="h-5 w-5 mr-2 text-green-600" />
                                Active Crops
                            </h2>

                            <div className="space-y-4">
                                {cropInsights.map((crop, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">
                                                {crop.name}
                                            </span>
                                            <div
                                                className={`flex items-center ${
                                                    crop.status === "up"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {crop.status === "up" ? (
                                                    <ArrowUp className="h-4 w-4 mr-1" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 mr-1" />
                                                )}
                                                <span className="text-sm font-medium">
                                                    {Math.abs(crop.growth)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        60 +
                                                        (crop.growth > 0
                                                            ? crop.growth
                                                            : 0)
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 border border-green-600 text-green-600 hover:bg-green-50 transition py-3 rounded-lg font-medium flex items-center justify-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Crop
                            </button>
                        </div>

                        {/* Weather Card */}
                        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Sun className="h-5 w-5 mr-2 text-amber-500" />
                                Weather Forecast
                            </h2>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <Sun className="h-10 w-10 text-amber-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    28°C
                                </div>
                                <div className="text-gray-600">
                                    Partly Cloudy
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Mehsana, Gujarat
                                </div>
                                <div className="border-t border-blue-200 mt-4 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Humidity: 65%</span>
                                        <span>Wind: 12 km/h</span>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="#"
                                className="block w-full mt-3 text-center text-blue-600 text-sm hover:underline"
                            >
                                View 7-day forecast
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Recent Activity */}
                    <div className="col-span-2">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-green-600" />
                                Recent Activity
                            </h2>

                            <div className="space-y-6">
                                {dashboardStats.recentOrders.map((order) => (
                                    <div key={order._id} className="flex">
                                        <div className="mr-4">
                                            <div className="bg-green-100 p-3 rounded-full">
                                                {getActivityIcon(order.status)}
                                            </div>
                                        </div>
                                        <div className="flex-1 border-b border-gray-100 pb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg text-gray-800">
                                                        Order #
                                                        {order._id.slice(-6)}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        Quantity:{" "}
                                                        {order.quantity} units
                                                        <br />
                                                        Total Amount: ₹
                                                        {order.totalAmount}
                                                        <br />
                                                        Payment Method:{" "}
                                                        {order.paymentMethod}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 mt-2 rounded-full ${
                                                            order.status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.status ===
                                                                  "pending"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {order.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            order.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 mt-1 rounded-full ${
                                                            order.paymentStatus ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                    >
                                                        Payment:{" "}
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-sm text-gray-600">
                                                    Delivery Location:{" "}
                                                    {order.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 bg-green-50 hover:bg-green-100 text-green-700 transition py-3 rounded-lg font-medium">
                                View All Activity
                            </button>
                        </div>

                        {/* Marketplace Trends */}
                        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                                Order Statistics
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Count
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Cash Orders
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats.cashOrders || 0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.revenueFromCash ||
                                                    0}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Online Orders
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats.onlineOrders ||
                                                    0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.revenueFromOnline ||
                                                    0}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Pending Revenue
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats.pendingPayments ||
                                                    0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.pendingRevenue ||
                                                    0}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white transition py-3 rounded-lg font-medium">
                                List Produce for Sale
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Additional Plus icon since it's not imported at the top
const Plus = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default FarmerProfilePage;
