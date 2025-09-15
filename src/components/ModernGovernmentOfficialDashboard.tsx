import React, { useState } from 'react';
import { Users, CheckCircle, AlertCircle, Clock, MapPin, Hash, Filter, Search, UserPlus, FileText, BarChart3, MessageCircle, Heart, Share2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { usePosts } from '@/contexts/PostsContext';

interface GovernmentOfficialDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const GovernmentOfficialDashboard: React.FC<GovernmentOfficialDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { posts, updatePost } = usePosts();

  const mockWorkers = [
    { id: 1, name: 'Mike Johnson', department: 'Road Maintenance', status: 'available', avatar: '' },
    { id: 2, name: 'Sarah Davis', department: 'Sanitation', status: 'busy', avatar: '' },
    { id: 3, name: 'Tom Wilson', department: 'Public Works', status: 'available', avatar: '' },
    { id: 4, name: 'Lisa Brown', department: 'Public Works', status: 'available', avatar: '' }
  ];

  const departments = ['Public Works', 'Road Maintenance', 'Sanitation', 'Parks & Recreation', 'Utilities'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'assigned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      case 'assigned': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <AlertCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const renderDepartmentFeed = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Department Feed</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getPriorityColor(post.priority))}>
                    {post.priority} priority
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(post.status))}>
                    {getStatusIcon(post.status)}
                    <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-4">{post.content}</p>
              
              {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-2" />
                    {post.shares}
                  </Button>
                </div>
                {post.status === 'pending' && (
                  <Button 
                    onClick={() => {
                      setSelectedPost(post);
                      setShowAssignDialog(true);
                    }}
                    size="sm"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAssignTasks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assign Tasks</h2>
      
      <div className="grid gap-4">
        {posts.filter(post => post.status === 'pending').map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getPriorityColor(post.priority))}>
                    {post.priority} priority
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(post.status))}>
                    {getStatusIcon(post.status)}
                    <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{post.createdAt}</span>
              </div>
              
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium mb-2">{post.user.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => {
                    setSelectedPost(post);
                    setShowAssignDialog(true);
                  }}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Worker
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReviewWork = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Work</h2>
      
      <div className="grid gap-4">
        {posts.filter(post => post.status === 'completed').map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={cn("text-xs", getStatusColor(post.status))}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">{post.createdAt}</span>
              </div>
              
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium mb-2">{post.user.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{post.content}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{post.location}</span>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Completed by: {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return renderDepartmentFeed();
      case 'trending': return renderDepartmentFeed();
      case 'department-feed': return renderDepartmentFeed();
      case 'assign-tasks': return renderAssignTasks();
      case 'review-work': return renderReviewWork();
      default: return renderDepartmentFeed();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, workers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {renderCurrentView()}

      {/* Assign Worker Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <AssignWorkerForm 
              post={selectedPost} 
              workers={mockWorkers}
              onClose={() => setShowAssignDialog(false)}
              onUpdatePost={updatePost}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Assign Worker Form Component
const AssignWorkerForm: React.FC<{ post: any; workers: any[]; onClose: () => void; onUpdatePost: (id: number, updates: any) => void }> = ({ post, workers, onClose, onUpdatePost }) => {
  const [selectedWorker, setSelectedWorker] = useState('none');
  const [priority, setPriority] = useState(post.priority);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedWorkerData = workers.find(w => w.id === selectedWorker);
    onUpdatePost(post.id, {
      status: 'assigned',
      assignedTo: selectedWorkerData?.name,
      assignedWorker: selectedWorker,
      priority: priority,
      notes: notes
    });
    console.log('Assigning worker:', { post: post.id, worker: selectedWorker, priority, notes });
    onClose();
  };

  const availableWorkers = workers.filter(worker => 
    worker.department === post.department && worker.status === 'available'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-2">Issue Details:</p>
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <p className="text-sm text-muted-foreground mt-1">Location: {post.location}</p>
      </div>
      
      <div>
        <label className="text-sm font-medium">Select Worker</label>
        <Select value={selectedWorker} onValueChange={setSelectedWorker}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a worker" />
          </SelectTrigger>
           <SelectContent>
             <SelectItem value="none">Choose a worker</SelectItem>
             {availableWorkers.map((worker) => (
               <SelectItem key={worker.id} value={worker.id}>
                 {worker.name} - {worker.department}
               </SelectItem>
             ))}
           </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Priority</label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea
          placeholder="Add any specific instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
         <Button type="submit" disabled={!selectedWorker || selectedWorker === 'none'}>
           Assign Task
         </Button>
      </div>
    </form>
  );
};
