import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Truck, Apple } from "lucide-react";
import ProductShowPage from "@/assets/Nikhil/ProductShowPage";
import MarketMap from "@/components/MarketMap";
import { API_BASE_URL } from "../../config";
import { useState } from "react";

const HeroSection = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);


    const handleSearch = async () => {
        console.log(`Searching for markets near ${location}`);
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/ampc?location=${location}`);
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
    <div className="relative bg-green-700 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/api/placeholder/1200/600"
          alt="Farmers market with fresh produce"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Fresh From The Farm To Your Table
          </h1>
          <p className="text-lg md:text-xl mb-8 text-green-50">
            Discover local farmers markets in your area, connect with producers, and enjoy 
            fresh, seasonal produce that supports your community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder="Enter your location" 
                className="pl-10 py-6 bg-white/90 text-black border-green-400 focus-visible:ring-green-500"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
            </div>
            <Button onClick={handleSearch} className="bg-green-500 hover:bg-green-600 py-6 px-8 text-white">
              Find Markets
            </Button>
          </div>
          
                   {/* Display suggestions above the local markets section */}
            <div className="mt-8">
                {suggestions.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">Market Suggestions</h2>
                        <ul className="space-y-4">
                            {suggestions.map((ampc, index) => (
                                <li key={index} className="p-4 bg-white shadow rounded-lg">
                                    <h3 className="text-xl font-semibold">{ampc.ApmcFullCode}</h3>
                                    <p>{ampc.AddressE || ampc.AddressM}</p>
                                    <p>Phone: {ampc.Phone}</p>
                                    <p>Pin Code: {ampc.PinCode}</p>
                                    {ampc.MarketList.length > 0 && (
                                        <MarketMap
                                            addressE={ampc.AddressE}
                                            addressM={ampc.AddressM}
                                            marketName={ampc.MarketList[0].MainMarketNameE || ampc.MarketList[0].MainMarketNameM}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
      </div>
      
      {/* Wave SVG divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-white h-16 w-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;