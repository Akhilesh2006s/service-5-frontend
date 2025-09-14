import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Users, FileText, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';

interface DashboardStats {
  pendingIssues: number;
  completedTasks: number;
  totalWorkers: number;
  totalTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'issue' | 'task' | 'worker';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const GovernmentHomePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    pendingIssues: 0,
    completedTasks: 0,
    totalWorkers: 0,
    totalTasks: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      const posts = postsRes.ok ? await postsRes.json() : [];
      const tasks = tasksRes.ok ? await tasksRes.json() : [];
      const workers = workersRes.ok ? await workersRes.json() : [];

      // Calculate stats
      const pendingIssues = posts.filter((post: any) => post.status === 'pending').length;
      const completedTasks = tasks.filter((task: any) => task.status === 'completed' || task.status === 'closed').length;

      setStats({
        pendingIssues,
        completedTasks,
        totalWorkers: workers.length,
        totalTasks: tasks.length,
      });

      // Create recent activity
      const activity: RecentActivity[] = [];
      
      // Add recent posts
      posts.slice(0, 3).forEach((post: any) => {
        activity.push({
          id: post._id,
          type: 'issue',
          title: post.title,
          description: `New issue reported in ${post.location}`,
          timestamp: post.createdAt,
          status: post.status,
        });
      });

      // Add recent tasks
      tasks.slice(0, 2).forEach((task: any) => {
        activity.push({
          id: task._id,
          type: 'task',
          title: task.post?.title || 'Task Assignment',
          description: `Task assigned to ${task.assignedTo?.name || 'worker'}`,
          timestamp: task.createdAt,
          status: task.status,
        });
      });

      // Sort by timestamp and take latest 5
      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'issue': return <AlertCircle className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'worker': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'issue': return 'text-orange-600 bg-orange-100';
      case 'task': return 'text-blue-600 bg-blue-100';
      case 'worker': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
          Here's what's happening in your department today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Issues</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingIssues}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalWorkers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalTasks}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add Worker
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white">
              <FileText className="w-5 h-5 mr-2" />
              Assign Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-600">Activity will appear here as things happen</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Your department information and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Department</p>
                <p className="text-sm text-gray-600 capitalize">{user?.department}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Your Role</p>
                <p className="text-sm text-gray-600">{user?.designation}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
