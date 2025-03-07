import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Truck, Apple } from "lucide-react";
import ProductShowPage from "@/assets/Nikhil/ProductShowPage";

const HomePage = () => {
    const [location, setLocation] = useState("");

    const handleSearch = () => {
        console.log(`Searching for markets near ${location}`);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="container mx-auto max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-green-800 flex items-center justify-center gap-3 mb-4">
                        <Apple className="w-12 h-12" />
                        Local Farmers Market Finder
                    </h1>
                    <p className="text-green-600 text-xl">
                        Connect with local farmers and fresh, seasonal produce
                        in your area
                    </p>
                </header>

                {/* <GoogleTranslate /> */}

                <div className="flex justify-center mb-12">
                    <div className="w-full max-w-lg flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter your city or zip code"
                            className="flex-grow"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Button
                            onClick={handleSearch}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Search className="mr-2" /> Find Markets
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="mr-3 text-green-600" />
                                Local Markets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Discover farmers markets near you, with detailed
                                location and schedule information.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Apple className="mr-3 text-green-600" />
                                Fresh Produce
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Find the freshest, locally-grown fruits,
                                vegetables, and artisan products directly from
                                farmers.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Truck className="mr-3 text-green-600" />
                                Local Delivery
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Some markets offer local delivery or pickup
                                options for added convenience.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <ProductShowPage/>
            </div>
        </div>
    );
};

export default HomePage;
