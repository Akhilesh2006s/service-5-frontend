import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, ThumbsUp, MessageCircle, AlertCircle, CheckCircle, Clock, X, Eye } from 'lucide-react';

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
  assignedTo?: {
    name: string;
    designation: string;
  };
  resolvedAt?: string;
  resolutionNotes?: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const CitizenReportsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'resolved'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
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
        // API already filters posts for citizens, so we get only user's posts
        setPosts(data);
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
      case 'rejected': return <X className="w-4 h-4" />;
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

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'pending') return post.status === 'pending';
    if (filter === 'assigned') return post.status === 'assigned' || post.status === 'in-progress';
    if (filter === 'resolved') return post.status === 'resolved';
    return true;
  });

  const getFilterCounts = () => {
    return {
      all: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      assigned: posts.filter(p => p.status === 'assigned' || p.status === 'in-progress').length,
      resolved: posts.filter(p => p.status === 'resolved').length,
    };
  };

  const counts = getFilterCounts();

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reports</h1>
        <p className="text-gray-600">Track all the issues you've reported</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-blue-600">{posts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{counts.resolved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'assigned', label: 'In Progress', count: counts.assigned },
            { key: 'resolved', label: 'Resolved', count: counts.resolved },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Reports Yet' : `No ${filter} Reports`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'You haven\'t reported any issues yet'
                  : `No reports with ${filter} status found`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
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
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Reported: {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.resolvedAt && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Resolved: {new Date(post.resolvedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {post.assignedTo && (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Assigned to: {post.assignedTo.name}</span>
                    </div>
                  )}
                </div>

                {post.resolutionNotes && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Resolution Notes:</p>
                    <p className="text-sm text-green-800">{post.resolutionNotes}</p>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {post.category}</span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.upvotes.length}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewPost(post)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {post.status === 'resolved' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolved
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Post Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
                  <p className="text-gray-600">{selectedPost.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(selectedPost.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(selectedPost.status)}
                          <span className="ml-1">{selectedPost.status.replace('-', ' ')}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(selectedPost.priority)}>
                        {selectedPost.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedPost.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Reported: {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedPost.resolvedAt && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Resolved: {new Date(selectedPost.resolvedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedPost.assignedTo && (
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Assigned to: {selectedPost.assignedTo.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Category: {selectedPost.category}</span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {selectedPost.upvotes.length} upvotes
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {selectedPost.comments.length} comments
                  </span>
                </div>

                {selectedPost.resolutionNotes && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">Resolution Notes:</p>
                    <p className="text-sm text-green-800">{selectedPost.resolutionNotes}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
