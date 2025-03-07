import React, { useState } from "react";
import {
    MapPin,
    Building,
    Star,
    Filter,
    Search,
    ChevronDown,
    Tag,
} from "lucide-react";

// Static product data
const productsData = [
    {
        id: 1,
        name: "Organic Fresh Tomatoes",
        description:
            "Hand-picked organic tomatoes grown without pesticides. Perfect for salads and cooking.",
        price: 3.99,
        unit: "lb",
        rating: 4.7,
        reviews: 24,
        seller: "Green Valley Farms",
        location: "Springfield, CA",
        market: "Downtown Farmers Market",
        category: "Vegetables",
        image: "/api/placeholder/400/300",
    },
    {
        id: 2,
        name: "Fresh Farm Eggs",
        description:
            "Free-range eggs from pasture-raised hens. Rich in flavor and nutrition.",
        price: 5.99,
        unit: "dozen",
        rating: 4.9,
        reviews: 32,
        seller: "Sunshine Poultry",
        location: "Riverside, CA",
        market: "Weekend Organic Market",
        category: "Dairy & Eggs",
        image: "/api/placeholder/400/300",
    },
    {
        id: 3,
        name: "Organic Honey",
        description:
            "Pure, unfiltered honey from local wildflower meadows. Perfect natural sweetener.",
        price: 8.5,
        unit: "jar",
        rating: 4.8,
        reviews: 18,
        seller: "Buzz Bee Apiary",
        location: "Meadowville, CA",
        market: "Artisan Market",
        category: "Honey & Preserves",
        image: "/api/placeholder/400/300",
    },
    {
        id: 4,
        name: "Fresh Strawberries",
        description:
            "Sweet, juicy strawberries picked at peak ripeness. Perfect for desserts or eating fresh.",
        price: 4.5,
        unit: "pint",
        rating: 4.6,
        reviews: 41,
        seller: "Berry Good Farms",
        location: "Fruitland, CA",
        market: "Downtown Farmers Market",
        category: "Fruits",
        image: "/api/placeholder/400/300",
    },
    {
        id: 5,
        name: "Sourdough Bread",
        description:
            "Artisanal sourdough bread made with organic flour and traditional fermentation methods.",
        price: 6.75,
        unit: "loaf",
        rating: 4.9,
        reviews: 56,
        seller: "Hearth & Home Bakery",
        location: "Bakersfield, CA",
        market: "Weekend Organic Market",
        category: "Bakery",
        image: "/api/placeholder/400/300",
    },
    {
        id: 6,
        name: "Fresh Spinach",
        description:
            "Tender, nutrient-rich spinach leaves. Great for salads, smoothies, or cooking.",
        price: 3.25,
        unit: "bunch",
        rating: 4.7,
        reviews: 29,
        seller: "Green Leaf Gardens",
        location: "Riverdale, CA",
        market: "Local Produce Market",
        category: "Vegetables",
        image: "/api/placeholder/400/300",
    },
];

const ProductShowPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [marketFilter, setMarketFilter] = useState("All");

    // Get unique categories and markets for filter dropdowns
    const categories = [
        "All",
        ...new Set(productsData.map((product) => product.category)),
    ];
    const markets = [
        "All",
        ...new Set(productsData.map((product) => product.market)),
    ];

    // Filter products based on search term and filters
    const filteredProducts = productsData.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "All" || product.category === categoryFilter;
        const matchesMarket =
            marketFilter === "All" || product.market === marketFilter;

        return matchesSearch && matchesCategory && matchesMarket;
    });

    const handleProductClick = (productId) => {
        // In a real app, this would navigate to the product detail page
        // For this demo, we'll just log the product ID
        console.log(`Navigating to product: ${productId}`);
        window.location.href = `/product/${productId}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            {/* Navigation bar */}
            {/* <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">FarmFresh Market</div>
          <div className="bg-green-600 text-white py-2 px-4 rounded-md font-medium">Sign In</div>
        </div>
      </nav> */}

            {/* Main content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                        Fresh Local Products
                    </h1>
                    <p className="text-gray-600">
                        Discover fresh products from local farmers in your area
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search input */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-green-500"
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                >
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Market filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Market
                            </label>
                            <div className="relative">
                                <select
                                    className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-green-500"
                                    value={marketFilter}
                                    onChange={(e) =>
                                        setMarketFilter(e.target.value)
                                    }
                                >
                                    {markets.map((market, index) => (
                                        <option key={index} value={market}>
                                            {market}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Filter button */}
                        <button className="bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-green-200 transition duration-200">
                            <Filter className="h-5 w-5 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="relative h-48">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-4">
                                <h2 className="text-xl font-bold text-green-800 mb-2">
                                    {product.name}
                                </h2>

                                <div className="flex items-center text-amber-500 mb-2">
                                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                                    <span className="font-medium">
                                        {product.rating}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({product.reviews} reviews)
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-baseline">
                                    <div className="text-xl font-bold text-green-700">
                                        ${product.price.toFixed(2)}
                                        <span className="text-sm text-gray-500 font-normal">
                                            /{product.unit}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{product.location}</span>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-sm text-gray-500">
                                    <Building className="h-4 w-4 mr-1" />
                                    <span>{product.seller}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filters to find what
                            you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductShowPage;
