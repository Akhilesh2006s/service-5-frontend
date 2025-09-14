import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, User, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  upvotes: string[];
  engagementScore: number;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

interface Worker {
  _id: string;
  name: string;
  email: string;
  designation: string;
}

export const IssuesPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'resolved'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assigning, setAssigning] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchWorkers();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
        description: "Failed to load issues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/workers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      } else {
        console.error('Failed to fetch workers');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  }; // Fixed fetchWorkers function

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getFilterCounts = () => {
    return {
      all: posts.length,
      pending: posts.filter(p => p.status === 'pending').length,
      assigned: posts.filter(p => p.status === 'assigned').length,
      resolved: posts.filter(p => p.status === 'resolved').length,
    };
  };

  const counts = getFilterCounts();

  const handleAssignTask = (post: Post) => {
    setSelectedPost(post);
    setShowAssignModal(true);
    setSelectedWorker('');
    setTaskDescription('');
  };

  const handleViewDetails = (post: Post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedPost(null);
    setSelectedWorker('');
    setTaskDescription('');
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPost(null);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedPost || !selectedWorker || !taskDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a worker and provide task description",
        variant: "destructive",
      });
      return;
    }

    setAssigning(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: selectedPost._id,
          assignedTo: selectedWorker,
          description: taskDescription,
          instructions: `Please address the issue: ${selectedPost.title}`,
          priority: selectedPost.priority
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task assigned successfully!",
        });
        closeAssignModal();
        fetchPosts(); // Refresh the posts to update status
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign task');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading issues...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Issues & Complaints</h1>
        <p className="text-gray-600">Manage citizen complaints and issues</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'assigned', label: 'Assigned', count: counts.assigned },
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

      {/* Issues List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Issues Yet' : `No ${filter} Issues`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No citizen complaints have been reported yet'
                  : `No issues with ${filter} status found`
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
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Category: {post.category}</span>
                    <span>Score: {post.engagementScore}</span>
                  </div>
                  <div className="flex space-x-2">
                    {post.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleAssignTask(post)}
                      >
                        Assign Task
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(post)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Assign Task</h2>
                <Button variant="ghost" size="sm" onClick={closeAssignModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
                  <p className="text-gray-600 text-sm">{selectedPost.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Worker *
                  </label>
                  <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a worker...</option>
                    {workers.map((worker) => (
                      <option key={worker._id} value={worker._id}>
                        {worker.name} - {worker.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description *
                  </label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Describe what needs to be done..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeAssignModal}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitAssignment}
                  disabled={assigning || !selectedWorker || !taskDescription.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {assigning ? 'Assigning...' : 'Assign Task'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Details Modal */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Issue Details</h2>
                <Button variant="ghost" size="sm" onClick={closeDetailsModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Issue Title */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
                  <p className="text-gray-600">{selectedPost.description}</p>
                </div>

                {/* Issue Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{selectedPost.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Reported by:</span>
                      <span className="text-sm font-medium">{selectedPost.author.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedPost.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge className="ml-2 bg-blue-100 text-blue-800">
                        {selectedPost.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge className={`ml-2 ${
                        selectedPost.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedPost.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        selectedPost.priority === 'low' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedPost.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${
                        selectedPost.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedPost.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        selectedPost.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedPost.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Engagement Score */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Engagement Score:</span>
                    <span className="text-sm font-medium">{selectedPost.engagementScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Upvotes:</span>
                    <span className="text-sm font-medium">{selectedPost.upvotes.length}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="text-sm text-gray-600">
                    <p>Email: {selectedPost.author.email}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeDetailsModal}>
                  Close
                </Button>
                {selectedPost.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      closeDetailsModal();
                      handleAssignTask(selectedPost);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Assign Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
