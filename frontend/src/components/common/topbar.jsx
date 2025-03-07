import React from "react";
import { useState, useEffect } from "react";
import GoogleTranslate from "../../snippets/GoogleTranslate";
import {
    Menu,
    X,
    ChevronDown,
    Download,
    Info,
    Globe,
    Sun,
    Moon,
} from "lucide-react";

const TopBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    
    return (
        <div
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white shadow-md py-2"
                    : "bg-gradient-to-r from-green-50 to-green-100 py-4 shadow-lg border-b border-green-200"
            }`}
        >
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo and Brand */}
                <div className="flex items-center">
                    <div
                        className={`${
                            scrolled ? "bg-green-600" : "bg-green-500"
                        } p-2 rounded-full shadow-md transition-colors duration-300 transform hover:rotate-3`}
                    >
                        <img
                            src="/path/to/logo.png"
                            alt="KisanKonnect"
                            className="h-8 w-8"
                        />
                    </div>
                    <h1 className="text-2xl font-bold ml-3">
                        <span
                            className={`${
                                scrolled ? "text-green-700" : "text-green-600"
                            } transition-colors duration-300`}
                        >
                            Agro
                        </span>
                        <span
                            className={`${
                                scrolled ? "text-green-900" : "text-green-800"
                            } transition-colors duration-300`}
                        >
                            Lynk
                        </span>
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <a
                        href="/about"
                        className="flex items-center text-green-700 hover:text-green-900 font-medium transition-colors duration-200 relative group"
                    >
                        {/* <Info size={18} className="mr-1" />
                        Why KisanKonnect?
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span> */}
                    </a>
                    {/* <a
                        href="/download"
                        className="flex items-center text-green-700 hover:text-green-900 font-medium transition-colors duration-200 relative group"
                    >
                        <Download size={18} className="mr-1" />
                        Download App
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                    </a> */}
                    <div className="pl-4 border-l border-green-300 flex items-center">
                        <Globe size={16} className="mr-2 text-green-600" />
                        <GoogleTranslate />
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                        Login
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                        Get Started
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`${
                            scrolled ? "text-green-700" : "text-green-600"
                        } p-2 transition-colors duration-300 hover:bg-green-50 rounded-full`}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 bg-white rounded-lg shadow-xl p-4 absolute right-4 left-4 z-10 border border-green-200 animate-fadeIn">
                    <div className="flex flex-col space-y-4">
                        <a
                            href="/about"
                            className="flex items-center text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                            <Info size={18} className="mr-2" />
                            Why KisanKonnect?
                        </a>
                        <a
                            href="/download"
                            className="flex items-center text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                            <Download size={18} className="mr-2" />
                            Download App
                        </a>
                        <div className="p-2 flex items-center border-t border-b border-green-100 py-3">
                            <Globe size={16} className="mr-2 text-green-600" />
                            <GoogleTranslate />
                        </div>
                        <div className="flex items-center justify-between p-2">
                            <span className="text-green-700 font-medium">
                                Dark Mode
                            </span>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-green-700 hover:text-green-900 transition-colors duration-200 bg-green-50 rounded-full hover:bg-green-100"
                            >
                                {isDarkMode ? (
                                    <Sun size={18} />
                                ) : (
                                    <Moon size={18} />
                                )}
                            </button>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md w-full transition-colors duration-200">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopBar;
