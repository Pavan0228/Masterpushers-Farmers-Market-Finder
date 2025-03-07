// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '../ui/input';
import { 
  Users, Package, Truck, LogOut, Menu, X, Home, User, 
  Settings, Bell, Search, ChevronDown,Shield,Clock,
} from 'lucide-react';
import CouriersList from './CouriersList';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalCouriers: 0,
    verifiedCouriers: 0,
    pendingCouriers: 0,
    activeDeliveries: 0
  });
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   fetchDashboardStats();
  // }, []);
  
  // const fetchDashboardStats = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setStats(response.data);
  //   } catch (error) {
  //     console.error('Error fetching dashboard stats:', error);
  //     if (error.response?.status === 401) {
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //       navigate('/admin/login');
  //     }
  //   }
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 flex flex-col fixed h-full z-10`}>
        <div className="p-4 flex items-center justify-between border-b">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <Shield className="h-8 w-8 text-green-600" />
            {sidebarOpen && <span className="ml-2 text-xl font-bold text-green-700">Admin</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`text-gray-500 hover:text-gray-700 ${!sidebarOpen && 'hidden'}`}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-green-600 bg-green-50 rounded-md">
              <Home className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Link>
            <Link to="/admin/couriers" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <Users className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Couriers</span>}
            </Link>
            <Link to="/admin/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md">
              <Settings className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className={`flex items-center text-red-600 hover:text-red-800 ${!sidebarOpen && 'justify-center w-full'}`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">A</div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Couriers</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCouriers}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Verified Couriers</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.verifiedCouriers}</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Verification</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingCouriers}</h3>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Deliveries</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeDeliveries}</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="couriers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="couriers">Couriers Management</TabsTrigger>
              <TabsTrigger value="overview">System Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="couriers">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Couriers List</CardTitle>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          type="text" 
                          placeholder="Search couriers..." 
                          className="pl-9 w-64"
                        />
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">Add Courier</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CouriersList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>System statistics and overview information will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;