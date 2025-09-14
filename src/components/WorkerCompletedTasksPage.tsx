import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  workProof?: string;
  createdAt: string;
  completionDate?: string;
  updatedAt: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const WorkerCompletedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Filter for completed tasks
        const completedTasks = data.filter((task: Task) => 
          task.status === 'completed' || task.status === 'reviewed' || task.status === 'closed'
        );
        setTasks(completedTasks);
      }
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load completed tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      case 'completed': return 'bg-green-600 text-white';
      case 'reviewed': return 'bg-purple-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
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
          <p className="mt-2 text-gray-600">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 text-white px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Completed Tasks</h1>
              <p className="text-green-100 text-base">Your completed work history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-green-700">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{tasks.filter(t => t.status === 'reviewed').length}</div>
              <div className="text-sm text-purple-700">Under Review</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{tasks.filter(t => t.status === 'closed').length}</div>
              <div className="text-sm text-gray-700">Closed</div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Tasks */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Completed Tasks</CardTitle>
            <CardDescription>Your completed work history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📋</div>
                  <p>No completed tasks yet</p>
                  <p className="text-sm text-gray-400 mt-2">Complete some tasks to see them here</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">{task.post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        
                        {task.workerRemarks && (
                          <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-green-800">
                              <strong>Your Remarks:</strong> {task.workerRemarks}
                            </p>
                          </div>
                        )}

                        {task.workProof && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Work Proof (Google Drive):</strong> 
                              <a 
                                href={task.workProof} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                📎 View Google Drive Proof
                              </a>
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>📍 {task.post.location}</span>
                          <span>👤 {task.post.author?.name || 'Unknown'}</span>
                          <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                          {task.completionDate && (
                            <span>✅ Completed: {new Date(task.completionDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </Badge>
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
