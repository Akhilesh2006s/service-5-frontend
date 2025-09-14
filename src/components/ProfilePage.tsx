
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const userStats = {
    postsCreated: 12,
    issuesResolved: 8,
    totalReactions: 145,
    joinedDate: 'January 2024'
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-blue-100 text-sm">📍 {user.location}</p>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-green-400 text-sm">✓</span>
              <span className="text-blue-100 text-xs">Verified Citizen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.postsCreated}</div>
                <div className="text-xs text-gray-600">Posts Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.issuesResolved}</div>
                <div className="text-xs text-gray-600">Issues Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.totalReactions}</div>
                <div className="text-xs text-gray-600">Total Reactions</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-600">{userStats.joinedDate}</div>
                <div className="text-xs text-gray-600">Member Since</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aadhaar Verification</span>
              <span className="text-green-600 text-sm">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">DigiLocker Integration</span>
              <span className="text-green-600 text-sm">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Location Verification</span>
              <span className="text-green-600 text-sm">✓ Confirmed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">📝</span>
                <span>Posted about street light issues</span>
                <span className="text-gray-500 text-xs">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600">❤️</span>
                <span>Reacted to traffic signal request</span>
                <span className="text-gray-500 text-xs">1 day ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Issue marked as resolved</span>
                <span className="text-gray-500 text-xs">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Settings
          </Button>
          <Button variant="outline" className="w-full">
            Privacy Policy
          </Button>
          <Button variant="outline" className="w-full">
            Help & Support
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
