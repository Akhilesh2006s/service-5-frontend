import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CheckCircle, AlertCircle, Clock, TrendingUp, UserPlus, Settings, FileText, MapPin, Hash, Filter, Search, Eye, Trash2, Edit, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { usePosts } from '@/contexts/PostsContext';
import { useUsers } from '@/contexts/UsersContext';

interface AdminDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { posts } = usePosts();
  const { governmentOfficials, workers, addGovernmentOfficial, addWorker } = useUsers();

  // Debug logging
  console.log('Admin Dashboard - Government Officials:', governmentOfficials);
  console.log('Admin Dashboard - Workers:', workers);
  console.log('Admin Dashboard - Current View:', currentView);

  // Calculate real analytics data from posts
  const analyticsData = {
    totalPosts: posts.length,
    solvedProblems: posts.filter(p => p.status === 'completed').length,
    pendingIssues: posts.filter(p => p.status === 'pending').length,
    inProgressIssues: posts.filter(p => p.status === 'assigned' || p.status === 'in_progress').length,
    totalUsers: governmentOfficials.length + workers.length + posts.filter(p => p.user.role === 'citizen').length,
    governmentOfficials: governmentOfficials.length,
    workers: workers.length,
    citizens: posts.filter(p => p.user.role === 'citizen').length
  };

  // Create government official
  const createGovernmentOfficial = async (userData: any) => {
    try {
      addGovernmentOfficial(userData);
      return true;
    } catch (error) {
      console.error('Error creating government official:', error);
      return false;
    }
  };

  // Create worker
  const createWorker = async (workerData: any) => {
    try {
      addWorker(workerData);
      return true;
    } catch (error) {
      console.error('Error creating worker:', error);
      return false;
    }
  };

  // Calculate posts by department from real data
  const postsByDepartment = [
    { name: 'Public Works', posts: posts.filter(p => p.department === 'Public Works').length, solved: posts.filter(p => p.department === 'Public Works' && p.status === 'completed').length, pending: posts.filter(p => p.department === 'Public Works' && p.status === 'pending').length },
    { name: 'Road Maintenance', posts: posts.filter(p => p.department === 'Road Maintenance').length, solved: posts.filter(p => p.department === 'Road Maintenance' && p.status === 'completed').length, pending: posts.filter(p => p.department === 'Road Maintenance' && p.status === 'pending').length },
    { name: 'Sanitation', posts: posts.filter(p => p.department === 'Sanitation').length, solved: posts.filter(p => p.department === 'Sanitation' && p.status === 'completed').length, pending: posts.filter(p => p.department === 'Sanitation' && p.status === 'pending').length },
    { name: 'Parks & Recreation', posts: posts.filter(p => p.department === 'Parks & Recreation').length, solved: posts.filter(p => p.department === 'Parks & Recreation' && p.status === 'completed').length, pending: posts.filter(p => p.department === 'Parks & Recreation' && p.status === 'pending').length },
    { name: 'Utilities', posts: posts.filter(p => p.department === 'Utilities').length, solved: posts.filter(p => p.department === 'Utilities' && p.status === 'completed').length, pending: posts.filter(p => p.department === 'Utilities' && p.status === 'pending').length }
  ];

  const postsByStatus = [
    { name: 'Completed', value: posts.filter(p => p.status === 'completed').length, color: '#10b981' },
    { name: 'In Progress', value: posts.filter(p => p.status === 'assigned' || p.status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Pending', value: posts.filter(p => p.status === 'pending').length, color: '#ef4444' }
  ];

  const monthlyTrends = [
    { month: 'Jan', posts: 89, solved: 67 },
    { month: 'Feb', posts: 95, solved: 72 },
    { month: 'Mar', posts: 112, solved: 85 },
    { month: 'Apr', posts: 98, solved: 78 },
    { month: 'May', posts: 105, solved: 89 },
    { month: 'Jun', posts: 118, solved: 95 }
  ];

  const mockUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'government_official', department: 'Public Works', status: 'active', avatar: '' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'worker', department: 'Road Maintenance', status: 'active', avatar: '' },
    { id: 3, name: 'Mike Davis', email: 'mike@example.com', role: 'citizen', department: null, status: 'active', avatar: '' },
    { id: 4, name: 'Lisa Wilson', email: 'lisa@example.com', role: 'government_official', department: 'Sanitation', status: 'inactive', avatar: '' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'citizen': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'government_official': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'worker': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.totalPosts}</p>
                <p className="text-sm text-muted-foreground">Total Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.solvedProblems}</p>
                <p className="text-sm text-muted-foreground">Solved Problems</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.pendingIssues}</p>
                <p className="text-sm text-muted-foreground">Pending Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analyticsData.totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solved" fill="#10b981" name="Solved" />
                <Bar dataKey="pending" fill="#ef4444" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={postsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {postsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="posts" stroke="#3b82f6" name="Total Posts" />
              <Line type="monotone" dataKey="solved" stroke="#10b981" name="Solved" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderManageOfficials = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Government Officials</h2>
        <Button onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Official
        </Button>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-4">
        <p className="text-sm font-medium">Debug Info:</p>
        <p className="text-xs">Government Officials Count: {governmentOfficials.length}</p>
        <p className="text-xs">Workers Count: {workers.length}</p>
        <p className="text-xs">Current View: {currentView}</p>
      </div>

      <div className="grid gap-4">
        {governmentOfficials.map((official) => (
          <Card key={official.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={official.avatar} alt={official.name} />
                    <AvatarFallback>{official.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{official.name}</p>
                    <p className="text-sm text-muted-foreground">{official.email}</p>
                    <p className="text-sm text-muted-foreground">Department: {official.department}</p>
                    <p className="text-sm text-muted-foreground">Designation: {official.designation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getRoleColor(official.role))}>
                    Government Official
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(official.verified ? 'active' : 'inactive'))}>
                    {official.verified ? 'Active' : 'Inactive'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderManageWorkers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Workers</h2>
        <Button onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Worker
        </Button>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-4">
        <p className="text-sm font-medium">Debug Info:</p>
        <p className="text-xs">Government Officials Count: {governmentOfficials.length}</p>
        <p className="text-xs">Workers Count: {workers.length}</p>
        <p className="text-xs">Current View: {currentView}</p>
      </div>

      <div className="grid gap-4">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={worker.avatar} alt={worker.name} />
                    <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-muted-foreground">{worker.email}</p>
                    <p className="text-sm text-muted-foreground">Department: {worker.department}</p>
                    <p className="text-sm text-muted-foreground">Designation: {worker.designation}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{worker.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getRoleColor(worker.role))}>
                    Worker
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(worker.status))}>
                    {worker.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return renderAnalytics();
      case 'trending': return renderAnalytics();
      case 'analytics': return renderAnalytics();
      case 'manage-officials': return renderManageOfficials();
      case 'manage-workers': return renderManageWorkers();
      default: return renderAnalytics();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, departments, or analytics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {renderCurrentView()}

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <AddUserForm 
              onClose={() => setShowAddUserDialog(false)} 
              onCreateUser={async (userData) => {
                if (userData.role === 'government') {
                  return await createGovernmentOfficial(userData);
                } else if (userData.role === 'worker') {
                  return await createWorker(userData);
                }
                return false;
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add User Form Component
const AddUserForm: React.FC<{ onClose: () => void; onCreateUser: (userData: any) => Promise<boolean> }> = ({ onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    designation: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await onCreateUser(formData);
      if (success) {
        alert(`${formData.role === 'government' ? 'Government Official' : 'Worker'} created successfully!`);
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          role: '',
          department: '',
          designation: '',
          phone: '',
          password: ''
        });
      } else {
        alert('Failed to create user. Please try again.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <Input
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Role</label>
        <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="government">Government Official</SelectItem>
            <SelectItem value="worker">Worker</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.role && (formData.role === 'government' || formData.role === 'worker') && (
        <>
          <div>
            <label className="text-sm font-medium">Department</label>
            <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public Works">Public Works</SelectItem>
                <SelectItem value="Road Maintenance">Road Maintenance</SelectItem>
                <SelectItem value="Sanitation">Sanitation</SelectItem>
                <SelectItem value="Parks & Recreation">Parks & Recreation</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Designation</label>
            <Input
              placeholder="e.g., Senior Officer, Field Supervisor"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              placeholder="+1-555-0123"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </>
      )}
      
      <div>
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !formData.name || !formData.email || !formData.role || !formData.password}>
          {loading ? 'Creating...' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

