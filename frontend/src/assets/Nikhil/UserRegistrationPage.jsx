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
    Leaf,
    Egg,
    Filter,
    FileImage,
    PenLine,
    Home,
    Info,
} from "lucide-react";

const FarmRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update farmType options to match backend enum
    const farmTypes = [
        { value: "veg", label: "Vegetable Farming", icon: Leaf },
        { value: "nonveg", label: "Poultry And Dairy Farming", icon: Egg },
        { value: "both", label: "Mixed Farming", icon: Filter },
    ];

    // Update the initial form data with correct farmType value
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        farmName: "",
        farmDescription: "",
        address: "",
        city: "",
        district: "",
        password: "",
        confirmPassword: "",
        farmType: "veg", // Default to veg farming
        profilePhoto: null,
    });

    const [errors, setErrors] = useState({});
    const [locationMethod, setLocationMethod] = useState("manual"); // 'manual', 'live', 'cityDistrict'
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    // Color themes based on farm type
    const themes = {
        veg: {
            primary: "#4CAF50",
            light: "#AED581",
            secondary: "#8D6E63",
            accent: "#CDDC39",
            backgroundLight: "#f1f8e9",
        },
        nonveg: {
            primary: "#FFB300",
            light: "#FFD54F",
            secondary: "#795548",
            accent: "#FFF8E1",
            backgroundLight: "#fff8e1",
        },
        both: {
            primary: "#388E3C",
            light: "#A5D6A7",
            secondary: "#8D6E63",
            accent: "#FFC107",
            backgroundLight: "#f5f5f5",
        },
    };

    // Get current theme based on farm type with fallback
    const currentTheme = themes[formData.farmType] || themes.veg;

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

            // Create preview URL
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

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.password.length < 8) {
            formErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.farmName.trim()) {
            formErrors.farmName = "Please enter your farm name";
        }

        // Location validation based on selected method
        if (locationMethod === "manual" && !formData.address.trim()) {
            formErrors.address = "Please enter your address";
        } else if (
            locationMethod === "cityDistrict" &&
            !formData.city.trim() &&
            !formData.district.trim()
        ) {
            formErrors.cityDistrict =
                "Please enter either city or district name";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleGetLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError("");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real application, you might want to use a reverse geocoding service
                    // to convert coordinates to an address. For demonstration, we'll just store coordinates.
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
                    console.error("Error getting location:", error);
                }
            );
        } else {
            setLocationError(
                "Geolocation is not supported by your browser. Please try another method."
            );
            setIsGettingLocation(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log when button is clicked
        console.log("Farmer Register button clicked!");

        // Log all form data
        console.log("Current Form Data:", {
            fullName: formData.displayName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            farmName: formData.farmName,
            farmDescription: formData.farmDescription,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            farmType: formData.farmType,
            profilePhoto: formData.profilePhoto
                ? {
                      name: formData.profilePhoto.name,
                      type: formData.profilePhoto.type,
                      size: formData.profilePhoto.size,
                  }
                : null,
        });

        // Log validation status
        const isValid = validateForm();
        console.log("Form Validation Status:", isValid);
        console.log("Current Errors:", errors);

        if (isValid) {
            setIsSubmitting(true);
            console.log("Starting submission process...");

            try {
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.displayName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("role", "farmer");
                formDataToSend.append("phoneNumber", formData.phoneNumber);
                formDataToSend.append("farmName", formData.farmName);
                formDataToSend.append("description", formData.farmDescription);
                formDataToSend.append(
                    "location",
                    formData.address || `${formData.city}, ${formData.district}`
                );
                formDataToSend.append("farmType", formData.farmType);

                if (formData.profilePhoto) {
                    formDataToSend.append("profile", formData.profilePhoto);
                }

                // Log all data being sent to server
                console.log("=== Data Being Sent to Server ===");
                for (let [key, value] of formDataToSend.entries()) {
                    if (key === "profile") {
                        console.log("profile:", {
                            name: value.name,
                            type: value.type,
                            size: value.size,
                        });
                    } else {
                        console.log(`${key}:`, value);
                    }
                }

                console.log("Sending request to API...");
                console.log(
                    "API Endpoint:",
                    "http://localhost:3000/api/v1/auth/signup"
                );
                console.log("Request Method:", "POST");

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth/signup",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                        },
                        body: formDataToSend,
                    }
                );

                console.log("=== Response Details ===");
                console.log("Response Status:", response.status);
                console.log("Response Status Text:", response.statusText);
                console.log("Response Headers:", {
                    contentType: response.headers.get("content-type"),
                    authorization: response.headers.get("authorization"),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error Response Data:", errorData);
                    throw new Error(errorData.message || "Registration failed");
                }

                const data = await response.json();
                console.log("=== Success Response Data ===");
                console.log(data);

                console.log(
                    "Farmer Registration successful! Redirecting to login..."
                );
                alert("Registration successful! Please login.");
                window.location.href = "/login";
            } catch (error) {
                console.log("=== Error Details ===");
                console.log("Error Name:", error.name);
                console.log("Error Message:", error.message);
                console.log("Error Stack:", error.stack);

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
            console.log("=== Validation Failed ===");
            console.log("Validation Errors:", errors);
        }
    };

    const handleLocationMethodChange = (method) => {
        setLocationMethod(method);
        setLocationError("");

        // Clear relevant fields when changing methods
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

    const getFarmTypeIcon = () => {
        switch (formData.farmType) {
            case "Veg":
                return <Leaf className="h-6 w-6 text-green-600" />;
            case "nonveg":
                return <Egg className="h-6 w-6 text-yellow-600" />;
            case "both":
                return <Filter className="h-6 w-6 text-emerald-700" />;
            default:
                return <Leaf className="h-6 w-6 text-green-600" />;
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: currentTheme.backgroundLight }}
        >
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2
                        className="text-5xl font-bold mb-3"
                        style={{ color: currentTheme.primary }}
                    >
                        Farm Connect
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Create Your Farmer Account
                    </p>
                </div>

                {/* Profile Photo Upload */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4"
                        style={{ borderColor: currentTheme.light }}
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
                            borderColor: currentTheme.light,
                            color: currentTheme.primary,
                        }}
                    >
                        <FileImage className="mr-2 h-5 w-5" />
                        {profilePreview
                            ? "Change Profile Photo"
                            : "Add Profile Photo"}
                    </button>
                </div>

                {/* Farm Type Selection */}
                <div className="space-y-6">
                    <div className="font-medium text-gray-700 mb-2">
                        Choose Farm Type
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {farmTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            farmType: type.value,
                                        }));
                                        console.log(
                                            "Selected farm type:",
                                            type.value
                                        ); // Log selection
                                    }}
                                    className={`p-4 rounded-xl border-2 transition duration-300 flex flex-col items-center justify-center space-y-2 ${
                                        formData.farmType === type.value
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-green-300"
                                    }`}
                                >
                                    <Icon
                                        className={`h-8 w-8 ${
                                            formData.farmType === type.value
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span
                                        className={`text-sm font-medium ${
                                            formData.farmType === type.value
                                                ? "text-green-700"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
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
                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                            style={{
                                borderColor: currentTheme.light,
                                ":focus": { borderColor: currentTheme.primary },
                            }}
                            required
                        />
                    </div>

                    {/* Farm Name Field */}
                    <div className="relative">
                        <Home className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="text"
                            name="farmName"
                            placeholder="Farm Name"
                            value={formData.farmName}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.farmName
                                    ? "border-red-500 focus:border-red-500"
                                    : ""
                            }`}
                            style={
                                !errors.farmName
                                    ? {
                                          borderColor: currentTheme.light,
                                          ":focus": {
                                              borderColor: currentTheme.primary,
                                          },
                                      }
                                    : {}
                            }
                            required
                        />
                        {errors.farmName && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.farmName}
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
                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                            style={{
                                borderColor: currentTheme.light,
                                ":focus": { borderColor: currentTheme.primary },
                            }}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                            style={{
                                borderColor: currentTheme.light,
                                ":focus": { borderColor: currentTheme.primary },
                            }}
                            required
                        />
                    </div>

                    {/* Farm Description */}
                    <div className="relative">
                        <PenLine className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <textarea
                            name="farmDescription"
                            placeholder="Farm Description - Tell us about your farm, products, etc."
                            value={formData.farmDescription}
                            onChange={handleChange}
                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none resize-none"
                            style={{
                                borderColor: currentTheme.light,
                                ":focus": { borderColor: currentTheme.primary },
                                minHeight: "120px",
                            }}
                        />
                    </div>

                    {/* Location section */}
                    <div
                        className="space-y-5 border-2 p-6 rounded-xl"
                        style={{
                            borderColor: currentTheme.light,
                            backgroundColor: `${currentTheme.backgroundLight}`,
                        }}
                    >
                        <div
                            className="font-medium flex items-center text-lg"
                            style={{ color: currentTheme.primary }}
                        >
                            <MapPinned className="mr-2 h-6 w-6" />
                            Farm Location
                        </div>

                        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                            <button
                                type="button"
                                onClick={() =>
                                    handleLocationMethodChange("manual")
                                }
                                className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                                style={{
                                    backgroundColor:
                                        locationMethod === "manual"
                                            ? currentTheme.primary
                                            : "white",
                                    color:
                                        locationMethod === "manual"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "manual"
                                            ? "none"
                                            : `1px solid ${currentTheme.light}`,
                                }}
                            >
                                <MapPin className="mr-2 h-5 w-5" />
                                Enter Address
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleLocationMethodChange("live")
                                }
                                className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                                style={{
                                    backgroundColor:
                                        locationMethod === "live"
                                            ? currentTheme.primary
                                            : "white",
                                    color:
                                        locationMethod === "live"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "live"
                                            ? "none"
                                            : `1px solid ${currentTheme.light}`,
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
                                            ? currentTheme.primary
                                            : "white",
                                    color:
                                        locationMethod === "cityDistrict"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "cityDistrict"
                                            ? "none"
                                            : `1px solid ${currentTheme.light}`,
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
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter Farm Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                            errors.address
                                                ? "border-red-500 focus:border-red-500"
                                                : "bg-white"
                                        }`}
                                        style={
                                            !errors.address
                                                ? {
                                                      borderColor:
                                                          currentTheme.light,
                                                      ":focus": {
                                                          borderColor:
                                                              currentTheme.primary,
                                                      },
                                                  }
                                                : {}
                                        }
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-base mt-2 ml-2">
                                            {errors.address}
                                        </p>
                                    )}
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
                                            borderColor: currentTheme.light,
                                            color: currentTheme.primary,
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
                                                style={{
                                                    borderColor:
                                                        currentTheme.light,
                                                }}
                                            >
                                                <p
                                                    className="text-base"
                                                    style={{
                                                        color: currentTheme.secondary,
                                                    }}
                                                >
                                                    <span className="font-medium">
                                                        Location captured:
                                                    </span>{" "}
                                                    {formData.address}
                                                </p>
                                            </div>
                                        )}

                                    {locationError && (
                                        <p className="text-red-500 text-base mt-2 ml-2">
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
                                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none bg-white"
                                            style={{
                                                borderColor: currentTheme.light,
                                                ":focus": {
                                                    borderColor:
                                                        currentTheme.primary,
                                                },
                                            }}
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
                                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none bg-white"
                                            style={{
                                                borderColor: currentTheme.light,
                                                ":focus": {
                                                    borderColor:
                                                        currentTheme.primary,
                                                },
                                            }}
                                        />
                                    </div>

                                    {errors.cityDistrict && (
                                        <p className="text-red-500 text-base ml-2">
                                            {errors.cityDistrict}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none 
                ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
                            style={
                                !errors.password
                                    ? {
                                          borderColor: currentTheme.light,
                                          ":focus": {
                                              borderColor: currentTheme.primary,
                                          },
                                      }
                                    : {}
                            }
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
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none 
                ${
                    errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : ""
                }`}
                            style={
                                !errors.confirmPassword
                                    ? {
                                          borderColor: currentTheme.light,
                                          ":focus": {
                                              borderColor: currentTheme.primary,
                                          },
                                      }
                                    : {}
                            }
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white py-4 rounded-xl transition duration-300 flex items-center justify-center text-lg font-medium mt-6 shadow-md ${
                            isSubmitting ? "opacity-70" : ""
                        }`}
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        {isSubmitting ? (
                            "Registering..."
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
                        Already have an account?
                        <a
                            href="#"
                            className="ml-2 hover:underline font-medium"
                            style={{ color: currentTheme.primary }}
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FarmRegistrationPage;
