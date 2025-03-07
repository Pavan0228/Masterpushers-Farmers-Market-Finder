import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Building, 
  DollarSign, 
  Heart, 
  Share2, 
  MessageCircle, 
  ShoppingCart, 
  Tag, 
  Clock, 
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowLeft
} from 'lucide-react';

// Static product data - in a real app, you would fetch this based on product ID
const productsData = [
  {
    id: 1,
    name: 'Organic Fresh Tomatoes',
    description: 'Hand-picked organic tomatoes grown without pesticides. Perfect for salads and cooking. Our tomatoes are grown with care using sustainable farming practices, ensuring you get the best flavor and nutrition. These vibrant red tomatoes are harvested at peak ripeness to deliver maximum taste and freshness.',
    price: 3.99,
    unit: 'lb',
    rating: 4.7,
    reviews: 24,
    seller: 'Green Valley Farms',
    sellerBio: 'Family-owned farm operating since 1985, specializing in organic vegetables using sustainable farming practices.',
    location: 'Springfield, CA',
    market: 'Downtown Farmers Market',
    marketHours: 'Sat-Sun: 8am-2pm',
    harvestDate: '2025-03-03',
    availableUntil: '2025-03-10',
    phone: '555-123-4567',
    category: 'Vegetables',
    organic: true,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    relatedProducts: [2, 4, 6]
  },
  {
    id: 2,
    name: 'Fresh Farm Eggs',
    description: 'Free-range eggs from pasture-raised hens. Rich in flavor and nutrition. Our hens have access to open pastures where they can roam freely, resulting in eggs with deeper colored yolks and better taste. Each egg is carefully inspected for quality.',
    price: 5.99,
    unit: 'dozen',
    rating: 4.9,
    reviews: 32,
    seller: 'Sunshine Poultry',
    sellerBio: 'Small family poultry farm focusing on humane animal husbandry and sustainable practices.',
    location: 'Riverside, CA',
    market: 'Weekend Organic Market',
    marketHours: 'Sat: 9am-3pm',
    harvestDate: '2025-03-05',
    availableUntil: '2025-03-15',
    phone: '555-987-6543',
    category: 'Dairy & Eggs',
    organic: true,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    relatedProducts: [3, 5, 1]
  },
  {
    id: 3,
    name: 'Organic Honey',
    description: 'Pure, unfiltered honey from local wildflower meadows. Perfect natural sweetener. Our bees forage in pristine meadows filled with a diversity of wildflowers, creating honey with complex flavors and aromas. Each jar contains raw, unprocessed honey with all its natural enzymes intact.',
    price: 8.50,
    unit: 'jar',
    rating: 4.8,
    reviews: 18,
    seller: 'Buzz Bee Apiary',
    sellerBio: 'Dedicated to sustainable beekeeping and producing high-quality honey products while supporting bee conservation.',
    location: 'Meadowville, CA',
    market: 'Artisan Market',
    marketHours: 'Fri-Sun: 10am-4pm',
    harvestDate: '2025-02-15',
    availableUntil: '2025-06-15',
    phone: '555-222-3333',
    category: 'Honey & Preserves',
    organic: true,
    images: ['/api/placeholder/600/400'],
    relatedProducts: [5, 2, 4]
  },
  {
    id: 4,
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked at peak ripeness. Perfect for desserts or eating fresh. Our strawberries are grown using sustainable methods and harvested only when fully ripe, ensuring maximum sweetness and flavor.',
    price: 4.99,
    unit: 'lb',
    rating: 4.6,
    reviews: 41,
    seller: 'Berry Good Farms',
    sellerBio: 'Specialized in growing premium berries using minimal intervention growing techniques.',
    location: 'Fruitland, CA',
    market: 'Downtown Farmers Market',
    marketHours: 'Sat-Sun: 8am-2pm',
    harvestDate: '2025-03-04',
    availableUntil: '2025-03-09',
    phone: '555-444-5555',
    category: 'Fruits',
    organic: true,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    relatedProducts: [1, 3, 6]
  },
  {
    id: 5,
    name: 'Sourdough Bread',
    description: 'Artisanal sourdough bread made with organic flour and traditional fermentation methods. Our bread features a complex flavor profile with a perfect balance of sourness and a crisp, crackling crust. Each loaf is hand-shaped and baked in a stone hearth oven.',
    price: 6.75,
    unit: 'loaf',
    rating: 4.9,
    reviews: 56,
    seller: 'Hearth & Home Bakery',
    sellerBio: 'Artisan bakery specializing in traditional sourdough breads and pastries made with local ingredients.',
    location: 'Bakersfield, CA',
    market: 'Weekend Organic Market',
    marketHours: 'Sat: 9am-3pm',
    harvestDate: '2025-03-07',
    availableUntil: '2025-03-08',
    phone: '555-777-8888',
    category: 'Bakery',
    organic: true,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    relatedProducts: [3, 2, 1]
  },
  {
    id: 6,
    name: 'Fresh Spinach',
    description: 'Tender, nutrient-rich spinach leaves. Great for salads, smoothies, or cooking. Our spinach is grown in mineral-rich soil, resulting in exceptionally nutritious and flavorful leaves. Each bunch is harvested by hand in the early morning to ensure maximum freshness and crispness.',
    price: 3.25,
    unit: 'bunch',
    rating: 4.7,
    reviews: 29,
    seller: 'Green Leaf Gardens',
    sellerBio: 'Urban farm focused on growing nutrient-dense leafy greens using regenerative agriculture methods.',
    location: 'Riverdale, CA',
    market: 'Local Produce Market',
    marketHours: 'Wed, Sat: 8am-1pm',
    harvestDate: '2025-03-06',
    availableUntil: '2025-03-11',
    phone: '555-666-7777',
    category: 'Vegetables',
    organic: true,
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    relatedProducts: [1, 4, 2]
  }
];

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // In a real app, you would get the product ID from the URL
  // For this demo, we'll use a fixed product ID
  const productId = 1;
  
  useEffect(() => {
    // Simulate fetching product by ID
    const foundProduct = productsData.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Get related products
      if (foundProduct.relatedProducts) {
        const related = foundProduct.relatedProducts.map(id => 
          productsData.find(p => p.id === id)
        ).filter(Boolean);
        setRelatedProducts(related);
      }
    }
  }, [productId]);
  
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };
  
  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };
  
  const addToCart = () => {
    console.log(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
    // In a real app, this would call a function to add the product to cart
  };
  
  const handleBackToProducts = () => {
    // In a real app, this would navigate back to products page
    window.location.href = '/products';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Navigation bar */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">FarmFresh Market</div>
          <div className="bg-green-600 text-white py-2 px-4 rounded-md font-medium">Sign In</div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Back button */}
        <button 
          onClick={handleBackToProducts}
          className="flex items-center text-green-700 hover:text-green-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Products
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Images Section */}
            <div className="relative">
              <img 
                src={product.images[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition-colors duration-200"
                  >
                    <ChevronLeft className="h-6 w-6 text-green-700" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white transition-colors duration-200"
                  >
                    <ChevronRight className="h-6 w-6 text-green-700" />
                  </button>
                </>
              )}
              
              {/* Image gallery thumbnails */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? 'bg-green-600' : 'bg-white/70'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Category tag */}
              <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                {product.category}
              </div>
              
              {/* Organic tag */}
              {product.organic && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  Organic
                </div>
              )}
            </div>
            
            {/* Product Details Section */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="h-5 w-5 fill-amber-500" />
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-500 mx-2">|</span>
                <span className="text-gray-500">{product.reviews} reviews</span>
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-3xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                <span className="text-gray-500">per {product.unit}</span>
              </div>
              
              {/* Quantity selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-l-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl font-bold text-gray-700">-</span>
                  </button>
                  <div className="w-16 h-10 bg-white border-t border-b border-gray-200 flex items-center justify-center">
                    <span className="text-gray-800 font-medium">{quantity}</span>
                  </div>
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-r-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <span className="text-xl font-bold text-gray-700">+</span>
                  </button>
                  <span className="ml-4 text-gray-500">{product.unit}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={addToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={toggleWishlist}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors duration-200 ${
                      isInWishlist 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                    {isInWishlist ? 'Saved' : 'Save'}
                  </button>
                  
                  <button 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
              
              {/* Seller and Market Information */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-lg text-green-800 mb-3">Sold by</h3>
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <div className="font-medium text-green-800 mb-1">{product.seller}</div>
                  <p className="text-sm text-gray-600 mb-3">{product.sellerBio}</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-green-600 mr-2" />
                      <span>{product.phone}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg text-green-800 mb-3">Available at</h3>
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <div className="font-medium text-green-800 mb-1">{product.market}</div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-600 mr-2" />
                      <span>{product.marketHours}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span>Available until: {new Date(product.availableUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProducts.map(relProduct => (
                <div key={relProduct.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative">
                    <img 
                      src={relProduct.images[0]} 
                      alt={relProduct.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {relProduct.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-green-800">{relProduct.name}</h3>
                    <div className="flex items-center my-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="ml-1 text-sm font-medium text-gray-600">{relProduct.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({relProduct.reviews})</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                      <div className="font-bold text-green-700">${relProduct.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">per {relProduct.unit}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Customer Reviews Section - Added as a placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-4">Customer Reviews</h2>
          
          <div className="flex items-center mb-6">
            <div className="text-3xl font-bold text-green-700 mr-2">{product.rating}</div>
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-gray-500">Based on {product.reviews} reviews</div>
          </div>
          
          {/* Sample reviews - these would be fetched in a real app */}
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 5 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="font-medium">Great quality!</div>
              </div>
              <p className="text-gray-600 mb-2">
                These tomatoes are incredible. So much flavor and they stay fresh for days.
              </p>
              <div className="text-sm text-gray-500">Sarah K. - March 5, 2025</div>
            </div>
            
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="font-medium">Very good tomatoes</div>
              </div>
              <p className="text-gray-600 mb-2">
                I appreciate the sustainable farming practices. The tomatoes had great texture and flavor.
              </p>
              <div className="text-sm text-gray-500">Michael T. - March 2, 2025</div>
            </div>
            
            <button className="text-green-700 font-medium hover:text-green-800">
              Read all {product.reviews} reviews
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-green-800 mb-3">FarmFresh Market</h3>
              <p className="text-gray-600 text-sm">
                Connecting local farmers with consumers since 2020. Supporting sustainable agriculture and healthy communities.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-green-800 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-green-700">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Our Markets</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Become a Seller</a></li>
                <li><a href="#" className="text-gray-600 hover:text-green-700">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-green-800 mb-3">Subscribe</h3>
              <p className="text-gray-600 text-sm mb-3">
                Get updates on new products and upcoming market events.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 p-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-600"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 text-center">
            © 2025 FarmFresh Market. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProductDetailPage;