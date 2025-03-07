import React, { useState } from "react";
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
    Camera,
    DollarSign,
    FileText,
    Tag
} from "lucide-react";

const ProductListingPage = () => {
    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        price: "",
        location: "",
        marketName: "",
        productPhoto: null,
    });

    const [errors, setErrors] = useState({});
    const [locationMethod, setLocationMethod] = useState("manual");
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [suggestedMarkets, setSuggestedMarkets] = useState([]);
    const [activeStep, setActiveStep] = useState(1);
    const [previewURL, setPreviewURL] = useState(null);
    const [success, setSuccess] = useState(false);

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
                productPhoto: file,
            }));
            // Create URL for preview
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.productName.trim()) {
            formErrors.productName = "Product name is required";
        }

        if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            formErrors.price = "Price must be a positive number";
        }

        if (locationMethod === "manual" && !formData.location.trim()) {
            formErrors.location = "Please enter your location";
        }

        if (!formData.marketName.trim()) {
            formErrors.marketName = "Market name is required";
        }

        if (!formData.productPhoto) {
            formErrors.productPhoto = "Please upload a product photo";
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
                    const location = `Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}`;
                    setFormData((prev) => ({
                        ...prev,
                        location: location,
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

    const handleMarketSearch = (e) => {
        const query = e.target.value;
        setFormData((prev) => ({
            ...prev,
            marketName: query,
        }));

        // Simulate market suggestions based on the query
        const allMarkets = [
            "Farmers Market",
            "Local Produce Market",
            "Organic Market",
            "City Market",
            "Weekend Market",
            "Artisan Market",
            "Green Market"
        ];
        const filteredMarkets = allMarkets.filter((market) =>
            market.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestedMarkets(filteredMarkets);
    };

    const selectMarket = (market) => {
        setFormData((prev) => ({
            ...prev,
            marketName: market,
        }));
        setSuggestedMarkets([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Submit form logic
            console.log("Product listed", formData);
            setSuccess(true);
            // Reset after 3 seconds
            setTimeout(() => {
                setSuccess(false);
                // Reset form
                setFormData({
                    productName: "",
                    description: "",
                    price: "",
                    location: "",
                    marketName: "",
                    productPhoto: null,
                });
                setPreviewURL(null);
                setActiveStep(1);
            }, 3000);
        }
    };

    const handleLocationMethodChange = (method) => {
        setLocationMethod(method);
        setLocationError("");

        if (method === "live") {
            setFormData((prev) => ({ ...prev, location: "" }));
        }
    };

    const nextStep = () => {
        setActiveStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setActiveStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-2xl relative overflow-hidden">
                {success && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-fade-in">
                        <CheckCircle className="text-green-500 h-24 w-24 mb-6" />
                        <h2 className="text-3xl font-bold text-green-700 mb-3">Product Listed Successfully!</h2>
                        <p className="text-gray-600 text-lg mb-8">Your product has been added to the marketplace.</p>
                    </div>
                )}

                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-3">
                        List Your Product
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Share your fresh produce with the community
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8 px-4">
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${activeStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <Tag className="h-6 w-6" />
                        </div>
                        <span className="text-sm mt-2">Details</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed self-center mx-3 border-green-200"></div>
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${activeStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <Camera className="h-6 w-6" />
                        </div>
                        <span className="text-sm mt-2">Photo</span>
                    </div>
                    <div className="flex-1 border-t-2 border-dashed self-center mx-3 border-green-200"></div>
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full h-12 w-12 flex items-center justify-center ${activeStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <MapPinned className="h-6 w-6" />
                        </div>
                        <span className="text-sm mt-2">Location</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Product Details */}
                    {activeStep === 1 && (
                        <div className="animate-fade-in">
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Tag className="h-6 w-6 text-green-600" />
                                </div>
                                <input
                                    type="text"
                                    name="productName"
                                    placeholder="Product Name"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none 
                                    ${errors.productName ? "border-red-500 focus:border-red-500" : "border-green-200 focus:border-green-600"}`}
                                    required
                                />
                                {errors.productName && (
                                    <p className="text-red-500 text-base mt-2 ml-2">
                                        {errors.productName}
                                    </p>
                                )}
                            </div>

                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 pt-4 pointer-events-none">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <textarea
                                    name="description"
                                    placeholder="Product Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full pl-14 pr-5 py-4 text-lg border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-600"
                                    rows="4"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none 
                                    ${errors.price ? "border-red-500 focus:border-red-500" : "border-green-200 focus:border-green-600"}`}
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-base mt-2 ml-2">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                            
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition duration-300 font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Product Photo */}
                    {activeStep === 2 && (
                        <div className="animate-fade-in">
                            <div className="relative bg-green-50 p-6 rounded-xl border-2 border-dashed border-green-300 text-center">
                                {previewURL ? (
                                    <div className="mb-4">
                                        <img src="/api/placeholder/300/200" alt="Product preview" className="mx-auto rounded-lg shadow-md" />
                                        <p className="text-green-700 mt-2">Product photo preview</p>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <Camera className="h-16 w-16 text-green-500 mx-auto mb-2" />
                                        <p className="text-green-700">Upload a photo of your product</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    id="productPhoto"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="productPhoto"
                                    className="cursor-pointer bg-white text-green-700 py-3 px-4 rounded-xl hover:bg-green-100 transition duration-300 border border-green-200 inline-block"
                                >
                                    {previewURL ? "Change Photo" : "Select Photo"}
                                </label>
                                {errors.productPhoto && (
                                    <p className="text-red-500 text-base mt-2">
                                        {errors.productPhoto}
                                    </p>
                                )}
                            </div>
                            
                            <div className="mt-8 flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-300 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition duration-300 font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location and Market */}
                    {activeStep === 3 && (
                        <div className="animate-fade-in">
                            {/* Market Name Search */}
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Building className="h-6 w-6 text-green-600" />
                                </div>
                                <input
                                    type="text"
                                    name="marketName"
                                    placeholder="Search for Market Name"
                                    value={formData.marketName}
                                    onChange={handleMarketSearch}
                                    className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none 
                                    ${errors.marketName ? "border-red-500 focus:border-red-500" : "border-green-200 focus:border-green-600"}`}
                                    required
                                />
                                {errors.marketName && (
                                    <p className="text-red-500 text-base mt-2 ml-2">
                                        {errors.marketName}
                                    </p>
                                )}
                                {suggestedMarkets.length > 0 && (
                                    <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded-lg shadow-lg">
                                        {suggestedMarkets.map((market, index) => (
                                            <li
                                                key={index}
                                                className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                onClick={() => selectMarket(market)}
                                            >
                                                <div className="flex items-center">
                                                    <Building className="h-5 w-5 text-green-600 mr-2" />
                                                    {market}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Location section */}
                            <div className="space-y-5 border-2 border-green-100 p-6 rounded-xl bg-green-50/30">
                                <div className="font-medium text-green-700 flex items-center text-lg">
                                    <MapPinned className="mr-2 h-6 w-6" />
                                    Product Location
                                </div>

                                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleLocationMethodChange("manual")
                                        }
                                        className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 ${
                                            locationMethod === "manual"
                                                ? "bg-green-600 text-white shadow-md"
                                                : "bg-white text-gray-700 hover:bg-green-100 border border-green-200"
                                        }`}
                                    >
                                        <MapPin className="mr-2 h-5 w-5" />
                                        Enter Location
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleLocationMethodChange("live")
                                        }
                                        className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 ${
                                            locationMethod === "live"
                                                ? "bg-green-600 text-white shadow-md"
                                                : "bg-white text-gray-700 hover:bg-green-100 border border-green-200"
                                        }`}
                                    >
                                        <Navigation className="mr-2 h-5 w-5" />
                                        Live Location
                                    </button>
                                </div>

                                <div className="mt-4">
                                    {locationMethod === "manual" && (
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 text-green-600 h-6 w-6" />
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="Enter Location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                                    errors.location
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "border-green-200 focus:border-green-600 bg-white"
                                                }`}
                                            />
                                            {errors.location && (
                                                <p className="text-red-500 text-base mt-2 ml-2">
                                                    {errors.location}
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
                                                className={`w-full bg-white text-green-700 py-4 px-4 rounded-xl hover:bg-green-100 transition duration-300 flex items-center justify-center text-lg border border-green-200 ${isGettingLocation ? 'opacity-70' : ''}`}
                                            >
                                                <Navigation className={`mr-3 h-6 w-6 ${isGettingLocation ? 'animate-spin' : ''}`} />
                                                {isGettingLocation
                                                    ? "Getting Location..."
                                                    : "Get Current Location"}
                                            </button>

                                            {formData.location &&
                                                locationMethod === "live" && (
                                                    <div className="mt-4 p-4 bg-white rounded-xl border border-green-200 animate-fade-in">
                                                        <p className="text-base text-green-800">
                                                            <span className="font-medium">
                                                                Location captured:
                                                            </span>{" "}
                                                            {formData.location}
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
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-300 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center font-medium shadow-md"
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    List Product
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProductListingPage;