import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Task {
  _id: string;
  post: {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    location: string;
    author: {
      name: string;
      email: string;
    };
  };
  status: string;
  priority: string;
  description: string;
  instructions: string;
  workerRemarks: string;
  createdAt: string;
  completionDate?: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const WorkerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { user, token, logout } = useAuth();
  const { toast } = useToast();

  const [updateData, setUpdateData] = useState({
    status: '',
    workerRemarks: '',
    workProof: ''
  });

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
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
        setShowUpdateModal(false);
        setSelectedTask(null);
        setUpdateData({ status: '', workerRemarks: '', workProof: '' });
        fetchTasks();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
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
      case 'assigned': return 'bg-blue-600 text-white';
      case 'in-progress': return 'bg-orange-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'reviewed': return 'bg-purple-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'reviewed': return 'Under Review';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
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
                <span className="text-2xl">👷</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Worker Dashboard</h1>
                <p className="text-orange-100 text-base">{user?.department} Department • {user?.designation}</p>
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
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'assigned').length}</div>
              <div className="text-sm text-blue-700">Assigned</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-sm text-orange-700">In Progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-green-700">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* My Tasks */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">My Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📋</div>
                  <p>No tasks assigned yet</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{task.post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        {task.instructions && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Instructions:</strong> {task.instructions}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>📍 {task.post.location}</span>
                          <span>👤 {task.post.author?.name || 'Unknown'}</span>
                          <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        {task.workerRemarks && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Your Remarks:</strong> {task.workerRemarks}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </Badge>
                        {task.status !== 'closed' && (
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedTask(task);
                              setUpdateData({
                                status: task.status,
                                workerRemarks: task.workerRemarks,
                                workProof: ''
                              });
                              setShowUpdateModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Task Modal */}
      {showUpdateModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Update Task</CardTitle>
              <CardDescription>Update task status and add remarks</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Task</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{selectedTask.post.title}</h4>
                    <p className="text-sm text-gray-600">{selectedTask.description}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Work Remarks</label>
                  <Textarea
                    value={updateData.workerRemarks}
                    onChange={(e) => setUpdateData({ ...updateData, workerRemarks: e.target.value })}
                    placeholder="Describe the work done, any issues encountered, or additional details..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Work Proof (Optional)</label>
                  <Textarea
                    value={updateData.workProof}
                    onChange={(e) => setUpdateData({ ...updateData, workProof: e.target.value })}
                    placeholder="Add links to photos, documents, or other proof of work completed..."
                    rows={2}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowUpdateModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Update Task</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
