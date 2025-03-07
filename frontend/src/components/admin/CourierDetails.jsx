// src/pages/admin/CourierDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Mail, CalendarClock, Shield } from 'lucide-react';

const CourierDetails = () => {
  const [courier, setCourier] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCourierDetails();
  }, [id]);
  
  const fetchCourierDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/courier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourier(response.data);
    } catch (error) {
      console.error('Error fetching courier details:', error);
      toast.error('Failed to fetch courier details');
      if (error.response?.status === 404) {
        navigate('/admin/couriers');
      } else if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/courier/${id}/verify`, 
        { verified: !courier.verified },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCourier({
        ...courier,
        verified: !courier.verified
      });
      
      toast.success(`Courier ${!courier.verified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error toggling courier verification:', error);
      toast.error('Failed to update courier verification status');
    }
  };
  
  const handleDeleteCourier = async () => {
    if (!window.confirm('Are you sure you want to delete this courier? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/couriers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Courier deleted successfully');
      navigate('/admin/couriers');
    } catch (error) {
      console.error('Error deleting courier:', error);
      toast.error('Failed to delete courier');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-green-500 border-r-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!courier) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">Courier not found</h2>
        <Button 
          onClick={() => navigate('/admin/couriers')} 
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          Back to Couriers List
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/couriers')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Courier Details</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p className="text-lg font-medium">{courier.user.fullName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-lg">{courier.user.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Role</h4>
                <p className="text-lg capitalize">{courier.user.role}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Account Created</h4>
                <p className="text-lg">{new Date(courier.user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Verification Status</h4>
                <p className={`text-lg font-medium ${courier.verified ? 'text-green-600' : 'text-amber-600'}`}>
                  {courier.verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <Switch 
                checked={courier.verified || false}
                onCheckedChange={handleVerifyToggle}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
              <p className="text-lg">{new Date(courier.user.updatedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate(`/admin/couriers/edit/${id}`)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Edit Courier
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDeleteCourier}
            >
              Delete Courier
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/couriers')}
            >
              Back to List
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourierDetails;