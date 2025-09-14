import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building, Plus, Edit, Trash2, X } from 'lucide-react';

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  officials: any[];
  workers: any[];
  isActive: boolean;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/departments`, {
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
          description: "Department created successfully!",
        });
        setShowCreateModal(false);
        setFormData({ name: '', code: '', description: '' });
        fetchDepartments();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    }
  };

  const handleEditDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/departments/${selectedDept._id}`, {
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
          description: "Department updated successfully!",
        });
        setShowEditModal(false);
        setSelectedDept(null);
        setFormData({ name: '', code: '', description: '' });
        fetchDepartments();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update department",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/departments/${deptId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Department deleted successfully!",
        });
        fetchDepartments();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (dept: Department) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedDept(null);
    setFormData({ name: '', code: '', description: '' });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading departments...</p>
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
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Departments</h1>
                <p className="text-purple-100 text-base">Manage government departments</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Departments List */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">All Departments</CardTitle>
            <CardDescription>Manage and configure government departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No departments created yet</p>
                  <p className="text-sm text-gray-400 mt-2">Create your first department to get started</p>
                </div>
              ) : (
                departments.map((dept) => (
                  <div key={dept._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                          <Badge className={dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {dept.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{dept.code} • {dept.description}</p>
                        <div className="flex space-x-4 text-xs text-gray-500">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {dept.officials.length} Officials
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {dept.workers.length} Workers
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditModal(dept)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteDepartment(dept._id)}
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

      {/* Create Department Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Department</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModals}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Add a new government department</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Health Department"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Department Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., HEALTH"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the department's responsibilities"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Create Department</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && selectedDept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Department</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeModals}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Update department information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditDepartment} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Department Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Health Department"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-code">Department Code</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., HEALTH"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the department's responsibilities"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={closeModals} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Update Department</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
