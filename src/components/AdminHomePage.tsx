import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, UserCheck, UserPlus } from 'lucide-react';

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

export const AdminHomePage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptResponse, officialsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/departments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/admin/officials`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (deptResponse.ok && officialsResponse.ok) {
        const deptData = await deptResponse.json();
        const officialsData = await officialsResponse.json();
        
        setDepartments(deptData);
        setOfficials(officialsData);
        
        // Calculate stats
        setStats({
          departments: deptData.length,
          officials: officialsData.length,
          workers: deptData.reduce((acc: number, dept: Department) => acc + dept.workers.length, 0),
          citizens: 0 // This would need a separate API call
        });
      }
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

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
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
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 text-base">System Administration & Department Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.departments || 0}</div>
                  <div className="text-sm text-blue-700">Departments</div>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.officials || 0}</div>
                  <div className="text-sm text-green-700">Officials</div>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.workers || 0}</div>
                  <div className="text-sm text-orange-700">Workers</div>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-pink-600">{stats.citizens || 0}</div>
                  <div className="text-sm text-pink-700">Citizens</div>
                </div>
                <UserPlus className="w-8 h-8 text-pink-600" />
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                <Building className="w-5 h-5 mr-2" />
                Create Department
              </Button>
              <Button className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                <UserPlus className="w-5 h-5 mr-2" />
                Add Official
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Departments */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Departments</CardTitle>
            <CardDescription>Manage government departments</CardDescription>
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
                departments.slice(0, 3).map((dept) => (
                  <div key={dept._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{dept.name}</h3>
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
                      <div className="ml-4">
                        <Badge className={dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
