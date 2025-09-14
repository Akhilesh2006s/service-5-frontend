import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, User, Calendar, FileText, MapPin, X } from 'lucide-react';

interface Task {
  _id: string;
  description: string;
  instructions: string;
  priority: string;
  status: string;
  createdAt: string;
  completionDate?: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    designation: string;
  };
  post: {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
  };
  workerRemarks?: string;
  workProof?: string;
  officialRemarks?: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const AssignedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load assigned tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleReview = (task: Task) => {
    setSelectedTask(task);
    setReviewRemarks('');
    setShowReviewModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTask(null);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedTask(null);
    setReviewRemarks('');
  };

  const handleSubmitReview = async () => {
    if (!selectedTask || !reviewRemarks.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide review remarks",
        variant: "destructive",
      });
      return;
    }

    setReviewing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask._id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          officialRemarks: reviewRemarks,
          status: 'reviewed'
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task reviewed successfully!",
        });
        closeReviewModal();
        fetchTasks(); // Refresh the tasks
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to review task');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to review task",
        variant: "destructive",
      });
    } finally {
      setReviewing(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'reviewed': return 'Under Review';
      case 'closed': return 'Closed';
      default: return status.replace('-', ' ');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'assigned': return <AlertCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'reviewed': return <FileText className="w-3 h-3" />;
      case 'closed': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending' || task.status === 'assigned';
    if (filter === 'in-progress') return task.status === 'in-progress';
    if (filter === 'completed') return task.status === 'completed' || task.status === 'closed';
    return true;
  });

  const getFilterCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter(t => t.status === 'pending' || t.status === 'assigned').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed' || t.status === 'closed').length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assigned Tasks</h1>
        <p className="text-gray-600">Monitor and manage tasks assigned to workers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
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
            { key: 'in-progress', label: 'In Progress', count: counts['in-progress'] },
            { key: 'completed', label: 'Completed', count: counts.completed },
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

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Tasks Assigned' : `No ${filter} Tasks`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No tasks have been assigned to workers yet'
                  : `No tasks with ${filter} status found`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {task.post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1 ml-4">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="ml-1">{task.status.replace('-', ' ')}</span>
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {task.assignedTo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.assignedTo.name}</p>
                    <p className="text-xs text-gray-600">{task.assignedTo.designation}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{task.post.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Assigned: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                  {task.completionDate && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Completed: {new Date(task.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {task.workerRemarks && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Worker Remarks:</p>
                    <p className="text-sm text-blue-800">{task.workerRemarks}</p>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Category: {task.post.category}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(task)}
                    >
                      View Details
                    </Button>
                    {task.status === 'completed' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleReview(task)}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                <Button variant="ghost" size="sm" onClick={closeDetailsModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                {/* Task Title */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTask.post.title}</h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>

                {/* Task Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{selectedTask.post.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Assigned to:</span>
                      <span className="text-sm font-medium">{selectedTask.assignedTo.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Assigned Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {selectedTask.completionDate && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Completed:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedTask.completionDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge className="ml-2 bg-blue-100 text-blue-800">
                        {selectedTask.post.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge className={`ml-2 ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedTask.status)}`}>
                        {getStatusText(selectedTask.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                {selectedTask.instructions && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions</h4>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {selectedTask.instructions}
                    </p>
                  </div>
                )}

                {/* Worker Remarks */}
                {selectedTask.workerRemarks && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Worker Remarks</h4>
                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                      {selectedTask.workerRemarks}
                    </p>
                  </div>
                )}

                {/* Work Proof */}
                {selectedTask.workProof && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Work Proof (Google Drive)</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Google Drive Link:</strong>
                      </p>
                      <a 
                        href={selectedTask.workProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                      >
                        📎 {selectedTask.workProof}
                      </a>
                    </div>
                  </div>
                )}

                {/* Official Remarks */}
                {selectedTask.officialRemarks && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Official Review</h4>
                    <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                      {selectedTask.officialRemarks}
                    </p>
                  </div>
                )}

                {/* Worker Information */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Assigned Worker</h4>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedTask.assignedTo.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedTask.assignedTo.name}</p>
                      <p className="text-xs text-gray-500">{selectedTask.assignedTo.designation}</p>
                      <p className="text-xs text-gray-500">{selectedTask.assignedTo.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeDetailsModal}>
                  Close
                </Button>
                {selectedTask.status === 'completed' && (
                  <Button 
                    onClick={() => {
                      closeDetailsModal();
                      handleReview(selectedTask);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Review Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Task Modal */}
      {showReviewModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Review Task</h2>
                <Button variant="ghost" size="sm" onClick={closeReviewModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Task</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{selectedTask.post.title}</h4>
                    <p className="text-sm text-gray-600">{selectedTask.description}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Worker</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedTask.assignedTo.name}</p>
                    <p className="text-sm text-gray-600">{selectedTask.assignedTo.designation}</p>
                  </div>
                </div>

                {selectedTask.workerRemarks && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Worker Remarks</label>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">{selectedTask.workerRemarks}</p>
                    </div>
                  </div>
                )}

                {selectedTask.workProof && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Work Proof (Google Drive)</label>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Google Drive Link:</strong>
                      </p>
                      <a 
                        href={selectedTask.workProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all text-sm"
                      >
                        📎 {selectedTask.workProof}
                      </a>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Review Remarks</label>
                  <textarea
                    value={reviewRemarks}
                    onChange={(e) => setReviewRemarks(e.target.value)}
                    placeholder="Provide your review and feedback on the completed task..."
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={closeReviewModal}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReview}
                  disabled={reviewing || !reviewRemarks.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {reviewing ? 'Reviewing...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
