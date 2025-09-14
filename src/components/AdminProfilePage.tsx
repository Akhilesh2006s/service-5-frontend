import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const AdminProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAdminInfo(data);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
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
          <p className="mt-2 text-gray-600">Loading profile...</p>
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
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Profile</h1>
                <p className="text-purple-100 text-base">System Administrator Account</p>
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
        {/* Personal Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Personal Information</CardTitle>
            <CardDescription>Your administrator account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{adminInfo?.name || user?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{adminInfo?.email || user?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-900 font-medium">System Administrator</p>
                  <p className="text-purple-700 text-sm">Full system access and control</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">System Information</CardTitle>
            <CardDescription>Administrator privileges and system access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Account Status</label>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-900 font-medium">Active</p>
                <p className="text-green-700 text-sm">Your administrator account is active and ready to use</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Administrator Since</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {adminInfo?.createdAt ? new Date(adminInfo.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Last Login</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {adminInfo?.lastLogin ? new Date(adminInfo.lastLogin).toLocaleString() : 'Current session'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Permissions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">System Permissions</CardTitle>
            <CardDescription>Your administrative privileges and capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Department Management</h4>
                <p className="text-blue-700 text-sm">Create, edit, and manage government departments</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">User Management</h4>
                <p className="text-green-700 text-sm">Create and manage government officials and workers</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">System Configuration</h4>
                <p className="text-purple-700 text-sm">Configure system settings and parameters</p>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-1">Data Access</h4>
                <p className="text-orange-700 text-sm">Access all system data and reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                <span className="mr-2">🏢</span>
                Manage Departments
              </Button>
              <Button className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                <span className="mr-2">👔</span>
                Manage Officials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
