import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Building, Award, Calendar, Shield, LogOut, Edit } from 'lucide-react';

export const GovernmentProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    designation: user?.designation || '',
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      designation: user?.designation || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-gray-600 mb-2">{user?.designation}</p>
              <Badge className="bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                Government Official
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{user?.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900 capitalize">{user?.department}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.designation}
                      onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{user?.designation}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={user?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {user?.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="mt-6 flex space-x-3">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Notification Settings</h3>
              <p className="text-sm text-gray-600">Manage your notification preferences</p>
            </div>
            <Button variant="outline" size="sm">
              Settings
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-900">Logout</h3>
              <p className="text-sm text-red-600">Sign out of your account</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Technical details about your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">User ID</p>
              <p className="font-mono text-gray-900">{user?.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Last Login</p>
              <p className="font-medium text-gray-900">Just now</p>
            </div>
            <div>
              <p className="text-gray-600">Account Status</p>
              <Badge className={user?.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {user?.verified ? 'Active' : 'Pending'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
