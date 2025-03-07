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
import axios from "axios";

const FarmerProfilePage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get token and user data from localStorage
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Check if user is farmer
            if (userRole !== "farmer") {
                setError("Unauthorized access");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:3000/api/v1/farmer/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch dashboard data");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, userRole]);

    // Update farmer state with user data from localStorage
    const [farmer, setFarmer] = useState({
        displayName: userData.fullName || "Loading...",
        email: userData.email || "",
        phoneNumber: "+91 98765 43210", // This should come from profile API
        address: "Loading...", // This should come from profile API
        district: "Loading...", // This should come from profile API
        state: "Loading...", // This should come from profile API
        memberSince: new Date(userData.createdAt).toLocaleDateString(),
        profileImage: null,
        crops: [],
        rating: 0,
        totalSales: 0,
        verifiedStatus: false,
    });

    // Transform dashboard data into recent activities
    const transformOrderToActivity = (order) => ({
        id: order._id,
        type: "sale",
        crop: order.product, // You might want to fetch product details separately
        quantity: `${order.quantity} units`,
        price: `₹${order.totalAmount}`,
        buyer: order.customer, // You might want to fetch customer details separately
        date: order.createdAt,
        status: order.status,
    });

    // Update recent activities when dashboard data changes
    useEffect(() => {
        if (dashboardData) {
            const activities = dashboardData.recentOrders.map(
                transformOrderToActivity
            );
            setRecentActivities(activities);
        }
    }, [dashboardData]);

    // Update crop insights based on dashboard data
    const [cropInsights, setCropInsights] = useState([]);

    // Sample recent activities
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: "harvest",
            crop: "Tomatoes",
            quantity: "120 kg",
            date: "2025-03-04",
            status: "completed",
            notes: "Good yield despite dry conditions",
        },
        {
            id: 2,
            type: "sale",
            crop: "Spinach",
            quantity: "40 kg",
            price: "₹35/kg",
            buyer: "Green Grocers Ltd",
            date: "2025-03-02",
            status: "completed",
        },
        {
            id: 3,
            type: "planting",
            crop: "Okra",
            area: "0.5 acres",
            date: "2025-02-28",
            status: "in-progress",
            expectedHarvest: "2025-04-15",
        },
        {
            id: 4,
            type: "market_update",
            crop: "Eggplant",
            priceChange: "+12%",
            date: "2025-02-25",
            notes: "Price increase due to seasonal demand",
        },
        {
            id: 5,
            type: "image_upload",
            crop: "Tomatoes",
            date: "2025-02-20",
            status: "shared",
            likes: 35,
        },
    ]);

    // Functions to render activity icons
    const getActivityIcon = (type) => {
        switch (type) {
            case "harvest":
                return <Tractor className="h-6 w-6 text-amber-500" />;
            case "sale":
                return <ShoppingBag className="h-6 w-6 text-green-600" />;
            case "planting":
                return <Sprout className="h-6 w-6 text-emerald-500" />;
            case "market_update":
                return <BarChart3 className="h-6 w-6 text-blue-500" />;
            case "image_upload":
                return <FileImage className="h-6 w-6 text-purple-500" />;
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
                setFarmer({ ...farmer, profileImage: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    if (!token || userRole !== "farmer") {
        return <div>Unauthorized access. Please login as a farmer.</div>;
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                                <h1 className="text-2xl font-bold text-white flex items-center">
                                    {farmer.displayName}
                                    {farmer.verifiedStatus && (
                                        <span className="ml-2 bg-white text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                                            Verified
                                        </span>
                                    )}
                                </h1>
                                <p className="text-green-100">
                                    Farmer • Member since {farmer.memberSince}
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
                                            <span className="text-gray-600">
                                                {farmer.district},{" "}
                                                {farmer.state}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-gray-700">
                                            Farmer Stats
                                        </h3>
                                        <Star className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Rating
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {farmer.rating}/5.0
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Total Sales
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {farmer.totalSales} kg
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Crops
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {farmer.crops.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Total Orders</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.totalOrders || 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Total Revenue</h3>
                        <p className="text-2xl font-bold">
                            ₹{dashboardData?.totalAmount || 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Pending Orders</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.pendingOrders || 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Average Order Value</h3>
                        <p className="text-2xl font-bold">
                            ₹{dashboardData?.averageOrderValue || 0}
                        </p>
                    </div>
                </div>

                {/* Payment Stats */}
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Payment Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <h3 className="text-gray-500">Payment Status</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span>Pending</span>
                                    <span>
                                        {dashboardData?.pendingPayments || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Completed</span>
                                    <span>
                                        {dashboardData?.completedPayments || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Failed</span>
                                    <span>
                                        {dashboardData?.failedPayments || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-gray-500">Payment Methods</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span>Cash</span>
                                    <span>
                                        {dashboardData?.cashOrders || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Online</span>
                                    <span>
                                        {dashboardData?.onlineOrders || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-gray-500">Revenue</h3>
                            <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                    <span>Cash Revenue</span>
                                    <span>
                                        ₹{dashboardData?.revenueFromCash || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Online Revenue</span>
                                    <span>
                                        ₹{dashboardData?.revenueFromOnline || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pending Revenue</span>
                                    <span>
                                        ₹{dashboardData?.pendingRevenue || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Recent Orders
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3">Order ID</th>
                                    <th className="text-left py-3">Amount</th>
                                    <th className="text-left py-3">Status</th>
                                    <th className="text-left py-3">Payment</th>
                                    <th className="text-left py-3">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b">
                                        <td className="py-3">{order._id}</td>
                                        <td className="py-3">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : order.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    order.paymentStatus ===
                                                    "completed"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            {order.location}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
