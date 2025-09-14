import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    role: string;
  };
  upvotes: string[];
  comments: any[];
  engagementScore: number;
  createdAt: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const NewHomePage: React.FC<{ user: any }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update the post in the local state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, upvotes: data.upvoted ? [...post.upvotes, user.id] : post.upvotes.filter(id => id !== user.id) }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error upvoting post:', error);
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
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white px-4 py-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {user?.role === 'government' ? '🏛️ Government Dashboard' : '🏠 Welcome Home'}
              </h1>
              <p className="text-blue-100 text-base">
                {user?.role === 'government' 
                  ? 'Noida Municipal Corporation • Executive Portal' 
                  : `Welcome back, ${user?.name}!`
                }
              </p>
              {user?.role === 'citizen' && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded-full">
                    ✓ Verified Citizen
                  </span>
                  <span className="text-xs text-blue-200">
                    {user?.location}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-sm text-blue-200">Live Updates</div>
              </div>
              <div className="text-xs text-blue-300">Last sync: 2 min ago</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {user?.role === 'government' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600">{posts.filter(p => p.priority === 'critical').length}</div>
                  <div className="text-sm font-medium text-red-700">Critical Issues</div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{posts.filter(p => p.status === 'pending').length}</div>
                  <div className="text-sm font-medium text-blue-700">Pending Issues</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">⏳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-gray-400">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Issues Found</h3>
                <p className="text-gray-500 mb-6">
                  {user?.role === 'citizen' 
                    ? "Start by reporting an issue in your community" 
                    : "No issues have been reported yet"
                  }
                </p>
                {user?.role === 'citizen' && (
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl"
                    onClick={() => window.location.reload()}
                  >
                    Report Your First Issue
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800 mb-2">{post.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                            {post.author.name.charAt(0).toUpperCase()}
                          </span>
                          <span>{post.author.name}</span>
                        </span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(post.priority)}`}>
                        {post.priority.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(post.status)}`}>
                        {post.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 mb-6 leading-relaxed">{post.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs font-medium mb-1">CATEGORY</div>
                      <div className="text-gray-800 font-semibold capitalize">{post.category}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs font-medium mb-1">LOCATION</div>
                      <div className="text-gray-800 font-semibold">{post.location}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs font-medium mb-1">DEPARTMENT</div>
                      <div className="text-gray-800 font-semibold capitalize">{post.department.replace('-', ' ')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs font-medium mb-1">ENGAGEMENT</div>
                      <div className="text-gray-800 font-semibold">{Math.round(post.engagementScore)} pts</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpvote(post._id)}
                        className="flex items-center space-x-2 h-9 px-4 rounded-lg border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      >
                        <span className="text-lg">👍</span>
                        <span className="font-medium">{post.upvotes.length}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2 h-9 px-4 rounded-lg border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      >
                        <span className="text-lg">💬</span>
                        <span className="font-medium">{post.comments.length}</span>
                      </Button>
                    </div>
                    {user?.role === 'government' && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Assign Issue
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
