import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Truck,
    Shield,
    Star,
    FileText,
    Camera,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react";

const ProfileCourier = () => {
    const [courierData, setCourierData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourierProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                setCourierData(data.user);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchCourierProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Error
                    </h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!courierData) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                                    {courierData.profile?.profile ? (
                                        <img
                                            src={courierData.profile.profile}
                                            alt={courierData.fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-full w-full p-4 text-gray-400" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Basic Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {courierData.fullName}
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        {courierData.profile?.description ||
                                            "No description provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600 break-all">
                                                {courierData.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-600">
                                                {
                                                    courierData.profile
                                                        ?.phoneNumber
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600">
                                                {courierData.profile?.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Truck className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-gray-600">
                                                    Vehicle Type:{" "}
                                                    {
                                                        courierData.profile
                                                            ?.vehicleType
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Star className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-600">
                                                Rating:{" "}
                                                {courierData.profile?.ratings ||
                                                    "No ratings yet"}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Shield className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-600">
                                                {courierData.profile
                                                    ?.isVerified ? (
                                                    <span className="text-green-600 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 flex items-center">
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Not Verified
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Documents
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                License Number
                                            </p>
                                            <p className="text-gray-900">
                                                {
                                                    courierData.profile
                                                        ?.drivingLicenseNumber
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                ID Type
                                            </p>
                                            <p className="text-gray-900">
                                                {
                                                    courierData.profile
                                                        ?.identityVerification
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Card Number
                                            </p>
                                            <p className="text-gray-900">
                                                {
                                                    courierData.profile
                                                        ?.cardNumber
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Date of Birth
                                            </p>
                                            <p className="text-gray-900">
                                                {new Date(
                                                    courierData.profile?.dateOfBirth
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Images */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            License Document
                        </h3>
                        {courierData.profile?.licenseDocument && (
                            <img
                                src={courierData.profile.licenseDocument}
                                alt="License Document"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            ID Proof
                        </h3>
                        {courierData.profile?.idProof && (
                            <img
                                src={courierData.profile.idProof}
                                alt="ID Proof"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCourier;
