import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  ShoppingBag,
  Navigation,
  ReceiptIndianRupeeIcon
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';
import { useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {toast,Toaster} from 'react-hot-toast';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  
  // Google Maps loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && locationInputRef.current && window.google) {
      try {
        // Remove any existing autocomplete
        if (locationInputRef.current.autocomplete) {
          google.maps.event.clearInstanceListeners(locationInputRef.current.autocomplete);
        }
        
        const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ["geocode"],
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        });
        
        locationInputRef.current.autocomplete = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setShowSuggestions(false);
          
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setLocationCoords({ lat, lng });
            setLocation(place.formatted_address);
          }
        });
      } catch (error) {
        console.error("Error initializing autocomplete:", error);
      }
    }
  }, [isLoaded]);

  // Handle location input change
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.trim() && isLoaded) {
      try {
        const service = new window.google.maps.places.AutocompleteService();
        const predictions = await new Promise((resolve, reject) => {
          service.getPlacePredictions(
            {
              input: value,
              types: ['geocode'],
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(predictions);
              } else {
                reject(status);
              }
            }
          );
        });
        setSuggestions(predictions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (placeId) => {
    if (isLoaded) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode(
            { placeId: placeId },
            (results, status) => {
              if (status === 'OK') {
                resolve(results[0]);
              } else {
                reject(status);
              }
            }
          );
        });

        const { lat, lng } = result.geometry.location;
        setLocationCoords({ 
          lat: lat(), 
          lng: lng() 
        });
        setLocation(result.formatted_address);
        setShowSuggestions(false);
      } catch (error) {
        console.error('Error getting place details:', error);
      }
    }
  };

  // Handle getting live location
  const handleGetLiveLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationCoords({ lat: latitude, lng: longitude });
          
          try {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              setLocation(address);
            } else {
              setLocationError("Could not find address for your location");
            }
          } catch (error) {
            console.error('Error getting address:', error);
            setLocationError("Could not convert your location to an address");
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Could not get your location.';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += ' Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += ' Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += ' The request to get location timed out.';
              break;
            default:
              errorMessage += ' Please check permissions.';
          }
          
          setLocationError(errorMessage);
          setIsGettingLocation(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
    }
  };

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '200px',
  };

  // Render map
  const renderMap = () => {
    if (loadError) {
      return <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
        <p className="text-red-500">Error loading maps</p>
      </div>;
    }
    
    if (!isLoaded) {
      return <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
        <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
      </div>;
    }
    
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={locationCoords || { lat: 20.5937, lng: 78.9629 }}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {locationCoords && <Marker position={locationCoords} />}
      </GoogleMap>
    );
  };

  // In a real app, you would get the product ID from the URL
  // For this demo, we'll use a fixed product ID
  const productId = 1;
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/product/${id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          
          // Get related products
          if (data.product.relatedProducts) {
            const related = data.product.relatedProducts.map(id => 
              data.product.relatedProducts.find(p => p.id === id)
            ).filter(Boolean);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        toast.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);
  
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
  
  const addToCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("User not logged in.");
      return;
    }


    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/wishlist/`,
        {
          productId: id, // Only send productId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token in the header
          },
        }
      );

      if (response.data.status =="success") {
        toast.success("Added to cart successfully!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding to cart.");
    }
  };
  
  const handleBackToProducts = () => {
    // In a real app, this would navigate back to products page
    window.location.href = '/product-show';
  };

  const handleOpenBuyPopup = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login to make a purchase");

      return;
    }
    else{
      setShowBuyPopup(true);
    }
    
  };

  const handleBuyProduct = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!location.trim()) {
      setError("Please enter delivery location");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login to make a purchase");
        return;
      }

      // Handle online payment first if selected
      if (paymentMethod === 'online') {
        try {
          // First create order in Razorpay
          const paymentResponse = await axios.post(
            `${API_BASE_URL}/api/v1/payment/`,
            {
              amount: parseInt(product.price * quantity)
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log('Payment Response:', paymentResponse.data); // Debug log

          if (paymentResponse.data.success) {
            const options = {
              key: paymentResponse.data.key_id, // Razorpay Key ID
              amount: paymentResponse.data.amount, // Amount in paisa
              currency: paymentResponse.data.currency,
              order_id: paymentResponse.data.id,
              name: "FarmFresh Market",
              description: `Payment for ${product.name}`,
              image: "your_logo_url", // Add your logo URL
              handler: function (response) {
                // This function will be called after successful payment
                console.log('Payment Success:', response);
                toast.success("Payment successful!");
                createOrder();
              },
              prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999"
              },
              notes: {
                address: "Customer Address"
              },
              theme: {
                color: "#16a34a"
              }
            };

            // Create a new instance of Razorpay
            const rzp1 = new window.Razorpay(options);

            rzp1.on('payment.failed', function (response) {
              console.error('Payment Failed:', response.error);
              toast.error("Payment failed: " + response.error.description);
            });

            // Open Razorpay payment window
            rzp1.open();
            
            // Don't set isLoading to false here as payment is in progress
            return;
          } else {
            throw new Error("Failed to create payment order");
          }
        } catch (paymentError) {
          console.error("Payment error:", paymentError);
          toast.error("Payment initialization failed. Please try again.");
          setError("Payment failed. Please try again.");
          setIsLoading(false);
          return;
        }
      } else {
        // For cash on delivery
        await createOrder();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while processing your order");
      toast.error("Order processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          totalAmount: product.price * quantity,
          quantity: quantity,
          paymentMethod: paymentMethod,
          location: location.trim()
        })
      });

      const data = await response.json();
      
      if (data.status === "success") {
        toast.success("Order placed successfully!");
        setShowBuyPopup(false);
        setLocation('');
      } else {
        throw new Error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to create order. Please try again.");
      setError(error.message || "Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Navigation bar */}
      <Toaster/>

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
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              
              {product.images && product.images.length > 1 && (
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
              {product.images && product.images.length > 1 && (
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
                <span className="text-3xl font-bold text-green-700">₹{product.price.toFixed(2)}</span>
                <span className="text-gray-500">per {product.unit}</span>
              </div>
              
              {/* Product Actions Section */}
              <div className="space-y-4 mt-6">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid gap-3">
                  <button 
                    onClick={handleOpenBuyPopup}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </button>

                  <button 
                    onClick={addToCart}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </button>

                  <div className="flex gap-3">
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

      {/* Buy Popup */}
      {showBuyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Confirm Order</h2>
              <button 
                onClick={() => setShowBuyPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={decrementQuantity}
                      className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                    >-</button>
                    <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                    >+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Price per {product.unit}:</span>
                  <span className="font-medium">₹{product.price.toFixed(2)}</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <label className="block text-gray-600 font-medium">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                  
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                        paymentMethod === 'cash'
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('online')}
                      className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                        paymentMethod === 'online'
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ReceiptIndianRupeeIcon className="h-5 w-5 mr-2" />
                      Online Payment
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <label className="block text-gray-600 font-medium">
                    Delivery Location
                  </label>
                  <div className="relative">
                    <div className="flex">
                      <div className="relative flex-grow">
                        <MapPin className="absolute left-4 top-4 text-gray-600 h-5 w-5" />
                        <input
                          type="text"
                          value={location}
                          onChange={handleLocationChange}
                          ref={locationInputRef}
                          placeholder="Enter delivery address"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyDown={(e) => { 
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          autoComplete="off"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLiveLocation}
                        disabled={isGettingLocation}
                        className="bg-gray-100 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200 transition-colors duration-200"
                      >
                        {isGettingLocation ? (
                          <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full" />
                        ) : (
                          <Navigation className="h-5 w-5 text-green-600" />
                        )}
                      </button>
                    </div>

                    {/* Suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            onClick={() => handleSelectSuggestion(suggestion.place_id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{suggestion.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {locationError && (
                    <p className="text-red-500 text-sm mt-1">
                      {locationError}
                    </p>
                  )}
                </div>

                {/* Map */}
                <div className="w-full rounded-lg overflow-hidden h-[200px]">
                  {renderMap()}
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-800">
                    ₹{(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowBuyPopup(false)}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuyProduct}
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial px-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors duration-200 disabled:bg-green-400"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;