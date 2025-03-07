import React, { useState, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    CheckCircle,
    Navigation,
    MapPinned,
    Building,
    FileImage,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [locationMethod, setLocationMethod] = useState("manual");
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        profilePhoto: null,
        address: "",
        city: "",
        district: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Color theme for customers
    const theme = {
        primary: "#2196F3", // Blue primary
        light: "#90CAF9", // Light blue
        secondary: "#757575", // Gray
        accent: "#03A9F4", // Lighter blue
        backgroundLight: "#E3F2FD",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profilePhoto: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleLocationMethodChange = (method) => {
        setLocationMethod(method);
        setLocationError("");

        if (method === "live") {
            setFormData((prev) => ({
                ...prev,
                address: "",
                city: "",
                district: "",
            }));
        } else if (method === "manual") {
            setFormData((prev) => ({ ...prev, city: "", district: "" }));
        } else if (method === "cityDistrict") {
            setFormData((prev) => ({ ...prev, address: "" }));
        }
    };

    const handleGetLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError("");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                    setFormData((prev) => ({
                        ...prev,
                        address: location,
                    }));
                    setIsGettingLocation(false);
                },
                (error) => {
                    setLocationError(
                        "Unable to retrieve your location. Please try another method."
                    );
                    setIsGettingLocation(false);
                }
            );
        } else {
            setLocationError(
                "Geolocation is not supported by your browser. Please try another method."
            );
            setIsGettingLocation(false);
        }
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.displayName.trim()) {
            formErrors.displayName = "Name is required";
        }

        if (!formData.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Invalid email address";
        }

        if (!formData.phoneNumber.trim()) {
            formErrors.phoneNumber = "Phone number is required";
        }

        if (!formData.password) {
            formErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const formDataToSend = new FormData();

                // Required fields
                formDataToSend.append("fullName", formData.displayName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("role", "customer");
                formDataToSend.append("phoneNumber", formData.phoneNumber);

                // Optional location field - only append if there's a value
                if (locationMethod === "manual" && formData.address.trim()) {
                    formDataToSend.append("location", formData.address);
                } else if (
                    locationMethod === "cityDistrict" &&
                    (formData.city.trim() || formData.district.trim())
                ) {
                    const locationString = [formData.city, formData.district]
                        .filter(Boolean)
                        .join(", ");
                    if (locationString) {
                        formDataToSend.append("location", locationString);
                    }
                } else if (locationMethod === "live" && formData.address) {
                    formDataToSend.append("location", formData.address);
                }

                // Optional fields
                formDataToSend.append("description", "");

                // Add profile photo if exists
                if (formData.profilePhoto) {
                    formDataToSend.append("profile", formData.profilePhoto);
                }

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth/signup",
                    {
                        method: "POST",
                        body: formDataToSend,
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                // Handle successful registration
                console.log("Registration successful:", data);
                navigate("/login"); // Redirect to login page after successful registration
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Registration failed. Please try again.",
                }));
                console.error("Registration error:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: theme.backgroundLight }}
        >
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2
                        className="text-5xl font-bold mb-3"
                        style={{ color: theme.primary }}
                    >
                        Welcome to Farm Connect
                    </h2>
                    <p style={{ color: theme.secondary }} className="text-lg">
                        Create Your Customer Account
                    </p>
                </div>

                {/* Profile Photo Upload */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4"
                        style={{ borderColor: theme.light }}
                    >
                        {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-16 w-16 text-gray-400" />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleTriggerFileInput}
                        className="py-2 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 bg-white border"
                        style={{
                            borderColor: theme.light,
                            color: theme.primary,
                        }}
                    >
                        <FileImage className="mr-2 h-5 w-5" />
                        {profilePreview
                            ? "Change Profile Photo"
                            : "Add Profile Photo"}
                    </button>
                </div>

                {/* Add Location Section (Optional) */}
                <div
                    className="space-y-4 p-6 border-2 rounded-xl mb-6"
                    style={{ borderColor: theme.light }}
                >
                    <div className="flex justify-between items-center">
                        <div className="font-semibold flex items-center text-lg text-gray-700">
                            <MapPinned className="mr-2 h-6 w-6" />
                            Delivery Location
                        </div>
                        <span className="text-sm text-gray-500">
                            (Optional)
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                        <button
                            type="button"
                            onClick={() => handleLocationMethodChange("manual")}
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                            style={{
                                backgroundColor:
                                    locationMethod === "manual"
                                        ? theme.primary
                                        : "white",
                                color:
                                    locationMethod === "manual"
                                        ? "white"
                                        : "rgb(55, 65, 81)",
                                border:
                                    locationMethod === "manual"
                                        ? "none"
                                        : `1px solid ${theme.light}`,
                            }}
                        >
                            <MapPin className="mr-2 h-5 w-5" />
                            Enter Address
                        </button>

                        <button
                            type="button"
                            onClick={() => handleLocationMethodChange("live")}
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                            style={{
                                backgroundColor:
                                    locationMethod === "live"
                                        ? theme.primary
                                        : "white",
                                color:
                                    locationMethod === "live"
                                        ? "white"
                                        : "rgb(55, 65, 81)",
                                border:
                                    locationMethod === "live"
                                        ? "none"
                                        : `1px solid ${theme.light}`,
                            }}
                        >
                            <Navigation className="mr-2 h-5 w-5" />
                            Live Location
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleLocationMethodChange("cityDistrict")
                            }
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                            style={{
                                backgroundColor:
                                    locationMethod === "cityDistrict"
                                        ? theme.primary
                                        : "white",
                                color:
                                    locationMethod === "cityDistrict"
                                        ? "white"
                                        : "rgb(55, 65, 81)",
                                border:
                                    locationMethod === "cityDistrict"
                                        ? "none"
                                        : `1px solid ${theme.light}`,
                            }}
                        >
                            <Building className="mr-2 h-5 w-5" />
                            City/District
                        </button>
                    </div>

                    <div className="mt-4">
                        {locationMethod === "manual" && (
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                <textarea
                                    name="address"
                                    placeholder="Enter Your Delivery Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none resize-none`}
                                    style={{
                                        borderColor: theme.light,
                                        minHeight: "100px",
                                    }}
                                />
                            </div>
                        )}

                        {locationMethod === "live" && (
                            <div>
                                <button
                                    type="button"
                                    onClick={handleGetLiveLocation}
                                    disabled={isGettingLocation}
                                    className="w-full bg-white py-4 px-4 rounded-xl transition duration-300 flex items-center justify-center text-lg border"
                                    style={{
                                        borderColor: theme.light,
                                        color: theme.primary,
                                    }}
                                >
                                    <Navigation className="mr-3 h-6 w-6" />
                                    {isGettingLocation
                                        ? "Getting Location..."
                                        : "Get Current Location"}
                                </button>

                                {formData.address &&
                                    locationMethod === "live" && (
                                        <div
                                            className="mt-4 p-4 bg-white rounded-xl border"
                                            style={{ borderColor: theme.light }}
                                        >
                                            <p className="text-base text-gray-700">
                                                <span className="font-medium">
                                                    Location captured:
                                                </span>{" "}
                                                {formData.address}
                                            </p>
                                        </div>
                                    )}

                                {locationError && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {locationError}
                                    </p>
                                )}
                            </div>
                        )}

                        {locationMethod === "cityDistrict" && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Building className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                                        style={{ borderColor: theme.light }}
                                    />
                                </div>

                                <div className="relative">
                                    <MapPinned className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                    <input
                                        type="text"
                                        name="district"
                                        placeholder="District"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                                        style={{ borderColor: theme.light }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="text"
                            name="displayName"
                            placeholder="Full Name"
                            value={formData.displayName}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.displayName ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.displayName
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.displayName}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.email ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.email
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.phoneNumber ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.phoneNumber
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.password ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.password
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.confirmPassword
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {errors.submit && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {errors.submit}
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white py-4 rounded-xl transition duration-300 flex items-center justify-center text-lg font-medium mt-6 shadow-md ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        style={{ backgroundColor: theme.primary }}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Registering...
                            </div>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-6 w-6" />
                                Register
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-lg">
                        Already have an account?{" "}
                        <a
                            href="#"
                            className="ml-2 hover:underline font-medium"
                            style={{ color: theme.primary }}
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegistrationPage;
