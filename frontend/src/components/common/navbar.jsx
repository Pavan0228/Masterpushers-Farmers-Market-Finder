// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     UserIcon,
//     ShoppingCart,
//     Search,
//     MapPin,
//     ChevronDown,
//     LogOut,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const navigate = useNavigate();

//     const handleSearch = (e) => {
//         e.preventDefault();
//         // Implement search functionality
//     };

//     const handleProfileClick = () => {
//         const userRole = localStorage.getItem("userRole");
//         const token = localStorage.getItem("token");

//         if (!token || !userRole) {
//             navigate("/login");
//             return;
//         }

//         switch (userRole) {
//             case "courier":
//                 navigate("/profile/courier");
//                 break;
//             case "farmer":
//                 navigate("/profile/farmer");
//                 break;
//             case "customer":
//                 navigate("/profile/customer");
//                 break;
//             default:
//                 navigate("/login");
//         }
//     };

//     return (
//         <nav className="bg-white p-4 flex justify-between items-center shadow-xl border border-gray-200 rounded-b-3xl top-0 left-0 w-full z-50 mb-8">
//             <div className="flex items-center">
//                 <div className="relative mr-2">
//                     <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 rounded-lg p-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
//                         <option>Categories</option>
//                         <option>Fruits</option>
//                         <option>Vegetables</option>
//                         <option>Grains</option>
//                     </select>
//                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
//                 </div>
//                 <div className="relative">
//                     <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 rounded-lg p-2 pl-8 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
//                         <option>Change Location</option>
//                         <option>Mumbai</option>
//                         <option>Pune</option>
//                         <option>Nashik</option>
//                     </select>
//                     <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
//                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
//                 </div>
//             </div>

//             <form
//                 onSubmit={handleSearch}
//                 className="flex flex-grow mx-4 max-w-2xl"
//             >
//                 <div className="relative flex w-full">
//                     <input
//                         type="text"
//                         placeholder="Search for Product"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="flex-grow p-3 pl-4 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                     <button
//                         type="submit"
//                         className="bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-medium p-3 px-6 rounded-r-lg shadow-sm flex items-center"
//                     >
//                         <Search className="h-5 w-5 mr-1" />
//                         <span>Search</span>
//                     </button>
//                 </div>
//             </form>

//             <div className="flex items-center space-x-4">
//                 <a
//                     href="/cart"
//                     className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
//                 >
//                     <ShoppingCart className="h-5 w-5 mr-2" />
//                     <span>My Cart</span>
//                 </a>
//                 <button
//                     onClick={handleProfileClick}
//                     className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
//                 >
//                     <UserIcon className="h-5 w-5 mr-2" />
//                     <span>Profile</span>
//                 </button>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    UserIcon,
    ShoppingCart,
    Search,
    MapPin,
    ChevronDown,
    LogOut,
    Menu,
    X,
    Info,
    Download,
    Globe,
    Sun,
    Moon
} from "lucide-react";

// Import the Google Translate component
import GoogleTranslate from "../../snippets/GoogleTranslate";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Check for token and user role on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

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

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchTerm}`);
    };

    const handleProfileClick = () => {
        navigate("/profile/customer");
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/allregister");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // Implement dark mode functionality here
    };

    const isCustomer = userRole === "customer";

    return (
        <div className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled
                ? "bg-white shadow-md py-2"
                : "bg-gradient-to-r from-green-50 to-green-100 py-4 shadow-lg border-b border-green-200"
        }`}>
            <div className="container mx-auto flex flex-col px-4">
                {/* Top section with logo and auth */}
                <div className="flex justify-between items-center mb-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className={`${
                            scrolled ? "bg-green-600" : "bg-green-500"
                        } p-2 rounded-full shadow-md transition-colors duration-300 transform hover:rotate-3`}>
                            <img
                                src="/path/to/logo.png"
                                alt="AgroLynk"
                                className="h-8 w-8"
                            />
                        </div>
                        <h1 className="text-2xl font-bold ml-3">
                            <span className={`${
                                scrolled ? "text-green-700" : "text-green-600"
                            } transition-colors duration-300`}>
                                Agro
                            </span>
                            <span className={`${
                                scrolled ? "text-green-900" : "text-green-800"
                            } transition-colors duration-300`}>
                                Lynk
                            </span>
                        </h1>
                    </div>

                    {/* Desktop Auth and Language */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="pl-4 border-l border-green-300 flex items-center">
                            <Globe size={16} className="mr-2 text-green-600" />
                            <GoogleTranslate />
                        </div>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="bg-white hover:bg-green-50 text-green-600 font-medium py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg border-2 border-green-600"
                                >
                                    Register
                                </button>
                            </>
                        )}
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

                {/* Customer-only features - Main navbar content */}
                {isCustomer && (
                    <nav className="bg-white p-4 flex flex-wrap justify-between items-center shadow-xl border border-gray-200 rounded-3xl w-full z-50 mb-4">
                        <div className="flex items-center flex-wrap md:flex-nowrap">
                            <div className="relative mr-2 mb-2 md:mb-0">
                                <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 rounded-lg p-2 pl-4 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option>Categories</option>
                                    <option>Fruits</option>
                                    <option>Vegetables</option>
                                    <option>Grains</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            </div>
                            <div className="relative mb-2 md:mb-0">
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
                            className="flex flex-grow mx-0 md:mx-4 max-w-2xl w-full my-2 md:my-0"
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

                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                            <button
                                onClick={handleCartClick}
                                className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                <span>My Cart</span>
                            </button>
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                            >
                                <UserIcon className="h-5 w-5 mr-2" />
                                <span>Profile</span>
                            </button>
                        </div>
                    </nav>
                )}

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 bg-white rounded-lg shadow-xl p-4 absolute right-4 left-4 z-10 border border-green-200 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                            <a
                                href="/about"
                                className="flex items-center text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            >
                                <Info size={18} className="mr-2" />
                                Why AgroLynk?
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
                            
                            {/* Show customer-specific options in mobile menu if user is a customer */}
                            {isCustomer && (
                                <>
                                    <button
                                        onClick={handleCartClick}
                                        className="flex items-center text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    >
                                        <ShoppingCart size={18} className="mr-2" />
                                        My Cart
                                    </button>
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    >
                                        <UserIcon size={18} className="mr-2" />
                                        Profile
                                    </button>
                                </>
                            )}
                            
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md w-full transition-colors duration-200 flex items-center justify-center"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLogin}
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md w-full transition-colors duration-200"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className="bg-white hover:bg-green-50 text-green-600 font-medium py-3 px-4 rounded-lg shadow-md w-full transition-colors duration-200 border-2 border-green-600"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;