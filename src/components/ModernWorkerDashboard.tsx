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
import { InstagramPostCard } from './InstagramPostCard';

interface WorkerDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCompletionPostDialog, setShowCompletionPostDialog] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { posts, updatePost } = usePosts();

  // Handle opening image in full screen
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Filter posts assigned to this worker
  const assignedTasks = posts.filter(post => {
    // Normalize IDs to strings for comparison
    const postAssignedTo = String(post.assignedTo || '');
    const userId = String(user.id || '');
    const userName = String(user.name || '').toLowerCase();
    const userUsername = String(user.username || '').toLowerCase();
    const postAssignedWorker = String(post.assignedWorker || '').toLowerCase();
    
    // Check if assigned to this worker by ID (exact match)
    const assignedById = postAssignedTo === userId;
    
    // Check if assigned to this worker by name (exact match or contains)
    const assignedByName = postAssignedWorker === userName || 
                          postAssignedWorker.includes(userName) ||
                          postAssignedWorker === userUsername ||
                          postAssignedWorker.includes(userUsername);
    
    // Check if assigned to this worker by username in assignedTo field
    const assignedByUsername = postAssignedTo.includes(userUsername) || 
                              postAssignedTo.includes(userName);
    
    // Check if the post status is assigned (additional safety check)
    const isAssignedStatus = post.status === 'assigned' || post.status === 'in_progress';
    
    const isAssigned = (assignedById || assignedByName || assignedByUsername) && isAssignedStatus;
    
    console.log('Worker task filtering:', {
      postId: post.id,
      postAssignedTo: post.assignedTo,
      postAssignedWorker: post.assignedWorker,
      postStatus: post.status,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      assignedById,
      assignedByName,
      assignedByUsername,
      isAssignedStatus,
      isAssigned
    });
    
    return isAssigned;
  });

  // For debugging: show all posts if no assigned tasks found
  const debugAssignedTasks = assignedTasks.length === 0 ? posts.filter(post => post.status === 'assigned' || post.status === 'in_progress') : assignedTasks;
  
  // Filter completed tasks for this worker
  const completedTasks = posts.filter(post => {
    // Normalize IDs to strings for comparison
    const postAssignedTo = String(post.assignedTo || '');
    const userId = String(user.id || '');
    const userName = String(user.name || '').toLowerCase();
    const userUsername = String(user.username || '').toLowerCase();
    const postAssignedWorker = String(post.assignedWorker || '').toLowerCase();
    
    // Check if assigned to this worker by ID (exact match)
    const assignedById = postAssignedTo === userId;
    
    // Check if assigned to this worker by name (exact match or contains)
    const assignedByName = postAssignedWorker === userName || 
                          postAssignedWorker.includes(userName) ||
                          postAssignedWorker === userUsername ||
                          postAssignedWorker.includes(userUsername);
    
    // Check if assigned to this worker by username in assignedTo field
    const assignedByUsername = postAssignedTo.includes(userUsername) || 
                              postAssignedTo.includes(userName);
    
    // Check if the post status is completed
    const isCompletedStatus = post.status === 'completed' || post.status === 'reviewed';
    
    const isCompleted = (assignedById || assignedByName || assignedByUsername) && isCompletedStatus;
    
    console.log('Worker completed task filtering:', {
      postId: post.id,
      postAssignedTo: post.assignedTo,
      postAssignedWorker: post.assignedWorker,
      postStatus: post.status,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      assignedById,
      assignedByName,
      assignedByUsername,
      isCompletedStatus,
      isCompleted
    });
    
    return isCompleted;
  });
  
  console.log('Worker Dashboard Debug:', {
    totalPosts: posts.length,
    assignedTasksCount: assignedTasks.length,
    completedTasksCount: completedTasks.length,
    debugAssignedTasksCount: debugAssignedTasks.length,
    user: user,
    allAssignedPosts: posts.filter(post => post.status === 'assigned' || post.status === 'in_progress'),
    allCompletedPosts: posts.filter(post => post.status === 'completed' || post.status === 'reviewed')
  });

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

      <div className="space-y-4">
        {debugAssignedTasks.map((task) => (
          <div key={task.id} className="relative">
            {/* Rich Post Display with Media */}
            <InstagramPostCard
              post={{
                id: String(task.id),
                user: {
                  name: task.user.name,
                  avatar: task.user.avatar || `https://ui-avatars.com/api/?name=${task.user.name}&background=random`,
                  role: task.user.role || 'citizen'
                },
                content: task.content,
                mediaFiles: task.mediaFiles || [],
                location: task.location,
                createdAt: task.createdAt,
                likes: task.likes || 0,
                comments: Array.isArray(task.comments) ? task.comments : [],
                isLiked: false
              }}
              currentUser={user}
              onLike={() => {}}
              onComment={() => {}}
              onShare={() => {}}
              onBookmark={() => {}}
              onDelete={() => {}}
            />
            
            {/* Task Status and Priority Overlay */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
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
            
            {/* Task Details Overlay */}
            <div className="absolute top-4 right-4 max-w-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 backdrop-blur-sm">
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="ml-1 font-medium text-blue-800 dark:text-blue-200">{task.assignedTo || 'Not assigned'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-1 font-medium text-blue-800 dark:text-blue-200">{task.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Button Overlay */}
            <div className="absolute bottom-4 right-4">
              {task.status === 'assigned' && (
                <Button 
                  onClick={() => {
                    setSelectedTask(task);
                    setShowCompletionDialog(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 shadow-lg"
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
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {debugAssignedTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No assigned tasks found</p>
            <p className="text-sm text-muted-foreground">
              Debug: Total posts: {posts.length}, Assigned posts: {posts.filter(post => post.status === 'assigned' || post.status === 'in_progress').length}
            </p>
            <p className="text-sm text-muted-foreground">
              User: {user.name} (ID: {user.id}, Username: {user.username})
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompletedWork = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Completed Work</h2>
      
      <div className="grid gap-4">
        {completedTasks.map((task) => (
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
                    {task.completionNotes && (
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Notes: {task.completionNotes}
                      </p>
                    )}
                  </div>
                  
                   {/* Completion Media */}
                   {task.completionMedia && task.completionMedia.length > 0 && (
                     <div className="mt-4">
                       <div className="flex items-center space-x-2 mb-3">
                         <Camera className="h-5 w-5 text-muted-foreground" />
                         <span className="text-base font-semibold">Completion Photos/Videos</span>
                       </div>
                       <div className="space-y-3">
                         {task.completionMedia.map((media: any, index: number) => {
                           console.log(`Rendering completion media ${index}:`, {
                             media,
                             url: media.url,
                             type: media.type,
                             hasUrl: !!media.url
                           });
                           
                           return (
                             <div key={index} className="relative group">
                                {media.type === 'image' && media.url ? (
                                  <div className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                                    <img
                                      src={media.url}
                                      alt={`Completion photo ${index + 1}`}
                                      className="w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                      onClick={() => handleImageClick(media.url)}
                                      onError={(e) => {
                                        console.error(`Failed to load image ${index}:`, media.url);
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                               ) : media.type === 'video' && media.url ? (
                                 <div className="w-full h-64 bg-muted rounded-lg border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                                   <div className="text-center">
                                     <div className="text-4xl mb-2">🎥</div>
                                     <p className="text-lg text-muted-foreground">Video Completion</p>
                                     <p className="text-sm text-muted-foreground mt-1">Click to view</p>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="w-full h-32 bg-red-100 rounded-lg border-2 border-red-200 flex items-center justify-center">
                                   <div className="text-center">
                                     <div className="text-2xl mb-1">❌</div>
                                     <p className="text-sm text-red-600">Media not available</p>
                                   </div>
                                 </div>
                               )}
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDetailsDialog(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowCompletionPostDialog(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Completion Post
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {completedTasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No completed tasks found</p>
            <p className="text-sm text-muted-foreground">
              Debug: Total posts: {posts.length}, Completed posts: {posts.filter(post => post.status === 'completed' || post.status === 'reviewed').length}
            </p>
            <p className="text-sm text-muted-foreground">
              User: {user.name} (ID: {user.id}, Username: {user.username})
            </p>
          </div>
        )}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Task Completion</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedTask && (
              <TaskCompletionForm 
                task={selectedTask} 
                user={user}
                onClose={() => setShowCompletionDialog(false)}
                onUpdatePost={updatePost}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedTask && (
              <TaskDetailsView 
                task={selectedTask} 
                onClose={() => setShowDetailsDialog(false)}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Create Completion Post Dialog */}
      <Dialog open={showCompletionPostDialog} onOpenChange={setShowCompletionPostDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Completion Post</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedTask && (
              <CompletionPostForm 
                task={selectedTask} 
                user={user}
                onClose={() => setShowCompletionPostDialog(false)}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Full Screen Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black/95 border-none m-0 rounded-none">
          <div className="relative w-full h-full overflow-auto">
            <div className="min-h-full min-w-full flex items-center justify-center p-4">
              <img
                src={selectedImage}
                alt="Full screen completion photo"
                className="max-w-full max-h-full object-contain cursor-pointer"
                style={{
                  maxWidth: 'calc(100vw - 2rem)',
                  maxHeight: 'calc(100vh - 2rem)',
                  width: 'auto',
                  height: 'auto'
                }}
                onClick={() => setShowImageModal(false)}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  // If image is smaller than viewport, center it
                  if (img.naturalWidth < window.innerWidth - 100 && img.naturalHeight < window.innerHeight - 100) {
                    img.style.maxWidth = 'none';
                    img.style.maxHeight = 'none';
                    img.style.width = 'auto';
                    img.style.height = 'auto';
                  }
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none z-10"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </Button>
          </div>
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
  const [uploadedMedia, setUploadedMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { uploadMediaFiles } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDone.trim()) return;
    
    setLoading(true);
    try {
      // Upload media files first
      let uploadedMediaFiles = [];
      if (selectedFiles.length > 0) {
        console.log('Uploading completion media files:', selectedFiles);
        try {
          uploadedMediaFiles = await uploadMediaFiles(selectedFiles);
          console.log('Uploaded completion media:', uploadedMediaFiles);
          
          // Debug: Check if URLs are valid
          uploadedMediaFiles.forEach((media, index) => {
            console.log(`Media ${index}:`, {
              url: media.url,
              type: media.type,
              filename: media.filename,
              isValidUrl: media.url && media.url.startsWith('http')
            });
          });
        } catch (error) {
          console.error('Error uploading media files:', error);
          // Fallback: create local URLs
          uploadedMediaFiles = selectedFiles.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            filename: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString()
          }));
          console.log('Using fallback local URLs:', uploadedMediaFiles);
        }
      }

      // Prepare completion data
      const completionData = {
        status: 'completed',
        completionNotes: completionNotes,
        workDone: workDone,
        timeSpent: timeSpent,
        completedBy: user.name,
        completedAt: new Date().toISOString(),
        completionMedia: uploadedMediaFiles, // Store uploaded media
        completionPhotos: uploadedMediaFiles.filter(media => media.type === 'image'),
        completionVideos: uploadedMediaFiles.filter(media => media.type === 'video')
      };

      // Update the post status with completion data
      await onUpdatePost(task.id, completionData);
      
      // Submit completion to backend for government dashboard
      await submitTaskCompletion(task.id, completionData);
      
      console.log('Task completed successfully:', { 
        task: task.id, 
        completionData,
        uploadedMedia: uploadedMediaFiles.length
      });
      
      onClose();
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit task completion to backend
  const submitTaskCompletion = async (taskId: number, completionData: any) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is using local authentication
      if (token && token.startsWith('local_')) {
        console.log('Task completion for local user - data saved locally');
        return;
      }
      
      // Submit to backend API
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/tasks/complete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId: taskId,
          ...completionData
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task completion submitted to backend:', result);
      } else {
        console.error('Failed to submit task completion to backend:', response.status);
      }
    } catch (error) {
      console.error('Error submitting task completion:', error);
    }
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
        
        {/* Show selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Selected Files:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-24 bg-muted rounded-lg border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🎥</div>
                        <p className="text-xs text-muted-foreground">Video</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-1 right-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={!workDone.trim() || loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Completing...
            </>
          ) : (
            'Complete Task'
          )}
        </Button>
      </div>
    </form>
  );
};

// Task Details View Component
const TaskDetailsView: React.FC<{ task: any; onClose: () => void }> = ({ task, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Task Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">ID:</span> {task.id}</p>
            <p><span className="font-medium">Status:</span> {task.status}</p>
            <p><span className="font-medium">Priority:</span> {task.priority}</p>
            <p><span className="font-medium">Location:</span> {task.location}</p>
            <p><span className="font-medium">Created:</span> {task.createdAt}</p>
            {task.completedAt && (
              <p><span className="font-medium">Completed:</span> {task.completedAt}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Assignment Details</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Assigned To:</span> {task.assignedTo || 'Not assigned'}</p>
            <p><span className="font-medium">Assigned By:</span> {task.assignedBy || 'Unknown'}</p>
            {task.assignedAt && (
              <p><span className="font-medium">Assigned At:</span> {task.assignedAt}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Task Description</h3>
        <p className="text-sm text-muted-foreground">{task.content}</p>
      </div>

      {task.mediaFiles && task.mediaFiles.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Attached Media</h3>
          <div className="grid grid-cols-2 gap-4">
            {task.mediaFiles.map((media: any, index: number) => (
              <div key={index} className="rounded-lg overflow-hidden">
                {media.type === 'image' ? (
                  <img src={media.url} alt="Task media" className="w-full h-32 object-cover" />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-32 object-cover"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {task.hashtags && task.hashtags.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {task.hashtags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

// Completion Post Form Component
const CompletionPostForm: React.FC<{ task: any; user: any; onClose: () => void }> = ({ task, user, onClose }) => {
  const [postContent, setPostContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { uploadMediaFiles } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setLoading(true);
    try {
      // Upload media files using the media service
      let uploadedMediaFiles = [];
      if (selectedFiles.length > 0) {
        console.log('Uploading completion media files:', selectedFiles);
        uploadedMediaFiles = await uploadMediaFiles(selectedFiles);
        console.log('Completion media files uploaded successfully:', uploadedMediaFiles);
      }

      // Create a completion post
      const completionPost = {
        id: Date.now(),
        user: {
          name: user.name,
          avatar: user.avatar || '',
          role: 'worker'
        },
        content: postContent,
        hashtags: ['#completed', '#workdone', `#task${task.id}`],
        location: task.location,
        status: 'completed',
        priority: task.priority,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        relatedTask: task.id,
        mediaFiles: uploadedMediaFiles
      };

      // In a real app, this would be sent to the backend
      console.log('Creating completion post:', completionPost);
      
      // Show success message
      alert('Completion post created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating completion post:', error);
      alert('Failed to create completion post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Related Task</h3>
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm"><span className="font-medium">Task ID:</span> {task.id}</p>
          <p className="text-sm"><span className="font-medium">Location:</span> {task.location}</p>
          <p className="text-sm"><span className="font-medium">Priority:</span> {task.priority}</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Post Content</label>
        <Textarea
          placeholder="Describe the work completed, challenges faced, and results achieved..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="mt-1"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Add Photos/Videos (Optional)</label>
        <div className="mt-2">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="completion-files"
          />
          <label
            htmlFor="completion-files"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Select Files
          </label>
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !postContent.trim()}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};
