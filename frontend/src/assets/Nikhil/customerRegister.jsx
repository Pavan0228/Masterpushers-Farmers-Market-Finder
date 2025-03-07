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

const CustomerRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        profilePhoto: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (formData.password.length < 8) {
            formErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log form data before validation
        console.log("Form Data before validation:", {
            displayName: formData.displayName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            profilePhoto: formData.profilePhoto,
        });

        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.displayName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("role", "customer");
                formDataToSend.append("phoneNumber", formData.phoneNumber);

                if (formData.profilePhoto) {
                    formDataToSend.append("profile", formData.profilePhoto);
                }

                // Log FormData entries
                console.log("FormData entries:");
                for (let pair of formDataToSend.entries()) {
                    console.log(pair[0] + ": " + pair[1]);
                }

                console.log(
                    "Sending request to:",
                    "http://localhost:3000/api/v1/auth/signup"
                );

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth/signup",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                        },
                        credentials: "include",
                        body: formDataToSend,
                    }
                );

                console.log("Response status:", response.status);
                console.log("Response headers:", response.headers);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error data:", errorData);
                    throw new Error(errorData.message || "Registration failed");
                }

                const data = await response.json();
                console.log("Registration successful, server response:", data);

                alert("Registration successful! Please login.");
                window.location.href = "/login";
            } catch (error) {
                console.error("Registration error details:", error);
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Registration failed. Please try again.",
                }));
            } finally {
                setIsSubmitting(false);
                console.log("Submission process completed");
            }
        } else {
            console.log("Form validation failed. Current errors:", errors);
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
