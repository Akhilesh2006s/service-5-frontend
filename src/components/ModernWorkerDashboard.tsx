import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, MapPin, Hash, Camera, Video, FileText, MessageCircle, Heart, Share2, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FileUpload } from './FileUpload';
import { usePosts } from '@/contexts/PostsContext';

interface WorkerDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { posts, updatePost } = usePosts();

  // Filter posts assigned to this worker
  const assignedTasks = posts.filter(post => 
    post.assignedWorker === user.id || 
    (post.assignedTo && post.assignedTo.toLowerCase().includes(user.name.toLowerCase()))
  );

  // Mock data for additional task details (in a real app, this would come from the backend)
  const mockTasks = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: '', role: 'citizen' },
      content: 'The street lights on Main Street have been out for 3 days now. It\'s getting dangerous to walk at night. #streetlights #safety #mainstreet',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
      hashtags: ['#streetlights', '#safety', '#mainstreet'],
      location: 'Main Street, Downtown',
      status: 'assigned',
      priority: 'high',
      department: 'Public Works',
      assignedBy: 'Sarah Wilson (Government Official)',
      assignedAt: '2 hours ago',
      dueDate: 'Tomorrow',
      estimatedTime: '2-3 hours',
      likes: 12,
      comments: 5,
      shares: 3
    },
    {
      id: 2,
      user: { name: 'Sarah Wilson', avatar: '', role: 'citizen' },
      content: 'Pothole on Oak Avenue is getting bigger every day. Almost damaged my car yesterday! #potholes #roads #oakavenue',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      hashtags: ['#potholes', '#roads', '#oakavenue'],
      location: 'Oak Avenue',
      status: 'in_progress',
      priority: 'medium',
      department: 'Road Maintenance',
      assignedBy: 'Mike Johnson (Government Official)',
      assignedAt: '4 hours ago',
      dueDate: 'In 2 days',
      estimatedTime: '4-5 hours',
      likes: 8,
      comments: 2,
      shares: 1
    },
    {
      id: 3,
      user: { name: 'Mike Johnson', avatar: '', role: 'citizen' },
      content: 'Garbage collection was missed on our street this week. Trash is piling up! #garbage #sanitation #missedcollection',
      hashtags: ['#garbage', '#sanitation', '#missedcollection'],
      location: 'Pine Street',
      status: 'completed',
      priority: 'low',
      department: 'Sanitation',
      assignedBy: 'Lisa Brown (Government Official)',
      assignedAt: '1 day ago',
      completedAt: '2 hours ago',
      estimatedTime: '1-2 hours',
      likes: 15,
      comments: 8,
      shares: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
      case 'assigned': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <AlertCircle className="h-3 w-3" />;
      case 'completed': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const renderHomeFeed = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{assignedTasks.filter(t => t.status === 'assigned').length}</p>
                <p className="text-sm text-muted-foreground">Assigned Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{assignedTasks.filter(t => t.status === 'in_progress').length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{assignedTasks.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={task.user.avatar} alt={task.user.name} />
                    <AvatarFallback>{task.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{task.user.name}</p>
                    <p className="text-sm text-muted-foreground">{task.content.substring(0, 50)}...</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", getStatusColor(task.status))}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                  </Badge>
                  {task.status === 'assigned' && (
                    <Button size="sm" onClick={() => {
                      setSelectedTask(task);
                      setShowCompletionDialog(true);
                    }}>
                      Start Task
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssignedTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Assigned Tasks</h2>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {assignedTasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={task.user.avatar} alt={task.user.name} />
                    <AvatarFallback>{task.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{task.user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Assigned {task.createdAt}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{task.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.priority && (
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority} priority
                    </Badge>
                  )}
                  <Badge className={cn("text-xs", getStatusColor(task.status))}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-4">{task.content}</p>
              
              {task.mediaFiles && task.mediaFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {task.mediaFiles.map((media, index) => (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Task" className="w-full h-64 object-cover" />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-64 object-cover"
                          preload="metadata"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!task.mediaFiles && task.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img src={task.image} alt="Task" className="w-full h-64 object-cover" />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {task.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Assigned to:</p>
                  <p className="text-sm text-muted-foreground">{task.assignedTo || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Priority:</p>
                  <p className="text-sm text-muted-foreground">{task.priority || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <p className="text-sm text-muted-foreground capitalize">{task.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Created:</p>
                  <p className="text-sm text-muted-foreground">{task.createdAt}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-2" />
                    {task.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {task.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-2" />
                    {task.shares}
                  </Button>
                </div>
                {task.status === 'assigned' && (
                  <Button 
                    onClick={() => {
                      setSelectedTask(task);
                      setShowCompletionDialog(true);
                    }}
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Task
                  </Button>
                )}
                {task.status === 'in_progress' && (
                  <Button 
                    onClick={() => {
                      setSelectedTask(task);
                      setShowCompletionDialog(true);
                    }}
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCompletedWork = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Completed Work</h2>
      
      <div className="grid gap-4">
        {assignedTasks.filter(task => task.status === 'completed').map((task) => (
          <Card key={task.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={cn("text-xs", getStatusColor(task.status))}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">Completed {task.completedAt || task.createdAt}</span>
              </div>
              
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={task.user.avatar} alt={task.user.name} />
                  <AvatarFallback>{task.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium mb-2">{task.user.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{task.content}</p>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{task.location}</span>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Task completed successfully
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      Completed by: {task.completedBy || user.name}
                    </p>
                    {task.workDone && (
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Work done: {task.workDone}
                      </p>
                    )}
                    {task.timeSpent && (
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Time spent: {task.timeSpent}
                      </p>
                    )}
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
                  Create Completion Post
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
      case 'home': return renderHomeFeed();
      case 'trending': return renderHomeFeed();
      case 'assigned-tasks': return renderAssignedTasks();
      case 'completed-work': return renderCompletedWork();
      default: return renderHomeFeed();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks, locations, or citizens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {renderCurrentView()}

      {/* Task Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Completion</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskCompletionForm 
              task={selectedTask} 
              user={user}
              onClose={() => setShowCompletionDialog(false)}
              onUpdatePost={updatePost}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Task Completion Form Component
const TaskCompletionForm: React.FC<{ task: any; user: any; onClose: () => void; onUpdatePost: (id: number, updates: any) => void }> = ({ task, user, onClose, onUpdatePost }) => {
  const [completionNotes, setCompletionNotes] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the post status
    onUpdatePost(task.id, {
      status: 'completed',
      completionNotes: completionNotes,
      workDone: workDone,
      timeSpent: timeSpent,
      completedBy: user.name,
      completedAt: new Date().toISOString()
    });
    
    console.log('Completing task:', { 
      task: task.id, 
      completionNotes, 
      workDone, 
      timeSpent, 
      selectedFiles 
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-2">Task Details:</p>
        <p className="text-sm text-muted-foreground">{task.content}</p>
        <p className="text-sm text-muted-foreground mt-1">Location: {task.location}</p>
        <p className="text-sm text-muted-foreground">Priority: {task.priority}</p>
      </div>
      
      <div>
        <label className="text-sm font-medium">Work Completed</label>
        <Textarea
          placeholder="Describe what work was completed..."
          value={workDone}
          onChange={(e) => setWorkDone(e.target.value)}
          className="min-h-24"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Time Spent</label>
          <Input
            placeholder="e.g., 2 hours"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select defaultValue="completed">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Completion Notes</label>
        <Textarea
          placeholder="Any additional notes or observations..."
          value={completionNotes}
          onChange={(e) => setCompletionNotes(e.target.value)}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Add Completion Photos/Videos</label>
        <FileUpload
          onFileSelect={setSelectedFiles}
          maxFiles={5}
          maxSize={10}
          acceptedTypes={['image/*', 'video/*']}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!workDone.trim()}>
          Complete Task
        </Button>
      </div>
    </form>
  );
};
