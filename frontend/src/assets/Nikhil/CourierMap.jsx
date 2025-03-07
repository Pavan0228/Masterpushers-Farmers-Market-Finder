import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLoadScript, GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

// Define libraries needed for Google Maps
const libraries = ["places", "geometry"];

const CourierMap = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [pickupCoordinates, setPickupCoordinates] = useState(null);
    const [routeToPickup, setRouteToPickup] = useState(null);
    const [routeToDestination, setRouteToDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geocoder, setGeocoder] = useState(null);
    const [courierAddress, setCourierAddress] = useState("");

    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Initialize geocoder when maps are loaded
    useEffect(() => {
        if (isLoaded) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [isLoaded]);

    // Get courier's current location
    useEffect(() => {
        if (navigator.geolocation && isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const currentLatLng = new window.google.maps.LatLng(lat, lng);
                    setCurrentLocation(currentLatLng);

                    if (geocoder) {
                        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                setCourierAddress(results[0].formatted_address);
                            } else {
                                console.error("Geocoder failed due to: " + status);
                            }
                        });
                    }
                    
                    // After getting location, fetch orders and pickup location
                    fetchOrdersAndPickupLocation();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Could not get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        }
    }, [isLoaded, geocoder]);

    // Fetch orders and pickup location
    const fetchOrdersAndPickupLocation = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/v1/order', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data) {
                // Set pickup location
                if (response.data.pickupLocation) {
                    setPickupLocation(response.data.pickupLocation);
                    
                    // Geocode pickup location to get coordinates
                    if (geocoder) {
                        try {
                            const results = await new Promise((resolve, reject) => {
                                geocoder.geocode({ address: response.data.pickupLocation }, (results, status) => {
                                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                        resolve(results);
                                    } else {
                                        reject(status);
                                    }
                                });
                            });
                            
                            const location = results[0].geometry.location;
                            const coordinates = {
                                lat: location.lat(),
                                lng: location.lng()
                            };
                            setPickupCoordinates(coordinates);
                            
                            // Calculate route to pickup location using backend API
                            calculateRouteToPickup(coordinates);
                        } catch (error) {
                            console.error("Error geocoding pickup location:", error);
                        }
                    }
                }
                
                // Process orders to get coordinates for each address
                if (response.data.orders) {
                    const ordersWithCoordinates = await Promise.all(
                        response.data.orders
                            .filter(order => order.isAvailable)
                            .map(async (order) => {
                                if (order.location && geocoder) {
                                    try {
                                        // Convert address string to coordinates
                                        const results = await new Promise((resolve, reject) => {
                                            geocoder.geocode({ address: order.location }, (results, status) => {
                                                if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                                    resolve(results);
                                                } else {
                                                    reject(status);
                                                }
                                            });
                                        });
                                        
                                        // Add coordinates to the order object
                                        const location = results[0].geometry.location;
                                        return {
                                            ...order,
                                            coordinates: {
                                                lat: location.lat(),
                                                lng: location.lng()
                                            }
                                        };
                                    } catch (error) {
                                        console.error(`Error geocoding address for order ${order._id}:`, error);
                                        return order; // Return order without coordinates
                                    }
                                }
                                return order;
                            })
                    );
                    
                    // Filter out orders without coordinates
                    const validOrders = ordersWithCoordinates.filter(order => order.coordinates);
                    setAvailableOrders(validOrders);
                }
            }
        } catch (error) {
            console.error("Error fetching orders and pickup location:", error);
            toast.error("Failed to fetch orders and pickup location");
        } finally {
            setLoading(false);
        }
    };

    // Calculate route from courier to pickup location using backend API
    const calculateRouteToPickup = async (pickupCoords) => {
        if (!currentLocation || !pickupCoords || !courierAddress) {
            toast.error("Missing location information for route calculation");
            return;
        }
        
        try {
            setLoading(true);
            
            // Use backend API to fetch directions
            const response = await axios.post('http://localhost:3000/api/directions', {
                origin: { address: courierAddress },
                destination: { address: pickupLocation },
                travelMode: "DRIVE"
            });
            
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                // Extract polyline from the response
                const encoded = response.data.routes[0].polyline.encodedPolyline;
                
                // Decode the polyline to get the path
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encoded);
                setRouteToPickup(decodedPath);
                
                // Extract and display route information
                const distance = response.data.routes[0].legs[0].distance.text;
                const duration = response.data.routes[0].legs[0].duration.text;
                
                toast.success(`Route to pickup found: ${distance} (${duration})`);
            } else {
                toast.error("No route found to pickup location");
            }
        } catch (error) {
            console.error("Error fetching directions from backend:", error);
            toast.error("Could not fetch directions to pickup location");
        } finally {
            setLoading(false);
        }
    };

    // Select an order and calculate route from pickup to destination
    const handleOrderSelect = async (order) => {
        setSelectedOrder(order);
        toast.success(`Selected order #${order._id}`);
        
        // Calculate route from pickup location to order destination
        if (pickupCoordinates && order.coordinates) {
            calculateRouteToDestination(pickupCoordinates, order.coordinates);
        }
    };

    // Calculate route from pickup to destination using backend API
    const calculateRouteToDestination = async (pickupCoords, destinationCoords) => {
        if (!pickupCoords || !destinationCoords) {
            toast.error("Missing location information for route calculation");
            return;
        }
        
        try {
            setLoading(true);
            
            // Use backend API to fetch directions
            const response = await axios.post('http://localhost:3000/api/directions', {
                origin: { address: pickupLocation },
                destination: { address: selectedOrder.location },
                travelMode: "DRIVE"
            });
            
            if (response.data && response.data.routes && response.data.routes.length > 0) {
                // Extract polyline from the response
                const encoded = response.data.routes[0].polyline.encodedPolyline;
                
                // Decode the polyline to get the path
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encoded);
                setRouteToDestination(decodedPath);
                
                // Extract and display route information
                const distance = response.data.routes[0].legs[0].distance.text;
                const duration = response.data.routes[0].legs[0].duration.text;
                
                toast.success(`Route to destination found: ${distance} (${duration})`);
            } else {
                toast.error("No route found to destination");
            }
        } catch (error) {
            console.error("Error fetching directions from backend:", error);
            toast.error("Could not fetch directions to destination");
        } finally {
            setLoading(false);
        }
    };

    // Assign order to courier - temporarily disabled
    const assignOrderToCourier = async (orderId) => {
        toast.info("Order assignment feature coming soon!");
    };

    if (loadError) {
        return <div className="p-5">Error loading maps: {loadError.message}</div>;
    }

    if (!isLoaded || loading) {
        return <div className="p-5">Loading map...</div>;
    }

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Courier Delivery Map</h2>
            
            {currentLocation && (
                <div className="mb-4">
                    <p><strong>Your Location:</strong> {courierAddress}</p>
                    {pickupLocation && (
                        <p><strong>Pickup Location:</strong> {pickupLocation}</p>
                    )}
                    {selectedOrder && (
                        <p><strong>Delivery Destination:</strong> {selectedOrder.location}</p>
                    )}
                    {(routeToPickup || routeToDestination) && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-blue-700">
                                <strong>Routes:</strong> 
                                {routeToPickup && " Path to pickup location is displayed"}
                                {routeToPickup && routeToDestination && " and "}
                                {routeToDestination && " Path from pickup to destination is displayed"}
                            </p>
                        </div>
                    )}
                </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* Map Container */}
                <div className="w-full md:w-2/3">
                    {currentLocation && (
                        <GoogleMap
                            mapContainerStyle={{ height: "500px", width: "100%" }}
                            center={currentLocation}
                            zoom={12}
                        >
                            {/* Courier's current location */}
                            <Marker 
                                position={currentLocation} 
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                    scaledSize: new window.google.maps.Size(40, 40)
                                }}
                                label="You"
                            />
                            
                            {/* Pickup location */}
                            {pickupCoordinates && (
                                <Marker 
                                    position={pickupCoordinates} 
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                                        scaledSize: new window.google.maps.Size(40, 40)
                                    }}
                                    label="Pickup"
                                />
                            )}
                            
                            {/* Available orders */}
                            {availableOrders.map((order) => (
                                <Marker
                                    key={order._id}
                                    position={order.coordinates}
                                    icon={{
                                        url: selectedOrder && selectedOrder._id === order._id 
                                            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" 
                                            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                        scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                    onClick={() => handleOrderSelect(order)}
                                />
                            ))}
                            
                            {/* Route from courier to pickup */}
                            {routeToPickup && (
                                <Polyline
                                    path={routeToPickup}
                                    options={{
                                        strokeColor: "#4285F4", // Blue route to pickup
                                        strokeOpacity: 0.8,
                                        strokeWeight: 5,
                                        icons: [{
                                            icon: {
                                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                                            },
                                            offset: '50%',
                                            repeat: '100px'
                                        }]
                                    }}
                                />
                            )}
                            
                            {/* Route from pickup to destination */}
                            {routeToDestination && (
                                <Polyline
                                    path={routeToDestination}
                                    options={{
                                        strokeColor: "#FF4500", // Orange-red route to destination
                                        strokeOpacity: 0.8,
                                        strokeWeight: 5,
                                        icons: [{
                                            icon: {
                                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                                            },
                                            offset: '50%',
                                            repeat: '100px'
                                        }]
                                    }}
                                />
                            )}
                        </GoogleMap>
                    )}
                </div>
                
                {/* Orders List */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <h3 className="text-xl font-semibold mb-3">Pickup Location</h3>
                        {pickupLocation ? (
                            <div>
                                <p>{pickupLocation}</p>
                                {!routeToPickup && (
                                    <button
                                        className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                                        onClick={() => calculateRouteToPickup(pickupCoordinates)}
                                    >
                                        Show Route to Pickup
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p>No pickup location available</p>
                        )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-3">Available Orders</h3>
                        
                        {availableOrders.length === 0 ? (
                            <p>No available orders nearby</p>
                        ) : (
                            <ul className="space-y-3">
                                {availableOrders.map((order) => (
                                    <li 
                                        key={order._id} 
                                        className={`p-3 border rounded-lg cursor-pointer ${
                                            selectedOrder && selectedOrder._id === order._id 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200'
                                        }`}
                                        onClick={() => handleOrderSelect(order)}
                                    >
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Product:</strong> {order.product}</p>
                                        <p><strong>Amount:</strong> ${order.totalAmount}</p>
                                        <p><strong>Quantity:</strong> {order.quantity}</p>
                                        <p><strong>Destination:</strong> {order.location}</p>
                                        
                                        <button
                                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOrderSelect(order);
                                            }}
                                        >
                                            Show Delivery Route
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {/* Selected Order Details */}
                    {selectedOrder && (
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-xl font-semibold mb-3">Selected Order Details</h3>
                            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                            <p><strong>Product:</strong> {selectedOrder.product}</p>
                            <p><strong>Amount:</strong> ${selectedOrder.totalAmount}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                            <p><strong>Destination:</strong> {selectedOrder.location}</p>
                            
                            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                                <p className="font-medium">Delivery Route:</p>
                                <p>1. From your location to pickup point</p>
                                <p>2. From pickup point to customer location</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourierMap;
