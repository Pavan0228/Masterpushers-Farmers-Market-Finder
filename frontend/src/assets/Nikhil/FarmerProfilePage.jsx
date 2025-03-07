import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Package, Star, Truck, Edit, Camera, Tractor,
  Sprout, BarChart3, FileText, Clock, Sun, FileImage,
  ShoppingBag, ArrowUp, ArrowDown, ExternalLink
} from 'lucide-react';

const FarmerProfilePage = () => {
  // Sample farmer data
  const [farmer, setFarmer] = useState({
    displayName: 'Raj Patel',
    email: 'raj.patel@example.com',
    phoneNumber: '+91 98765 43210',
    address: 'Village Amrapur, Taluka Vijapur',
    district: 'Mehsana',
    state: 'Gujarat',
    memberSince: 'January 2023',
    profileImage: null,
    crops: ['Tomatoes', 'Okra', 'Spinach', 'Eggplant'],
    rating: 4.8,
    totalSales: 2450,
    verfiedStatus: true
  });

  // Sample recent activities
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'harvest',
      crop: 'Tomatoes',
      quantity: '120 kg',
      date: '2025-03-04',
      status: 'completed',
      notes: 'Good yield despite dry conditions'
    },
    {
      id: 2,
      type: 'sale',
      crop: 'Spinach',
      quantity: '40 kg',
      price: '₹35/kg',
      buyer: 'Green Grocers Ltd',
      date: '2025-03-02',
      status: 'completed'
    },
    {
      id: 3,
      type: 'planting',
      crop: 'Okra',
      area: '0.5 acres',
      date: '2025-02-28',
      status: 'in-progress',
      expectedHarvest: '2025-04-15'
    },
    {
      id: 4,
      type: 'market_update',
      crop: 'Eggplant',
      priceChange: '+12%',
      date: '2025-02-25',
      notes: 'Price increase due to seasonal demand'
    },
    {
      id: 5,
      type: 'image_upload',
      crop: 'Tomatoes',
      date: '2025-02-20',
      status: 'shared',
      likes: 35
    }
  ]);

  // Crop insights
  const [cropInsights, setCropInsights] = useState([
    { name: 'Tomatoes', growth: 12, status: 'up' },
    { name: 'Spinach', growth: -5, status: 'down' },
    { name: 'Okra', growth: 8, status: 'up' },
    { name: 'Eggplant', growth: 15, status: 'up' }
  ]);

  // Functions to render activity icons
  const getActivityIcon = (type) => {
    switch(type) {
      case 'harvest':
        return <Tractor className="h-6 w-6 text-amber-500" />;
      case 'sale':
        return <ShoppingBag className="h-6 w-6 text-green-600" />;
      case 'planting':
        return <Sprout className="h-6 w-6 text-emerald-500" />;
      case 'market_update':
        return <BarChart3 className="h-6 w-6 text-blue-500" />;
      case 'image_upload':
        return <FileImage className="h-6 w-6 text-purple-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  // Handle profile image upload
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFarmer({...farmer, profileImage: event.target.result});
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-800 h-40 relative">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                  {farmer.profileImage ? (
                    <img 
                      src={farmer.profileImage} 
                      alt={farmer.displayName} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-green-100 flex items-center justify-center">
                      <User className="h-16 w-16 text-green-600" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-green-100 p-2 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-green-200 transition-colors">
                  <Camera className="h-4 w-4 text-green-600" />
                  <input 
                    id="profile-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>
              <div className="mb-3 ml-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  {farmer.displayName}
                  {farmer.verfiedStatus && (
                    <span className="ml-2 bg-white text-green-600 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                  )}
                </h1>
                <p className="text-green-100">Farmer • Member since {farmer.memberSince}</p>
              </div>
            </div>
            <div className="absolute right-6 top-6">
              <button className="bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 text-white font-medium backdrop-blur-sm flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-800">{farmer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-800">{farmer.phoneNumber}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                    <div>
                      <span className="text-gray-800 block">{farmer.address}</span>
                      <span className="text-gray-600">{farmer.district}, {farmer.state}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Farmer Stats</h3>
                    <Star className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium text-gray-800">{farmer.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sales</span>
                      <span className="font-medium text-gray-800">{farmer.totalSales} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crops</span>
                      <span className="font-medium text-gray-800">{farmer.crops.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Crops */}
          <div className="col-span-1">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sprout className="h-5 w-5 mr-2 text-green-600" />
                Active Crops
              </h2>
              
              <div className="space-y-4">
                {cropInsights.map((crop, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{crop.name}</span>
                      <div className={`flex items-center ${
                        crop.status === 'up' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {crop.status === 'up' ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(crop.growth)}%</span>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${60 + (crop.growth > 0 ? crop.growth : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 border border-green-600 text-green-600 hover:bg-green-50 transition py-3 rounded-lg font-medium flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Crop
              </button>
            </div>
            
            {/* Weather Card */}
            <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sun className="h-5 w-5 mr-2 text-amber-500" />
                Weather Forecast
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sun className="h-10 w-10 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">28°C</div>
                <div className="text-gray-600">Partly Cloudy</div>
                <div className="text-sm text-gray-500 mt-2">Mehsana, Gujarat</div>
                <div className="border-t border-blue-200 mt-4 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Humidity: 65%</span>
                    <span>Wind: 12 km/h</span>
                  </div>
                </div>
              </div>
              <a href="#" className="block w-full mt-3 text-center text-blue-600 text-sm hover:underline">
                View 7-day forecast
              </a>
            </div>
          </div>
          
          {/* Right Column - Recent Activity */}
          <div className="col-span-2">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </h2>
              
              <div className="space-y-6">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex">
                    <div className="mr-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 border-b border-gray-100 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg text-gray-800">
                            {activity.type === 'harvest' && `Harvested ${activity.crop}`}
                            {activity.type === 'sale' && `Sold ${activity.crop} at ${activity.price}`}
                            {activity.type === 'planting' && `Planted ${activity.crop}`}
                            {activity.type === 'market_update' && `${activity.crop} market price update`}
                            {activity.type === 'image_upload' && `Shared ${activity.crop} farm photos`}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {activity.type === 'harvest' && `Harvested ${activity.quantity} of ${activity.crop}`}
                            {activity.type === 'sale' && `${activity.quantity} sold to ${activity.buyer}`}
                            {activity.type === 'planting' && `${activity.area} planted, expected harvest on ${new Date(activity.expectedHarvest).toLocaleDateString()}`}
                            {activity.type === 'market_update' && `Price changed by ${activity.priceChange}`}
                            {activity.type === 'image_upload' && `Received ${activity.likes} likes`}
                          </p>
                          {activity.notes && (
                            <p className="text-gray-500 text-sm mt-2 italic">"{activity.notes}"</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                          {activity.status && (
                            <span className={`text-xs px-2 py-1 mt-2 rounded-full ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                              activity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              activity.status === 'shared' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {activity.type === 'image_upload' && (
                        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                          {[1, 2, 3].map((img) => (
                            <div key={img} className="h-24 w-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                              <div className="h-full w-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                <FileImage className="h-8 w-8 text-green-300" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {activity.type === 'sale' && (
                        <button className="mt-3 text-green-600 text-sm font-medium flex items-center hover:underline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Transaction Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-green-50 hover:bg-green-100 text-green-700 transition py-3 rounded-lg font-medium">
                View All Activity
              </button>
            </div>
            
            {/* Marketplace Trends */}
            <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Marketplace Trends
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Crop</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Current Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Change (7d)</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Demand</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">Tomatoes</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹45/kg</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-green-600 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          12%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-600 rounded-full" style={{width: '80%'}}></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">Okra</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹60/kg</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-green-600 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          8%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-600 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">Spinach</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹35/kg</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-red-500 flex items-center">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          5%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-600 rounded-full" style={{width: '45%'}}></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">Eggplant</td>
                      <td className="px-4 py-3 text-sm text-gray-600">₹50/kg</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-green-600 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          15%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-600 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white transition py-3 rounded-lg font-medium">
                List Produce for Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional Plus icon since it's not imported at the top
const Plus = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default FarmerProfilePage;