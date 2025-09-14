import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, Plus, Edit, Trash2, X, Building } from 'lucide-react';

interface Official {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  verified: boolean;
}

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const AdminOfficialsPage: React.FC = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officialsResponse, departmentsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/officials`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/departments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (officialsResponse.ok && departmentsResponse.ok) {
        const officialsData = await officialsResponse.json();
        const departmentsData = await departmentsResponse.json();
        
        setOfficials(officialsData);
        setDepartments(departmentsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load officials data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/officials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Government official created successfully!",
        });
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', department: '', designation: '' });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create official",
        variant: "destructive",
      });
    }
  };

  const handleEditOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficial) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/officials/${selectedOfficial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Official updated successfully!",
        });
        setShowEditModal(false);
        setSelectedOfficial(null);
        setFormData({ name: '', email: '', password: '', department: '', designation: '' });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update official",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOfficial = async (officialId: string) => {
    if (!confirm('Are you sure you want to delete this official?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/officials/${officialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Official deleted successfully!",
        });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete official",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (official: Official) => {
    setSelectedOfficial(official);
    setFormData({
      name: official.name,
      email: official.email,
      password: '',
      department: official.department,
      designation: official.designation
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedOfficial(null);
    setFormData({ name: '', email: '', password: '', department: '', designation: '' });
  };

  const getDepartmentName = (deptCode: string) => {
    const dept = departments.find(d => d.code === deptCode);
    return dept ? dept.name : deptCode;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading officials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Government Officials</h1>
                <p className="text-purple-100 text-base">Manage government officials and their roles</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Official
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Officials List */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">All Officials</CardTitle>
            <CardDescription>Manage government officials and their department assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {officials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No officials created yet</p>
                  <p className="text-sm text-gray-400 mt-2">Add your first government official to get started</p>
                </div>
              ) : (
                officials.map((official) => (
                  <div key={official._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {official.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{official.name}</h3>
                            <Badge className={official.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {official.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{official.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{getDepartmentName(official.department)}</span>
                            </div>
                            <span>•</span>
                            <span>{official.designation}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditModal(official)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteOfficial(official._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Official Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Government Official</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModals}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Create a new government official account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOfficial} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., john.smith@gov.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a secure password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., Health Director"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Create Official</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Official Modal */}
      {showEditModal && selectedOfficial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Official</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModals}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Update official information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditOfficial} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email Address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., john.smith@gov.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password">New Password (optional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept.code}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-designation">Designation</Label>
                  <Input
                    id="edit-designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., Health Director"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Update Official</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
