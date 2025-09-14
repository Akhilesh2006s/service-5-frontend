import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Task {
  _id: string;
  post: Post;
  assignedTo: {
    name: string;
    email: string;
  };
  status: string;
  priority: string;
  description: string;
  createdAt: string;
}

interface Worker {
  _id: string;
  name: string;
  email: string;
  designation: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const GovernmentOfficialDashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWorker, setShowCreateWorker] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { user, token, logout } = useAuth();
  const { toast } = useToast();

  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    password: '',
    designation: ''
  });

  const [newTask, setNewTask] = useState({
    assignedTo: '',
    description: '',
    instructions: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, tasksRes, workersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/posts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/tasks/workers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (postsRes.ok) setPosts(await postsRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (workersRes.ok) setWorkers(await workersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/workers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newWorker,
          department: user?.department
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Worker created successfully",
        });
        setShowCreateWorker(false);
        setNewWorker({ name: '', email: '', password: '', designation: '' });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create worker",
        variant: "destructive",
      });
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: selectedPost._id,
          ...newTask
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task assigned successfully",
        });
        setShowAssignTask(false);
        setSelectedPost(null);
        setNewTask({ assignedTo: '', description: '', instructions: '', priority: 'medium' });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
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
      case 'completed': return 'bg-green-600 text-white';
      case 'closed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👔</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Government Official Dashboard</h1>
                <p className="text-blue-100 text-base">{user?.department} Department • {user?.designation}</p>
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
              <div className="text-2xl font-bold text-blue-600">{posts.filter(p => p.status === 'pending').length}</div>
              <div className="text-sm text-blue-700">Pending Issues</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-green-700">Completed Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{workers.length}</div>
              <div className="text-sm text-purple-700">Workers</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Manage workers and assign tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowCreateWorker(true)}
                className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                + Add Worker
              </Button>
              <Button 
                onClick={() => setShowAssignTask(true)}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl"
              >
                📋 Assign Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Issues */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Pending Issues</CardTitle>
            <CardDescription>Citizen complaints requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.filter(p => p.status === 'pending').map((post) => (
                <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📍 {post.location}</span>
                        <span>👤 {post.author.name}</span>
                        <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={`text-xs px-2 py-1 ${getPriorityColor(post.priority)}`}>
                        {post.priority.toUpperCase()}
                      </Badge>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedPost(post);
                          setShowAssignTask(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Assign Task
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Tasks */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Assigned Tasks</CardTitle>
            <CardDescription>Tasks assigned to workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">{task.post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👷 {task.assignedTo.name}</span>
                        <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={`text-xs px-2 py-1 ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Worker Modal */}
      {showCreateWorker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Worker</CardTitle>
              <CardDescription>Create a new worker for your department</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateWorker} className="space-y-4">
                <div>
                  <Label htmlFor="worker-name">Full Name</Label>
                  <Input
                    id="worker-name"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="worker-email">Email</Label>
                  <Input
                    id="worker-email"
                    type="email"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="worker-password">Password</Label>
                  <Input
                    id="worker-password"
                    type="password"
                    value={newWorker.password}
                    onChange={(e) => setNewWorker({ ...newWorker, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="worker-designation">Designation</Label>
                  <Input
                    id="worker-designation"
                    value={newWorker.designation}
                    onChange={(e) => setNewWorker({ ...newWorker, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateWorker(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Create</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTask && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Assign Task</CardTitle>
              <CardDescription>Assign this issue to a worker</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignTask} className="space-y-4">
                <div>
                  <Label>Issue</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{selectedPost.title}</h4>
                    <p className="text-sm text-gray-600">{selectedPost.description}</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="task-worker">Assign to Worker</Label>
                  <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker._id} value={worker._id}>{worker.name} - {worker.designation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="task-desc">Task Description</Label>
                  <Textarea
                    id="task-desc"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="task-instructions">Instructions</Label>
                  <Textarea
                    id="task-instructions"
                    value={newTask.instructions}
                    onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAssignTask(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Assign</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
