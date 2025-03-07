import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Shield,
  MapPin,
  Navigation,
  ReceiptIndianRupeeIcon,
} from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useLoadScript } from '@react-google-maps/api';

import { GoogleMap, Marker } from '@react-google-maps/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  const [error, setError] = useState(null);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [locationError, setLocationError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const locationInputRef = useRef(null);
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

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/v1/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === "success") {
          setCartItems(response.data.wishlist || []); // Adjust based on your API response structure
        } else {
          setError('Failed to fetch cart items');
        }
      } catch (error) {
        setError('Error fetching cart items');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || 0; // Default to 0 if price is undefined
    const quantity = item.quantity || 0; // Default to 0 if quantity is undefined
    return sum + (typeof price === 'number' && typeof quantity === 'number' ? price * quantity : 0);
  }, 0);

  const handleBuyProduct = async () => {
    setIsLoading(true);
    setLocationError(null);
    
    if (!location.trim()) {
      setLocationError("Please enter delivery location");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLocationError("Please login to make a purchase");
        return;
      }

      console.log("Subtotal for payment:", subtotal); // Debugging line

      // Handle online payment first if selected
      if (paymentMethod === 'online') {
        try {
          // First create order in Razorpay
          const paymentResponse = await axios.post(
            `${API_BASE_URL}/api/v1/payment/`,
            {
              amount: (Math.round(selectedProduct.price.toFixed(2)*quantity * 100)) // Convert to smallest currency unit
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (paymentResponse.data.success) {
            const options = {
              key: paymentResponse.data.key_id, // Razorpay Key ID
              amount: paymentResponse.data.amount, // Amount in paisa
              currency: paymentResponse.data.currency,
              order_id: paymentResponse.data.id,
              name: "FarmFresh Market",
              description: `Payment for your cart items`,
              image: "your_logo_url", // Add your logo URL
              handler: function (response) {
                // This function will be called after successful payment
                createOrder(response);
              },
              prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999"
              },
              notes: {
                address: location.trim()
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
            return;
          } else {
            throw new Error("Failed to create payment order");
          }
        } catch (paymentError) {
          console.error("Payment error:", paymentError);
          toast.error("Payment initialization failed. Please try again.");
          setLocationError("Payment failed. Please try again.");
          setIsLoading(false);
          return;
        }
      } else {
        // For cash on delivery
        await createOrder();
      }
    } catch (error) {
      console.error("Error:", error);
      setLocationError("An error occurred while processing your order");
      toast.error("Order processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (paymentResponse) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          address: location.trim(),
          paymentMethod: paymentMethod,
          totalAmount: subtotal + 40,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      console.log('Order created successfully:', data);
      toast.success('Order placed successfully!');
      setShowBuyPopup(false);
      setLocation('');
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order: ' + error.message);
      setLocationError(error.message || "Failed to create order");
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/wishlist/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      const data = await response.json();
      if (data.success) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error(error);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      console.log("token", token)
      const response = await axios.delete(`${API_BASE_URL}/api/v1/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          productid: itemId
        }
      });
      
    //   const data = await response.json();
      if (response.data.status == "success") {
        setCartItems(prevItems => 
          prevItems.filter(item => item._id !== itemId)
        );
        toast.success('Item removed from cart');
      }
    } catch (error) {
      toast.error('Failed to remove item');
      console.error(error);
    }
  };

  // Proceed to checkout
  const handleCheckout = (product) => {
    setSelectedProduct(product);
    setShowBuyPopup(true);
  };

  

  const handleSelectSuggestion = (placeId) => {
    // Logic to handle suggestion selection
  };

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
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={locationCoords || { lat: 20.5937, lng: 78.9629 }} // Default center
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
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
                  <span className="font-medium">{selectedProduct.name}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                    >-</button>
                    <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                    >+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Price per item:</span>
                  <span className="font-medium">₹{selectedProduct.price.toFixed(2)}</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <label className="block text-gray-600 font-medium">Payment Method</label>
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
                      Online Payment
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <label className="block text-gray-600 font-medium">Delivery Location</label>
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

                    {locationError && (
                      <p className="text-red-500 text-sm mt-1">{locationError}</p>
                    )}
                  </div>
                </div>

                {/* Render the map */}
                <div className="w-full rounded-lg overflow-hidden h-[200px]">
                  {renderMap()}
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-800">
                      ₹{(selectedProduct.price * quantity).toFixed(2)}
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
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-4">Add some products to your cart to continue shopping</p>
            <a 
              href="/product-show" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item._id} className="p-6">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              ₹{(item.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                className="p-2 hover:bg-gray-100"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 border-x">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                removeItem(item._id);
                                handleCheckout(item);
                              }}
                              className="text-red-500 hover:text-red-600 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900">₹40.00</span>
                  </div> */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">
                        ₹{(subtotal + 40).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout(cartItems[0])}
                  className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                <div className="mt-6 flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by trusted payment partners
                  </p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery Information</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </span>
                    Free delivery for orders above ₹500
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </span>
                    Delivery within 24-48 hours
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </span>
                    Fresh products guaranteed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 