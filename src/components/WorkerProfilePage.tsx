import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WorkerInfo {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  address?: string;
  createdAt: string;
  headOfDepartment?: {
    name: string;
    email: string;
    designation: string;
  };
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const WorkerProfilePage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [workerInfo, setWorkerInfo] = useState<WorkerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerInfo();
  }, []);

  const fetchWorkerInfo = async () => {
    try {
      // Fetch worker's own profile
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkerInfo(data);
      }

      // Try to fetch department head information
      try {
        // Fetch government officials from the same department
        const officialsResponse = await fetch(`${API_BASE_URL}/users/government`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (officialsResponse.ok) {
          const officials = await officialsResponse.json();
          // Find the head of the department (usually has 'head', 'director', 'manager' in designation)
          const departmentHead = officials.find((official: any) => 
            official.department === user?.department && 
            (official.designation?.toLowerCase().includes('head') || 
             official.designation?.toLowerCase().includes('director') ||
             official.designation?.toLowerCase().includes('manager') ||
             official.designation?.toLowerCase().includes('supervisor'))
          );
          
          if (departmentHead) {
            setWorkerInfo(prev => prev ? { 
              ...prev, 
              headOfDepartment: {
                name: departmentHead.name,
                email: departmentHead.email,
                designation: departmentHead.designation
              }
            } : null);
          } else {
            // If no specific head found, get the first government official from the department
            const firstOfficial = officials.find((official: any) => 
              official.department === user?.department
            );
            if (firstOfficial) {
              setWorkerInfo(prev => prev ? { 
                ...prev, 
                headOfDepartment: {
                  name: firstOfficial.name,
                  email: firstOfficial.email,
                  designation: firstOfficial.designation
                }
              } : null);
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch department head info:', error);
      }
    } catch (error) {
      console.error('Error fetching worker info:', error);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 text-white px-4 py-8 relative overflow-hidden">
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
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-orange-100 text-base">Worker Profile</p>
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
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.name || user?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.email || user?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Department</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.department || user?.department || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Designation</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.designation || user?.designation || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{workerInfo?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Department Information</CardTitle>
            <CardDescription>Your department and reporting structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Department</label>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-900 font-medium">{workerInfo?.department || user?.department || 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Department Head</label>
              {workerInfo?.headOfDepartment ? (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-900 font-medium">{workerInfo.headOfDepartment.name}</p>
                  <p className="text-green-700 text-sm">{workerInfo.headOfDepartment.designation}</p>
                  <p className="text-green-600 text-xs">{workerInfo.headOfDepartment.email}</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">No department head information available</p>
                  <p className="text-gray-500 text-xs">Contact administrator for reporting structure</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Your Role</label>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-900 font-medium">{workerInfo?.designation || user?.designation || 'Worker'}</p>
                <p className="text-orange-700 text-sm">Field Worker</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Account Information</CardTitle>
            <CardDescription>Account status and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Account Status</label>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-900 font-medium">Active</p>
                <p className="text-green-700 text-sm">Your account is active and ready to use</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Member Since</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {workerInfo?.createdAt ? new Date(workerInfo.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
