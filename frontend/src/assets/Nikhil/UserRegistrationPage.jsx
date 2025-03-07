import React, { useState  } from "react";
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
} from "lucide-react";

const FarmRegistrationPage = () => {
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        district: "",
        password: "",
        confirmPassword: "",
        farmType: "veg", // Default to veg farm type
    });

    const [errors, setErrors] = useState({});
    const [locationMethod, setLocationMethod] = useState("manual"); // 'manual', 'live', 'cityDistrict'
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    // Color themes based on farm type
    const themes = {
        veg: {
            primary: "#4CAF50", // Green primary
            light: "#AED581", // Light green
            secondary: "#8D6E63", // Earth brown
            accent: "#CDDC39", // Lime accent
            backgroundLight: "#f1f8e9",
        },
        nonveg: {
            primary: "#FFB300", // Yellow/gold primary
            light: "#FFD54F", // Light yellow
            secondary: "#795548", // Brown
            accent: "#FFF8E1", // Cream/off-white
            backgroundLight: "#fff8e1",
        },
        both: {
            primary: "#388E3C", // Deeper green
            light: "#A5D6A7", // Muted green
            secondary: "#8D6E63", // Earth brown
            accent: "#FFC107", // Amber accent
            backgroundLight: "#f5f5f5",
        },
    };

    // Get current theme based on farm type
    const currentTheme = themes[formData.farmType];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.password.length < 8) {
            formErrors.password = "Password must be at least 8 characters";
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Submit form logic
            console.log("Form submitted", formData);
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
            case "veg":
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

                {/* Farm Type Selection */}
                <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-3 text-lg">
                        Choose Farm Type
                    </label>
                    <div className="flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    farmType: "veg",
                                }))
                            }
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 ${
                                formData.farmType === "veg"
                                    ? "bg-green-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-green-100 border border-green-200"
                            }`}
                        >
                            <Leaf className="mr-2 h-5 w-5" />
                            Vegetable Farming
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    farmType: "nonveg",
                                }))
                            }
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 ${
                                formData.farmType === "nonveg"
                                    ? "bg-yellow-500 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-yellow-100 border border-yellow-200"
                            }`}
                        >
                            <Egg className="mr-2 h-5 w-5" />
                            Poultry And Livestock Farming
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    farmType: "both",
                                }))
                            }
                            className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 ${
                                formData.farmType === "both"
                                    ? "bg-emerald-700 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                        >
                            <Filter className="mr-2 h-5 w-5" />
                            Mixed Farming
                        </button>
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
                        className="w-full text-white py-4 rounded-xl transition duration-300 flex items-center justify-center text-lg font-medium mt-6 shadow-md"
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        <CheckCircle className="mr-2 h-6 w-6" />
                        Register
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
