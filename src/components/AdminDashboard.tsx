import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  officials: any[];
  workers: any[];
  isActive: boolean;
}

interface Official {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const AdminDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [showCreateOfficial, setShowCreateOfficial] = useState(false);
  const { token, logout } = useAuth();
  const { toast } = useToast();

  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    description: ''
  });

  const [newOfficial, setNewOfficial] = useState({
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
      const [deptRes, officialsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/departments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/officials`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (deptRes.ok) setDepartments(await deptRes.json());
      if (officialsRes.ok) setOfficials(await officialsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
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
        body: JSON.stringify(newDept),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Department created successfully",
        });
        setShowCreateDept(false);
        setNewDept({ name: '', code: '', description: '' });
        fetchData();
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

  const handleCreateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/officials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newOfficial),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Government official created successfully",
        });
        setShowCreateOfficial(false);
        setNewOfficial({ name: '', email: '', password: '', department: '', designation: '' });
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

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Main Admin Dashboard</h1>
                <p className="text-blue-100 text-base">System Administration & Department Management</p>
              </div>
            </div>
            <Button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalDepartments || 0}</div>
                  <div className="text-sm text-blue-700">Departments</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🏢</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalOfficials || 0}</div>
                  <div className="text-sm text-green-700">Officials</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">👔</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalWorkers || 0}</div>
                  <div className="text-sm text-orange-700">Workers</div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">👷</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalCitizens || 0}</div>
                  <div className="text-sm text-purple-700">Citizens</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Manage departments and officials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowCreateDept(true)}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
              >
                + Create Department
              </Button>
              <Button 
                onClick={() => setShowCreateOfficial(true)}
                className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                + Add Official
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Departments</CardTitle>
            <CardDescription>Manage government departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.code} • {dept.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {dept.officials.length} Officials
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {dept.workers.length} Workers
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Officials */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Government Officials</CardTitle>
            <CardDescription>Manage department officials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {officials.map((official) => (
                <div key={official._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{official.name}</h3>
                      <p className="text-sm text-gray-600">{official.email}</p>
                      <p className="text-xs text-gray-500">{official.designation} • {official.department}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Department Modal */}
      {showCreateDept && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create Department</CardTitle>
              <CardDescription>Add a new government department</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div>
                  <Label htmlFor="dept-name">Department Name</Label>
                  <Input
                    id="dept-name"
                    value={newDept.name}
                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dept-code">Department Code</Label>
                  <Input
                    id="dept-code"
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dept-desc">Description</Label>
                  <Input
                    id="dept-desc"
                    value={newDept.description}
                    onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDept(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Official Modal */}
      {showCreateOfficial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create Government Official</CardTitle>
              <CardDescription>Add a new department official</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOfficial} className="space-y-4">
                <div>
                  <Label htmlFor="off-name">Full Name</Label>
                  <Input
                    id="off-name"
                    value={newOfficial.name}
                    onChange={(e) => setNewOfficial({ ...newOfficial, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="off-email">Email</Label>
                  <Input
                    id="off-email"
                    type="email"
                    value={newOfficial.email}
                    onChange={(e) => setNewOfficial({ ...newOfficial, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="off-password">Password</Label>
                  <Input
                    id="off-password"
                    type="password"
                    value={newOfficial.password}
                    onChange={(e) => setNewOfficial({ ...newOfficial, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="off-dept">Department</Label>
                  <Select value={newOfficial.department} onValueChange={(value) => setNewOfficial({ ...newOfficial, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept._id} value={dept.code}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="off-designation">Designation</Label>
                  <Input
                    id="off-designation"
                    value={newOfficial.designation}
                    onChange={(e) => setNewOfficial({ ...newOfficial, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateOfficial(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
