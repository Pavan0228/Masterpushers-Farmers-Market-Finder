import React from "react";
import { useState } from "react";
import {
    UserIcon,
    ShoppingCart,
    Search,
    MapPin,
    ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const role = localStorage.getItem("userRole");

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
    };

    return (
        <nav className="bg-white p-4 flex justify-between items-center shadow-xl border border-gray-200 rounded-b-3xl top-0 left-0 w-full z-50 mb-8">
            <div className="flex items-center">
                <div className="relative mr-2">
                    <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 rounded-lg p-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Categories</option>
                        <option>Fruits</option>
                        <option>Vegetables</option>
                        <option>Grains</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
                <div className="relative">
                    <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 rounded-lg p-2 pl-8 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Change Location</option>
                        <option>Mumbai</option>
                        <option>Pune</option>
                        <option>Nashik</option>
                    </select>
                    <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
            </div>

            <form
                onSubmit={handleSearch}
                className="flex flex-grow mx-4 max-w-2xl"
            >
                <div className="relative flex w-full">
                    <input
                        type="text"
                        placeholder="Search for Product"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow p-3 pl-4 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-medium p-3 px-6 rounded-r-lg shadow-sm flex items-center"
                    >
                        <Search className="h-5 w-5 mr-1" />
                        <span>Search</span>
                    </button>
                </div>
            </form>

            <div className="flex items-center space-x-4">
                <a
                    href="/cart"
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>My Cart</span>
                </a>
                <Link
                    to={`/profile/${role}`}
                    className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                >
                    <UserIcon className="h-5 w-5 mr-2" />
                    <span>Profile</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
