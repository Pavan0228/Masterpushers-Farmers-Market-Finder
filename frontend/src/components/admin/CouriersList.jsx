import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  UserCheck,
  UserX,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const CouriersList = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/courier/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mappedCouriers = response.data.data.map(courier => ({
        ...courier,
        verified: courier.isVerified
      }));

      setCouriers(mappedCouriers);
    } catch (error) {
      console.error('Error fetching couriers:', error);
      toast.error('Failed to fetch couriers');
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (courierId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/courier/${courierId}/verify`, 
        { verified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCouriers(couriers.map(courier => 
        courier._id === courierId 
          ? { ...courier, verified: !currentStatus }
          : courier
      ));
      
      toast.success(`Courier ${!currentStatus ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error toggling courier verification:', error);
      toast.error('Failed to update courier verification status');
    }
  };

  const handleDeleteCourier = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/v1/courier/${selectedCourier._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCouriers(couriers.filter(courier => courier._id !== selectedCourier._id));
      setIsDeleteDialogOpen(false);
      toast.success('Courier deleted successfully');
    } catch (error) {
      console.error('Error deleting courier:', error);
      toast.error('Failed to delete courier');
    }
  };

  const filteredCouriers = couriers.filter(courier => 
    courier?.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courier?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Couriers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Couriers Management</CardTitle>
          <Button onClick={() => navigate('/admin/couriers/add')} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Courier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search couriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={fetchCouriers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCouriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No couriers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCouriers.map((courier) => (
                  <TableRow key={courier._id}>
                    <TableCell className="font-medium">
                      {courier?.user?.fullName || 'N/A'}
                    </TableCell>
                    <TableCell>{courier?.user?.email || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Toggle
                          pressed={courier.verified || false}
                          onPressedChange={() => handleVerifyToggle(courier._id, courier.verified)}
                          className={cn(
                            "data-[state=on]:bg-green-50 data-[state=on]:text-green-600 data-[state=on]:border-green-600",
                            "data-[state=off]:bg-gray-50 data-[state=off]:text-gray-600 data-[state=off]:border-gray-300",
                            "border hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          {courier.verified ? (
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-4 w-4" />
                              <span className="text-sm font-medium">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <UserX className="h-4 w-4" />
                              <span className="text-sm font-medium">Pending</span>
                            </div>
                          )}
                        </Toggle>
                        <Badge variant={courier.verified ? "success" : "warning"}>
                          {courier.verified ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {courier?.user?.createdAt ? 
                        new Date(courier.user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/admin/couriers/${courier._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/couriers/edit/${courier._id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setSelectedCourier(courier);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the courier's
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourier}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CouriersList;
