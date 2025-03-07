import React, { useEffect, useState } from 'react';
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
    const [pickupLocations, setPickupLocations] = useState({});

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
                    
                    // After getting location, fetch pickup locations
                    fetchPickupLocations();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Could not get your location. Please enable location services.");
                    setLoading(false);
                }
            );
        }
    }, [isLoaded, geocoder]);

    // Fetch pickup locations
    const fetchPickupLocations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/v1/order', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data && response.data.pickupLocations) {
                setPickupLocations(response.data.pickupLocations);
            }
        } catch (error) {
            console.error("Error fetching pickup locations:", error);
            toast.error("Failed to fetch pickup locations");
        } finally {
            setLoading(false);
        }
    };

    // Fetch directions with address
    const fetchDirectionsWithAddress = async (origin, destinationAddress) => {
        console.log("Fetching directions with:");
        console.log("Origin:", origin);
        console.log("Destination:", destinationAddress);

        try {
            const response = await fetch(`http://localhost:3000/api/directions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: { address: origin },
                    destination: { address: destinationAddress },
                    travelMode: "DRIVE"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch directions");
            }

            const data = await response.json();
            console.log("Directions response:", data);

            if (data.routes && data.routes.length > 0) {
                const encoded = data.routes[0].polyline.encodedPolyline;
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encoded);
                setRouteToPickup(decodedPath);

                if (data.routes[0].legs && data.routes[0].legs.length > 0 && data.routes[0].legs[0].steps) {
                    // You can set directions instructions here if needed
                } else {
                    // Handle no steps case
                }
            } else {
                toast.error("No routes found.");
                setRouteToPickup(null);
            }
        } catch (error) {
            console.error("Error fetching directions: ", error);
            toast.error("Could not fetch directions.");
            setRouteToPickup(null);
        }
    };

    // Select a pickup location and fetch orders
    const handlePickupLocationSelect = async (location) => {
        setPickupLocation(location);
        const ordersAtLocation = pickupLocations[location] || [];
        const ordersWithCoordinates = await Promise.all(
            ordersAtLocation.map(async (order) => {
                if (order.location && geocoder) {
                    try {
                        const results = await new Promise((resolve, reject) => {
                            geocoder.geocode({ address: order.location }, (results, status) => {
                                if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                    resolve(results);
                                } else {
                                    reject(status);
                                }
                            });
                        });
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
        
        // Geocode the selected pickup location to get its coordinates
        try {
            const results = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: location }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        resolve(results);
                    } else {
                        reject(status);
                    }
                });
            });
            const pickupLocationCoords = results[0].geometry.location;
            setPickupCoordinates({
                lat: pickupLocationCoords.lat(),
                lng: pickupLocationCoords.lng()
            });
        } catch (error) {
            console.error(`Error geocoding pickup location:`, error);
            setPickupCoordinates(null); // Reset if there's an error
        }
        const pickupCoordinates = {currentLocation};

        // Calculate route to the selected pickup location
        await fetchDirectionsWithAddress(courierAddress, location);
    };

    // Select an order and calculate route from current location to pickup and then to destination
    const handleOrderSelect = async (order) => {
        setSelectedOrder(order);
        toast.success(`Selected order #${order._id}`);

        // Ensure pickupCoordinates are set before calculating the route
        if (pickupCoordinates && currentLocation) {
            // Fetch directions from current location to pickup location
            await fetchDirectionsWithAddress(courierAddress, pickupLocation); // From current location to pickup
            // Fetch directions from pickup location to order destination
            await fetchDirectionsWithAddress(pickupLocation, order.location); // From pickup to destination
        } else {
            toast.error("Pickup location coordinates or current location are missing.");
        }
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
                        <h3 className="text-xl font-semibold mb-3">Pickup Locations</h3>
                        {Object.keys(pickupLocations).map(location => (
                            <div key={location}>
                                <p>{location}</p>
                                <button
                                    className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                                    onClick={() => handlePickupLocationSelect(location)}
                                >
                                    Show Orders at this Location
                                </button>
                            </div>
                        ))}
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
