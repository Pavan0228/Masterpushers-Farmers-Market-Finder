import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ShoppingBag,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { toast, Toaster } from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/v1/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setCartItems(data.wishlist || []); // Adjust based on your API response structure
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
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.productId.price * item.quantity), 0
  );

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
      const response = await fetch(`${API_BASE_URL}/api/v1/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
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
  const handleCheckout = () => {
    window.location.href = '/checkout';
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
                          src={item.productId.image} 
                          alt={item.productId.name}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.productId.name}
                            </h3>
                            <p className="text-lg font-medium text-gray-900">
                              ₹{(item.productId.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.productId.category}</p>
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
                              onClick={() => removeItem(item._id)}
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-gray-900">₹40.00</span>
                  </div>
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
                  onClick={handleCheckout}
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