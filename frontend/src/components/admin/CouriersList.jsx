// src/pages/admin/CouriersList.jsx
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Trash2, AlertCircle } from 'lucide-react';

const CouriersList = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: ''
  });
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
      setCouriers(response.data);
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
  
  const handleViewDetails = (courier) => {
    setSelectedCourier(courier);
    setIsDetailsOpen(true);
  };
  
  const handleEdit = (courier) => {
    setSelectedCourier(courier);
    setEditForm({
      fullName: courier.user.fullName,
      email: courier.user.email
    });
    setIsEditOpen(true);
  };
  
  const handleDelete = (courier) => {
    setSelectedCourier(courier);
    setIsDeleteOpen(true);
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
  
  const handleUpdateCourier = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/v1/courier/${selectedCourier._id}`, 
        editForm,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      fetchCouriers(); // Refresh the list
      setIsEditOpen(false);
      toast.success('Courier updated successfully');
    } catch (error) {
      console.error('Error updating courier:', error);
      toast.error('Failed to update courier');
    }
  };
  
  const handleDeleteCourier = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/v1/courier/${selectedCourier._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCouriers(couriers.filter(courier => courier._id !== selectedCourier._id));
      setIsDeleteOpen(false);
      toast.success('Courier deleted successfully');
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
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couriers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No couriers found
              </TableCell>
            </TableRow>
          ) : (
            couriers.map((courier) => (
              <TableRow key={courier._id}>
                <TableCell className="font-medium">{courier.user.fullName}</TableCell>
                <TableCell>{courier.user.email}</TableCell>
                <TableCell>
                  <Switch 
                    checked={courier.verified || false}
                    onCheckedChange={() => handleVerifyToggle(courier._id, courier.verified)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </TableCell>
                <TableCell>{new Date(courier.user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(courier)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(courier)}
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(courier)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
      
      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Courier Details</DialogTitle>
          </DialogHeader>
          {selectedCourier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p>{selectedCourier.user.fullName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedCourier.user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Role</h4>
                  <p className="capitalize">{selectedCourier.user.role}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Verification Status</h4>
                  <p>{selectedCourier.verified ? 'Verified' : 'Not Verified'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                  <p>{new Date(selectedCourier.user.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p>{new Date(selectedCourier.user.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Courier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCourier}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={editForm.fullName} 
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this courier? This action cannot be undone.</p>
            {selectedCourier && (
              <p className="font-medium mt-2">
                Courier: {selectedCourier.user.fullName} ({selectedCourier.user.email})
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteCourier}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouriersList;