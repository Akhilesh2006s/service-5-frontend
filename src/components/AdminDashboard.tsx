import React, { useState, useEffect } from 'react';
import { Users, FileText, BarChart3, UserPlus, Eye, CheckCircle, Clock, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [governmentOfficials, setGovernmentOfficials] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [showAddOfficialDialog, setShowAddOfficialDialog] = useState(false);
  const [newOfficial, setNewOfficial] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });

  // Mock data
  useEffect(() => {
    const mockOfficials = [
      {
        id: 1,
        name: 'Akhilesh',
        email: 'akhilesh@city.gov',
        department: 'Public Works',
        role: 'government',
        postsAssigned: 15,
        postsResolved: 12,
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@city.gov',
        department: 'Sanitation',
        role: 'government',
        postsAssigned: 8,
        postsResolved: 6,
        joinDate: '2024-03-20'
      }
    ];
    setGovernmentOfficials(mockOfficials);

    const mockPosts = [
      {
        id: 1,
        title: 'Road Repair Needed',
        content: 'Potholes on Main Street need immediate attention',
        location: 'Main Street, Downtown',
        priority: 'high',
        status: 'assigned',
        assignedTo: 'Mike Johnson',
        assignedBy: 'Akhilesh',
        createdAt: '2025-09-15',
        citizen: 'John Doe'
      },
      {
        id: 2,
        title: 'Street Light Out',
        content: 'Street light not working on Oak Avenue',
        location: 'Oak Avenue',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'Tom Wilson',
        assignedBy: 'Sarah Johnson',
        createdAt: '2025-09-14',
        citizen: 'Jane Smith'
      }
    ];
    setAllPosts(mockPosts);
  }, []);

  const handleAddOfficial = () => {
    const newOfficialData = {
      id: Date.now(),
      ...newOfficial,
      role: 'government',
      postsAssigned: 0,
      postsResolved: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setGovernmentOfficials(prev => [...prev, newOfficialData]);
    setNewOfficial({ name: '', email: '', department: '', password: '' });
    setShowAddOfficialDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalPosts = allPosts.length;
  const assignedPosts = allPosts.filter(p => p.status === 'assigned').length;
  const completedPosts = allPosts.filter(p => p.status === 'completed').length;
  const pendingPosts = allPosts.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome, {user.name}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Posts</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Assigned</p>
                  <p className="text-2xl font-semibold text-gray-900">{assignedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="officials" className="space-y-6">
          <TabsList>
            <TabsTrigger value="officials">Government Officials</TabsTrigger>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="officials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Government Officials</h2>
              <Button onClick={() => setShowAddOfficialDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Official
              </Button>
            </div>

            <div className="grid gap-6">
              {governmentOfficials.map((official) => (
                <Card key={official.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{official.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{official.name}</h3>
                          <p className="text-sm text-gray-500">{official.email}</p>
                          <p className="text-sm text-gray-500">{official.department}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Posts Assigned</p>
                            <p className="font-semibold text-blue-600">{official.postsAssigned}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Posts Resolved</p>
                            <p className="font-semibold text-green-600">{official.postsResolved}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Joined: {official.joinDate}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Posts</h2>
            
            <div className="grid gap-6">
              {allPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge className={cn("text-xs", getPriorityColor(post.priority))}>
                            {post.priority} priority
                          </Badge>
                          <Badge className={cn("text-xs", getStatusColor(post.status))}>
                            {post.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {post.content}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{post.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Citizen: {post.citizen}</span>
                          </div>
                          {post.assignedTo && (
                            <div className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4" />
                              <span>Assigned to: {post.assignedTo}</span>
                            </div>
                          )}
                          {post.assignedBy && (
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4" />
                              <span>Assigned by: {post.assignedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Posts by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{width: `${(pendingPosts/totalPosts)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-medium">{pendingPosts}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Assigned</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${(assignedPosts/totalPosts)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-medium">{assignedPosts}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${(completedPosts/totalPosts)*100}%`}}></div>
                        </div>
                        <span className="text-sm font-medium">{completedPosts}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Officials Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {governmentOfficials.map((official) => (
                      <div key={official.id} className="flex justify-between items-center">
                        <span className="text-sm">{official.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600">{official.postsResolved}</span>
                          <span className="text-sm text-gray-400">/</span>
                          <span className="text-sm text-blue-600">{official.postsAssigned}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Official Dialog */}
      <Dialog open={showAddOfficialDialog} onOpenChange={setShowAddOfficialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Government Official</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={newOfficial.name}
                onChange={(e) => setNewOfficial(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter official's name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newOfficial.email}
                onChange={(e) => setNewOfficial(prev => ({ ...prev, email: e.target.value }))}
                placeholder="official@city.gov"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={newOfficial.department} onValueChange={(value) => setNewOfficial(prev => ({ ...prev, department: value }))}>
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
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={newOfficial.password}
                onChange={(e) => setNewOfficial(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddOfficialDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOfficial}>
                Add Official
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};