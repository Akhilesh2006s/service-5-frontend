import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, MapPin, ThumbsUp } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  createdAt: string;
  upvotes: string[];
  engagementScore: number;
  comments: any[];
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const CitizenHomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter posts created by the current user
        const myPosts = data.filter((post: any) => post.author._id === user?.id);
        setPosts(myPosts);
      } else {
        throw new Error('Failed to fetch posts');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'assigned': return <AlertCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalReports: posts.length,
    pendingReports: posts.filter(p => p.status === 'pending').length,
    resolvedReports: posts.filter(p => p.status === 'resolved').length,
    totalUpvotes: posts.reduce((sum, post) => sum + post.upvotes.length, 0),
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Track your reports and stay updated on community issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalReports}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedReports}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upvotes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalUpvotes}</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Report new issues and track existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Report New Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Recent Reports</CardTitle>
          <CardDescription>Latest issues you've reported</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-4">Start by reporting an issue in your area</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Report First Issue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1 ml-4">
                      <Badge className={getPriorityColor(post.priority)}>
                        {post.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(post.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(post.status)}
                          <span className="ml-1">{post.status.replace('-', ' ')}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Reported: {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Category: {post.category}</span>
                      <span>Score: {post.engagementScore}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {post.upvotes.length} upvotes
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {posts.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    View All Reports
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
          <CardDescription>Your contribution to the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Reports Submitted</p>
                <p className="text-sm text-gray-600">Total issues reported</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {stats.totalReports}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Issues Resolved</p>
                <p className="text-sm text-gray-600">Reports that have been fixed</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {stats.resolvedReports}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Community Engagement</p>
                <p className="text-sm text-gray-600">Total upvotes received</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
