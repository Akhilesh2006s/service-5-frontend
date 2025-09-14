import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NewProfilePageProps {
  user: any;
  onLogout: () => void;
}

export const NewProfilePage: React.FC<NewProfilePageProps> = ({ user, onLogout }) => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    onLogout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white px-4 py-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-blue-600">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
              <p className="text-blue-100 text-base mb-3">
                {user?.role === 'government' ? 'Government Official' : 'Citizen'}
              </p>
              <div className="flex items-center space-x-3">
                {user?.verified && (
                  <Badge className="bg-green-500/20 text-green-200 border-green-400/30 text-xs px-3 py-1 rounded-full">
                    ✓ Verified
                  </Badge>
                )}
                {user?.role === 'government' && user?.department && (
                  <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 text-xs px-3 py-1 rounded-full">
                    {user.department.replace('-', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Information */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800">Profile Information</CardTitle>
            <CardDescription className="text-gray-600">Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                <p className="text-gray-900 font-medium">{user?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-gray-900 font-medium">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Role</label>
                <p className="text-gray-900 font-medium capitalize">{user?.role}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${user?.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <p className="text-gray-900 font-medium">
                    {user?.verified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </div>

            {user?.role === 'citizen' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Aadhaar Number</label>
                  <p className="text-gray-900 font-medium">{user?.aadhaarNumber || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                  <p className="text-gray-900 font-medium">{user?.location || 'Not provided'}</p>
                </div>
              </>
            )}

            {user?.role === 'government' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Department</label>
                  <p className="text-gray-900 font-medium capitalize">{user?.department?.replace('-', ' ') || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Designation</label>
                  <p className="text-gray-900 font-medium">{user?.designation || 'Not specified'}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Platform Statistics */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800">Platform Statistics</CardTitle>
            <CardDescription className="text-gray-600">Your activity and engagement on the platform</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-700">Posts Created</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-green-700">Issues Resolved</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-700">Upvotes Received</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-orange-700">Comments Made</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Benefits */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800">Platform Benefits</CardTitle>
            <CardDescription className="text-gray-600">What you can do on this platform</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {user?.role === 'citizen' ? (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Report community issues and problems</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Track the status of your reported issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Upvote and comment on other issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Get verified with Aadhaar authentication</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">View and manage all reported issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Assign issues to department officials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Update issue status and resolution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">Access detailed analytics and reports</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};