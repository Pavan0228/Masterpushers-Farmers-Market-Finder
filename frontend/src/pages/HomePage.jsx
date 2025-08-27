import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MapPin,
    Search,
    Truck,
    Apple,
    Leaf,
    ShoppingBag,
    Calendar,
    Users,
    ExternalLink,
    ChevronRight,
    Heart,
} from "lucide-react";
import ProductShowPage from "@/assets/Nikhil/ProductShowPage";
import MarketMap from "@/components/MarketMap";
import HeroSection from "./HeroSection";

const HomePage = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async () => {
        console.log(`Searching for markets near ${location}`);
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/ampc?location=${location}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50/20">
            {/* Hero Section */}
            <HeroSection />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 space-y-20">
                {/* Display suggestions above the local markets section */}
                {suggestions.length > 0 && (
                    <div className="animate-fade-in">
                        <div className="flex items-center mb-12">
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-grow"></div>
                            <h2 className="text-3xl font-bold px-8 text-green-800 flex items-center bg-white rounded-full py-3 shadow-sm border border-green-100">
                                <MapPin className="mr-3 h-6 w-6 text-green-600" />
                                Market Suggestions
                            </h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-grow"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {suggestions.map((ampc, index) => (
                                <div
                                    key={index}
                                    className="group card-modern bg-white rounded-2xl overflow-hidden border border-green-100 animate-scale-in"
                                    style={{animationDelay: `${index * 0.1}s`}}
                                >
                                    <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-400 p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                        <h3 className="text-xl font-bold flex items-center relative z-10">
                                            <Truck className="mr-3 h-6 w-6" />
                                            {ampc.ApmcFullCode}
                                        </h3>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start group-hover:text-green-700 transition-colors">
                                            <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                                            <p className="text-gray-700 leading-relaxed">
                                                {ampc.AddressE || ampc.AddressM}
                                            </p>
                                        </div>

                                        {ampc.Phone && (
                                            <div className="flex items-center group-hover:text-green-700 transition-colors">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-green-600 mr-3"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                    />
                                                </svg>
                                                <p className="text-gray-700 font-medium">
                                                    {ampc.Phone}
                                                </p>
                                            </div>
                                        )}

                                        {ampc.PinCode && (
                                            <div className="flex items-center group-hover:text-green-700 transition-colors">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-green-600 mr-3"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Pin Code:</span> {ampc.PinCode}
                                                </p>
                                            </div>
                                        )}

                                        {ampc.MarketList.length > 0 && (
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <div className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                                                    <Leaf className="h-4 w-4 mr-2" />
                                                    {ampc.MarketList[0]
                                                        .MainMarketNameE ||
                                                        ampc.MarketList[0]
                                                            .MainMarketNameM}
                                                </div>
                                                <div className="rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <MarketMap
                                                        addressE={ampc.AddressE}
                                                        addressM={ampc.AddressM}
                                                        marketName={
                                                            ampc.MarketList[0]
                                                                .MainMarketNameE ||
                                                            ampc.MarketList[0]
                                                                .MainMarketNameM
                                                        }
                                                    />
                                                </div>
                                                <a
                                                    href={`https://maps.google.com/?q=${
                                                        ampc.AddressE ||
                                                        ampc.AddressM
                                                    }`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-4 inline-flex items-center justify-center w-full text-green-600 hover:text-white text-sm font-semibold py-3 border-2 border-green-200 rounded-lg hover:bg-green-600 hover:border-green-600 transition-all duration-300 group"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Get Directions
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Features Section */}
                <div className="animate-fade-in">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-2 mb-6">
                            <Leaf className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-semibold">Why Choose Local</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-800 mb-4">
                            Why Choose Farmers Markets?
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                            Discover the benefits of shopping directly from
                            local farmers and producers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="group border-green-100 hover:border-green-300 transition-all duration-500 animate-slide-up bg-gradient-to-br from-white to-green-50/30" style={{animationDelay: '0.1s'}}>
                            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-xl"></div>
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="text-white h-6 w-6" />
                                </div>
                                <CardTitle className="text-green-700 group-hover:text-green-800 transition-colors">
                                    Local Markets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Discover farmers markets near you, with
                                    detailed location and schedule information.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                                    <span>Find nearby markets</span>
                                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-green-100 hover:border-green-300 transition-all duration-500 animate-slide-up bg-gradient-to-br from-white to-green-50/30" style={{animationDelay: '0.2s'}}>
                            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-xl"></div>
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Apple className="text-white h-6 w-6" />
                                </div>
                                <CardTitle className="text-green-700 group-hover:text-green-800 transition-colors">
                                    Fresh Produce
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Find the freshest, locally-grown fruits,
                                    vegetables, and artisan products directly
                                    from farmers.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                                    <span>Explore seasonal items</span>
                                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-green-100 hover:border-green-300 transition-all duration-500 animate-slide-up bg-gradient-to-br from-white to-green-50/30" style={{animationDelay: '0.3s'}}>
                            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-xl"></div>
                            <CardHeader className="pb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Truck className="text-white h-6 w-6" />
                                </div>
                                <CardTitle className="text-green-700 group-hover:text-green-800 transition-colors">
                                    Local Delivery
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Some markets offer local delivery or pickup
                                    options for added convenience.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                                    <span>Check delivery options</span>
                                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Product Showcase Section */}
                <div className="animate-fade-in">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-3 mb-6">
                            <ShoppingBag className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-semibold">Featured Products</span>
                        </div>
                        <h2 className="text-4xl font-bold text-green-800 mb-4">
                            Fresh From Our Farmers
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                            Browse our selection of seasonal, locally-grown
                            produce
                        </p>
                    </div>

                    <div className="card-modern bg-white rounded-3xl shadow-lg p-8 border border-green-100 hover:shadow-xl transition-all duration-500">
                        <ProductShowPage />
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-3xl p-10 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/20 rounded-full -translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full translate-x-48 translate-y-48"></div>
                    
                    <div className="text-center mb-12 relative z-10">
                        <div className="inline-flex items-center bg-white rounded-full px-6 py-3 mb-6 shadow-sm border border-green-100">
                            <Heart className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-semibold">Community Stories</span>
                        </div>
                        <h2 className="text-3xl font-bold text-green-800 mb-3">
                            From Our Community
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hear from farmers and customers who are part of our
                            growing community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div className="card-modern bg-white p-8 rounded-2xl shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-5">
                                    <Users className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        Farmer Spotlight
                                    </h3>
                                    <p className="text-sm text-green-600 font-medium">
                                        Organic Farming Practices
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic text-lg leading-relaxed">
                                "We've been farming organically for over 15
                                years. Connecting directly with customers
                                through farmers markets has transformed our
                                business and allowed us to share our passion for
                                sustainable agriculture."
                            </p>
                        </div>

                        <div className="card-modern bg-white p-8 rounded-2xl shadow-lg border border-green-100/50 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-5">
                                    <ShoppingBag className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        Customer Experience
                                    </h3>
                                    <p className="text-sm text-emerald-600 font-medium">
                                        Weekly Market Shopper
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic text-lg leading-relaxed">
                                "Shopping at my local farmers market has changed
                                how I cook and eat. The quality and freshness of
                                the produce is unmatched, and I love knowing
                                exactly where my food comes from."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Footer Banner */}
            <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-800/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 translate-y-32"></div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to discover fresh, local produce?
                        </h2>
                        <p className="mb-8 max-w-2xl mx-auto text-xl leading-relaxed opacity-90">
                            Find a farmers market near you and start enjoying the
                            benefits of farm-fresh food.
                        </p>
                        <Button 
                            size="xl" 
                            variant="secondary"
                            className="bg-white text-green-700 hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Find Markets Near Me
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
