import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  department: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  upvotes: number;
  comments: any[];
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const CitizenDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    upvotesReceived: 0
  });
  const { user, token, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        
        // Calculate stats
        const userPosts = data.filter((post: Post) => post.author.email === user?.email);
        setStats({
          totalReports: userPosts.length,
          pendingReports: userPosts.filter((p: Post) => p.status === 'pending').length,
          resolvedReports: userPosts.filter((p: Post) => p.status === 'resolved').length,
          upvotesReceived: userPosts.reduce((sum: number, p: Post) => sum + p.upvotes, 0)
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load your reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Upvoted successfully",
        });
        fetchPosts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-white';
      case 'assigned': return 'bg-blue-600 text-white';
      case 'in-progress': return 'bg-orange-600 text-white';
      case 'resolved': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'assigned': return 'Assigned to Worker';
      case 'in-progress': return 'Work in Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-8 relative overflow-hidden">
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
                <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
                <p className="text-blue-100 text-base">Report issues and track progress</p>
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
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
              <div className="text-sm text-blue-700">Total Reports</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
              <div className="text-sm text-green-700">Resolved</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.upvotesReceived}</div>
              <div className="text-sm text-purple-700">Upvotes</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">⚡</span> Quick Actions
            </CardTitle>
            <CardDescription>Report new issues and track existing ones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex flex-col items-center space-y-2">
                <span className="text-2xl">📝</span>
                <span className="font-medium">Report Issue</span>
              </Button>
              <Button className="h-16 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl flex flex-col items-center space-y-2">
                <span className="text-2xl">📊</span>
                <span className="font-medium">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Reports */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">📋</span> My Reports
            </CardTitle>
            <CardDescription>Track the status of your reported issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.filter(post => post.author.email === user?.email).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No reports yet</p>
                  <p className="text-sm">Start by reporting an issue in your area</p>
                </div>
              ) : (
                posts.filter(post => post.author.email === user?.email).map((post) => (
                  <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>📍 {post.location}</span>
                          <span>🏢 {post.department}</span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs px-2 py-1 ${getPriorityColor(post.priority)}`}>
                            {post.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`text-xs px-2 py-1 ${getStatusColor(post.status)}`}>
                            {getStatusText(post.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleUpvote(post._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1"
                        >
                          <span>👍</span>
                          <span>{post.upvotes}</span>
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
    </div>
  );
};
