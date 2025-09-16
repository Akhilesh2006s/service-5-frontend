import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, AlertCircle, Clock, MapPin, Hash, Filter, Search, UserPlus, FileText, BarChart3, MessageCircle, Heart, Share2, MoreVertical, Edit, Eye, MessageSquare, Plus, Trash2, Mail, Phone, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePosts } from '@/contexts/PostsContext';
import { useUsers } from '@/contexts/UsersContext';
import { InstagramPostCard } from './InstagramPostCard';

interface GovernmentOfficialDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const GovernmentOfficialDashboard: React.FC<GovernmentOfficialDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showAddWorkerDialog, setShowAddWorkerDialog] = useState(false);
  const [showReviewDetailsDialog, setShowReviewDetailsDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { posts, updatePost, likePost, addComment, refreshPosts, deletePost } = usePosts();

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId: string, comment: string) => {
    try {
      await addComment(postId, comment);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSharePost = (postId: string) => {
    console.log('Sharing post:', postId);
  };

  const handleBookmarkPost = (postId: string) => {
    console.log('Bookmarking post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    try {
      deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  
  // Debug posts data
  useEffect(() => {
    console.log('GovernmentOfficialDashboard - Posts loaded:', posts.length);
    posts.forEach(post => {
      if (post.status === 'completed') {
        console.log('Completed post:', post.id, {
          workDone: post.workDone,
          timeSpent: post.timeSpent,
          completedBy: post.completedBy,
          completionNotes: post.completionNotes
        });
      }
    });
  }, [posts]);
  const { workers: contextWorkers, addWorker } = useUsers();

  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    assignedPosts: 0,
    completedPosts: 0,
    pendingPosts: 0,
    totalWorkers: 0,
    activeWorkers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const departments = ['Public Works', 'Road Maintenance', 'Sanitation', 'Parks & Recreation', 'Utilities'];

  // Fetch workers and tasks on component mount
  useEffect(() => {
    fetchWorkers();
    fetchTasks();
  }, []);

  // Fetch tasks from backend or use posts as tasks for local users
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is using local authentication
      if (token && token.startsWith('local_')) {
        // For local users, use posts as tasks (since posts represent issues/tasks)
        console.log('Using posts as tasks for local user:', posts);
        const tasksFromPosts = posts.map(post => ({
          id: post.id,
          title: post.content.substring(0, 50) + '...',
          description: post.content,
          status: post.status,
          assignedTo: post.assignedTo || 'Unassigned',
          priority: post.priority || 'medium',
          location: post.location,
          createdAt: post.createdAt,
          updatedAt: post.createdAt,
          department: post.department || 'General'
        }));
        setTasks(tasksFromPosts);
        console.log('Tasks created from posts for local user:', tasksFromPosts);
        return;
      }
      
      // Use backend API for authenticated users
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
        console.log('Tasks fetched from backend:', tasksData);
      } else {
        console.error('Failed to fetch tasks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Calculate statistics
  useEffect(() => {
    const stats = {
      totalPosts: posts.length,
      assignedPosts: posts.filter(p => p.status === 'assigned').length,
      completedPosts: posts.filter(p => p.status === 'completed').length,
      pendingPosts: posts.filter(p => p.status === 'pending').length,
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'available').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed' || t.status === 'closed').length,
      pendingTasks: tasks.filter(t => t.status === 'assigned' || t.status === 'in-progress').length
    };
    setStatistics(stats);
  }, [posts, workers, tasks]);

  // Update workers when contextWorkers changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('local_')) {
      setWorkers(contextWorkers);
    }
  }, [contextWorkers]);

  // Update tasks when posts change for local users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token.startsWith('local_')) {
      const tasksFromPosts = posts.map(post => ({
        id: post.id,
        title: post.content.substring(0, 50) + '...',
        description: post.content,
        status: post.status,
        assignedTo: post.assignedTo || 'Unassigned',
        priority: post.priority || 'medium',
        location: post.location,
        createdAt: post.createdAt,
        updatedAt: post.createdAt,
        department: post.department || 'General'
      }));
      setTasks(tasksFromPosts);
    }
  }, [posts]);

  // Fetch workers from backend
  const fetchWorkers = async () => {
    setWorkersLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is using local authentication
      if (token && token.startsWith('local_')) {
        // Use context workers for local users
        console.log('Using context workers for local user:', contextWorkers);
        setWorkers(contextWorkers);
        setWorkersLoading(false);
        return;
      }
      
      // Use backend API for authenticated users
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/workers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const workersData = await response.json();
        setWorkers(workersData);
        console.log('Workers fetched from backend:', workersData);
        console.log('Backend workers length:', workersData.length);
      } else {
        console.error('Failed to fetch workers:', response.status);
        console.error('Response status text:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setWorkersLoading(false);
    }
  };

  // Add worker to backend
  const handleAddWorker = async (newWorker: any) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is using local authentication
      if (token && token.startsWith('local_')) {
        // Use UsersContext for local users
        console.log('Adding worker via UsersContext:', newWorker);
        addWorker(newWorker);
        console.log('Worker added successfully via UsersContext');
        return;
      }
      
      // Use backend API for authenticated users
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/workers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWorker)
      });
      
      if (response.ok) {
        const createdWorker = await response.json();
        setWorkers(prev => [...prev, createdWorker]);
        console.log('Worker created successfully:', createdWorker);
      } else {
        const errorData = await response.json();
        console.error('Failed to create worker:', response.status, errorData);
        throw new Error(`Failed to create worker: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating worker:', error);
      throw error;
    }
  };

  // Create task
  const createTask = async (taskData: any) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if user is using local authentication
      if (token && token.startsWith('local_')) {
        // For local users, create a mock task and update post locally
        console.log('Creating task for local user:', taskData);
        const newTask = {
          id: Date.now(),
          ...taskData,
          status: 'assigned',
          createdAt: new Date().toISOString(),
          assignedBy: user?.name || 'Government Official'
        };
        setTasks(prev => [...prev, newTask]);
        console.log('Task created successfully for local user:', newTask);
        return true;
      }
      
      // Use backend API for authenticated users
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
        console.log('Task created successfully:', newTask);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Failed to create task:', response.status, errorData);
        return false;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  };

  // Delete worker from backend
  const handleDeleteWorker = async (workerId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://service-5-backend-production.up.railway.app/api/workers/${workerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setWorkers(prev => prev.filter(worker => worker.id !== workerId));
        console.log('Worker deleted successfully');
      } else {
        console.error('Failed to delete worker:', response.status);
      }
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  };

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
          <InstagramPostCard
            key={post.id}
            post={{
              id: post.id,
              user: {
                name: post.user.name,
                avatar: post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.name}&background=random`,
                role: post.user.role || 'citizen'
              },
              content: post.content,
              mediaFiles: post.mediaFiles || [],
              location: post.location,
              createdAt: post.createdAt,
              likes: post.likes || 0,
              comments: post.comments || [],
              isLiked: false
            }}
            currentUser={user}
            onLike={handleLikePost}
            onComment={handleAddComment}
            onShare={handleSharePost}
            onBookmark={handleBookmarkPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
    </div>
  );

  const renderAssignTasks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assign Tasks</h2>
      
      <div className="grid gap-4">
        {posts.filter(post => post.status === 'pending' || post.status === 'assigned').map((post) => (
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
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-4">{post.content}</p>
              
              {/* Render media files */}
              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {post.mediaFiles.map((media: any, index: number) => {
                    console.log('Rendering media:', index, media);
                    return (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt={`Post media ${index + 1}`} 
                          className="w-full h-64 object-cover"
                          onLoad={() => console.log('Image loaded successfully:', media.url)}
                          onError={(e) => {
                            console.error('Error loading image:', media.url);
                            console.log('Media object:', media);
                            console.log('Has base64Data:', !!media.base64Data);
                            console.log('Has fallbackImage:', !!media.fallbackImage);
                            // Try base64 fallback if available
                            if (media.base64Data) {
                              console.log('Using base64 fallback for image');
                              (e.target as HTMLImageElement).src = media.base64Data;
                            } else if (media.fallbackImage) {
                              console.log('Using fallback placeholder for image');
                              (e.target as HTMLImageElement).src = media.fallbackImage;
                            } else {
                              console.log('No fallback available, hiding image');
                              (e.target as HTMLImageElement).style.display = 'none';
                            }
                          }}
                        />
                      ) : media.type === 'video' ? (
                        <video 
                          src={media.url} 
                          className="w-full h-64 object-cover"
                          controls
                          onLoadStart={() => console.log('Video loading started:', media.url)}
                          onError={(e) => {
                            console.error('Error loading video:', media.url);
                            console.log('Video media object:', media);
                            console.log('Has base64Data:', !!media.base64Data);
                            console.log('Has fallbackImage:', !!media.fallbackImage);
                            // Try base64 fallback if available
                            if (media.base64Data) {
                              console.log('Using base64 fallback for video');
                              (e.target as HTMLVideoElement).src = media.base64Data;
                            } else if (media.fallbackImage) {
                              console.log('Using fallback placeholder for video');
                              // For videos, we'll show the fallback image instead
                              const videoElement = e.target as HTMLVideoElement;
                              const parentDiv = videoElement.parentElement;
                              if (parentDiv) {
                                parentDiv.innerHTML = `<img src="${media.fallbackImage}" alt="Video not available" class="w-full h-64 object-cover" />`;
                              }
                            } else {
                              console.log('No fallback available, hiding video');
                              (e.target as HTMLVideoElement).style.display = 'none';
                            }
                          }}
                        />
                      ) : (
                        <div>Unknown media type: {media.type}</div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
              
              {/* Fallback for old image format */}
              {post.image && !post.mediaFiles && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-64 object-cover"
                    onLoad={() => console.log('Fallback image loaded successfully:', post.image)}
                    onError={(e) => {
                      console.error('Error loading fallback image:', post.image);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
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
              
              {/* Assignment Details */}
              {post.status === 'assigned' && post.assignedTo && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Assignment Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                        {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}
                      </span>
                    </div>
                    {post.assignedBy && (
                      <div>
                        <span className="text-muted-foreground">Assigned by:</span>
                        <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">{post.assignedBy}</span>
                      </div>
                    )}
                    {post.assignedAt && (
                      <div>
                        <span className="text-muted-foreground">Assigned on:</span>
                        <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                          {new Date(post.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {post.priority && (
                      <div>
                        <span className="text-muted-foreground">Priority:</span>
                        <span className="ml-2 font-medium text-blue-800 dark:text-blue-200 capitalize">{post.priority}</span>
                      </div>
                    )}
                  </div>
                  {post.notes && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span className="text-muted-foreground text-sm">Notes:</span>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">{post.notes}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => likePost(post.id)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-blue-500"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowCommentDialog(true);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-2" />
                    {post.shares}
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedPost(post);
                        setShowAssignDialog(true);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Worker
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedPost(post);
                        setShowStatusDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Status
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setSelectedPost(post);
                        setShowCommentDialog(true);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAssignTasks = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assign Tasks</h2>
      
      <div className="grid gap-4">
        {posts.filter(post => post.status === 'pending' || post.status === 'assigned').map((post) => (
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
                  
                  {/* Assignment Details for Assign Tasks view */}
                  {post.status === 'assigned' && post.assignedTo && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-1">
                        <UserPlus className="h-3 w-3 text-blue-600" />
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Assignment Details</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span className="ml-1 font-medium text-blue-800 dark:text-blue-200">
                            {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}
                          </span>
                        </div>
                        {post.assignedBy && (
                          <div>
                            <span className="text-muted-foreground">Assigned by:</span>
                            <span className="ml-1 font-medium text-blue-800 dark:text-blue-200">{post.assignedBy}</span>
                          </div>
                        )}
                        {post.assignedAt && (
                          <div>
                            <span className="text-muted-foreground">Assigned on:</span>
                            <span className="ml-1 font-medium text-blue-800 dark:text-blue-200">
                              {new Date(post.assignedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {post.notes && (
                          <div>
                            <span className="text-muted-foreground">Notes:</span>
                            <span className="ml-1 text-blue-800 dark:text-blue-200">{post.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                {post.status === 'pending' ? (
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
                ) : (
                  <Button 
                    onClick={() => {
                      setSelectedPost(post);
                      setShowAssignDialog(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Assignment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReviewWork = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Work</h2>
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
      
      <div className="grid gap-6">
        {posts.filter(post => {
          const isCompletedOrReviewed = post.status === 'completed' || post.status === 'reviewed';
          const matchesDepartment = selectedDepartment === 'all' || post.department === selectedDepartment;
          console.log('Review Work - Post:', post.id, 'Status:', post.status, 'WorkDone:', post.workDone, 'TimeSpent:', post.timeSpent, 'CompletedBy:', post.completedBy);
          return isCompletedOrReviewed && matchesDepartment;
        }).map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className={cn("text-xs", getStatusColor(post.status))}>
                    {getStatusIcon(post.status)}
                    <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                  </Badge>
                  {post.priority && (
                    <Badge variant="outline" className={cn("text-xs", 
                      post.priority === 'high' ? 'border-red-500 text-red-600' :
                      post.priority === 'medium' ? 'border-yellow-500 text-yellow-600' :
                      'border-green-500 text-green-600'
                    )}>
                      {post.priority} priority
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{post.createdAt}</span>
              </div>
              
              {/* Original Issue */}
              <div className="flex items-start space-x-4 mb-4">
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
                </div>
              </div>

              {/* Assignment Details */}
              {post.assignedWorker && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Assignment Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">{post.assignedWorker}</span>
                    </div>
                    {post.assignedBy && (
                      <div>
                        <span className="text-muted-foreground">Assigned by:</span>
                        <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">{post.assignedBy}</span>
                      </div>
                    )}
                    {post.assignedAt && (
                      <div>
                        <span className="text-muted-foreground">Assigned on:</span>
                        <span className="ml-2 font-medium text-blue-800 dark:text-blue-200">
                          {new Date(post.assignedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Details */}
              {post.workDone && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Work Completed</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Description:</p>
                      <p className="text-sm text-green-700 dark:text-green-300">{post.workDone}</p>
                    </div>
                    
                    {post.timeSpent && (
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Time Spent:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{post.timeSpent}</p>
                      </div>
                    )}
                    
                    {post.completedBy && (
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Completed by:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{post.completedBy}</p>
                      </div>
                    )}
                    
                    {post.completedAt && (
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Completed on:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {new Date(post.completedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {post.completionNotes && (
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Notes:</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{post.completionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completion Media */}
              {post.completionMedia && post.completionMedia.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Completion Photos/Videos</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {post.completionMedia.map((media: any, index: number) => (
                      <div key={index} className="relative group">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Completion photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(media.url, '_blank')}
                          />
                        ) : (
                          <div className="w-full h-24 bg-muted rounded-lg border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                            <div className="text-center">
                              <div className="text-2xl mb-1">🎥</div>
                              <p className="text-xs text-muted-foreground">Video</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(media.url, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Details for Approved Posts */}
              {post.status === 'reviewed' && post.reviewedBy && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Work Approved</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Reviewed by:</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">{post.reviewedBy}</p>
                    </div>
                    {post.reviewedAt && (
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Approved on:</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {new Date(post.reviewedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post);
                    setShowReviewDetailsDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Details
                </Button>
                {post.status === 'completed' ? (
                  <Button 
                    size="sm"
                    onClick={async () => {
                      try {
                        // Mark as reviewed/approved
                        await updatePost(post.id, {
                          status: 'reviewed',
                          reviewedBy: user.name,
                          reviewedAt: new Date().toISOString()
                        });
                        console.log('Work approved successfully for post:', post.id);
                        // You could add a toast notification here
                        alert('Work approved successfully!');
                      } catch (error) {
                        console.error('Error approving work:', error);
                        alert('Failed to approve work. Please try again.');
                      }
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    variant="secondary"
                    disabled
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {posts.filter(post => post.status === 'completed' || post.status === 'reviewed').length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No completed work to review</h3>
            <p className="text-sm text-muted-foreground">Completed tasks will appear here for your review.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderManageWorkers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Workers</h2>
        <Button onClick={() => setShowAddWorkerDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Worker
        </Button>
      </div>
      
      <div className="grid gap-4">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{worker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{worker.name}</h3>
                    <p className="text-sm text-muted-foreground">{worker.designation}</p>
                    <p className="text-sm text-muted-foreground">{worker.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{worker.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{worker.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={worker.status === 'available' ? 'default' : 'secondary'}
                      className={worker.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {worker.status === 'available' ? 'Available' : 'Busy'}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
      case 'home': return renderDepartmentFeed();
      case 'trending': return renderDepartmentFeed();
      case 'department-feed': return renderDepartmentFeed();
      case 'assign-tasks': return renderAssignTasks();
      case 'review-work': return renderReviewWork();
      case 'manage-workers': return renderManageWorkers();
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

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Workers</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalWorkers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {renderCurrentView()}

      {/* Assign Worker Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Assign Worker</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedPost && (
              <AssignWorkerForm 
                post={selectedPost} 
                workers={workers}
                onClose={() => setShowAssignDialog(false)}
                onUpdatePost={updatePost}
                user={user}
                onCreateTask={createTask}
                refreshPosts={refreshPosts}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <UpdateStatusForm 
              post={selectedPost}
              onClose={() => setShowStatusDialog(false)}
              onUpdatePost={updatePost}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <AddCommentForm 
              post={selectedPost}
              onClose={() => setShowCommentDialog(false)}
              onAddComment={addComment}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Worker Dialog */}
      <Dialog open={showAddWorkerDialog} onOpenChange={setShowAddWorkerDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            <AddWorkerForm 
              onClose={() => setShowAddWorkerDialog(false)}
              onAddWorker={handleAddWorker}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Review Work Details Dialog */}
      <Dialog open={showReviewDetailsDialog} onOpenChange={setShowReviewDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Work Review Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
            {selectedPost && (
              <WorkReviewDetails 
                post={selectedPost} 
                onClose={() => setShowReviewDetailsDialog(false)}
                onApprove={() => {
                  // Handle approval logic here
                  console.log('Approving work for post:', selectedPost.id);
                  updatePost(selectedPost.id, {
                    status: 'reviewed',
                    reviewedBy: user.name,
                    reviewedAt: new Date().toISOString()
                  });
                  setShowReviewDetailsDialog(false);
                }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Assign Worker Form Component
const AssignWorkerForm: React.FC<{ post: any; workers: any[]; onClose: () => void; onUpdatePost: (id: number, updates: any) => void; user: any; onCreateTask: (taskData: any) => Promise<boolean>; refreshPosts: () => Promise<void> }> = ({ post, workers, onClose, onUpdatePost, user, onCreateTask, refreshPosts }) => {
  const [selectedWorker, setSelectedWorker] = useState('none');
  const [priority, setPriority] = useState(post.priority || 'medium');
  const [notes, setNotes] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorker === 'none') return;
    
    setLoading(true);
    try {
      const selectedWorkerData = workers.find(w => w.id.toString() === selectedWorker);
      console.log('AssignWorkerForm - selectedWorkerData:', selectedWorkerData);
      
      // Create task in backend
      const taskData = {
        postId: post.id,
        assignedTo: selectedWorker,
        description: post.content,
        instructions: instructions,
        priority: priority
      };
      
      console.log('AssignWorkerForm - taskData:', taskData);
      console.log('AssignWorkerForm - calling onCreateTask...');
      
      const taskCreated = await onCreateTask(taskData);
      
      console.log('AssignWorkerForm - taskCreated result:', taskCreated);
      
      if (taskCreated) {
        // Update the original post to mark it as assigned
        onUpdatePost(post.id, {
          status: 'assigned',
          assignedTo: selectedWorker,
          assignedWorker: selectedWorkerData?.name || selectedWorker,
          assignedBy: user?.name || 'Government Official',
          assignedAt: new Date().toISOString(),
          priority: priority,
          instructions: instructions,
          notes: notes
        });
        
        // Refresh posts to get updated data from database
        await refreshPosts();
        console.log('Task created and worker assigned:', { post: post.id, worker: selectedWorker });
        onClose();
      } else {
        alert('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableWorkers = workers.filter(worker => 
    worker.status === 'available' || worker.status === 'active'
  );

  console.log('AssignWorkerForm - workers:', workers);
  console.log('AssignWorkerForm - availableWorkers:', availableWorkers);
  console.log('AssignWorkerForm - post:', post);
  console.log('AssignWorkerForm - workers count:', workers.length);
  console.log('AssignWorkerForm - availableWorkers count:', availableWorkers.length);
  console.log('AssignWorkerForm - workers length:', workers.length);
  console.log('AssignWorkerForm - availableWorkers length:', availableWorkers.length);

  // If task is already assigned, show assignment details
  if (post.status === 'assigned') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-2">Issue Details:</p>
          <p className="text-sm text-muted-foreground">{post.content}</p>
          <p className="text-sm text-muted-foreground mt-1">Location: {post.location}</p>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Assignment Details</span>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Assigned to:</span>
              <span className="ml-2 font-medium">{post.assignedWorker || post.assignedTo}</span>
            </div>
            {post.assignedBy && (
              <div>
                <span className="text-muted-foreground">Assigned by:</span>
                <span className="ml-2 font-medium">{post.assignedBy}</span>
              </div>
            )}
            {post.assignedAt && (
              <div>
                <span className="text-muted-foreground">Assigned at:</span>
                <span className="ml-2 font-medium">{new Date(post.assignedAt).toLocaleString()}</span>
              </div>
            )}
            {post.priority && (
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-2 font-medium capitalize">{post.priority}</span>
              </div>
            )}
            {post.instructions && (
              <div>
                <span className="text-muted-foreground">Instructions:</span>
                <p className="mt-1 text-sm">{post.instructions}</p>
              </div>
            )}
            {post.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 text-sm">{post.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

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
               <SelectItem key={worker.id} value={worker.id.toString()}>
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
        <label className="text-sm font-medium">Instructions</label>
        <Textarea
          placeholder="Add specific instructions for the worker..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea
          placeholder="Add any additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
         <Button type="submit" disabled={loading || !selectedWorker || selectedWorker === 'none' || !instructions.trim()}>
           {loading ? 'Creating Task...' : 'Assign Task'}
         </Button>
      </div>
    </form>
  );
};

// Update Status Form Component
const UpdateStatusForm: React.FC<{ post: any; onClose: () => void; onUpdatePost: (id: number, updates: any) => void }> = ({ post, onClose, onUpdatePost }) => {
  const [status, setStatus] = useState(post.status);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePost(post.id, {
      status: status,
      statusNotes: notes,
      updatedAt: new Date().toISOString()
    });
    console.log('Updating status:', { post: post.id, status, notes });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-2">Issue Details:</p>
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <p className="text-sm text-muted-foreground mt-1">Location: {post.location}</p>
      </div>
      
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea
          placeholder="Add any notes about the status change..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Update Status
        </Button>
      </div>
    </form>
  );
};

// Add Comment Form Component
const AddCommentForm: React.FC<{ post: any; onClose: () => void; onAddComment: (id: number, text: string) => void }> = ({ post, onClose, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(post.id, comment);
    console.log('Adding comment:', { post: post.id, comment });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-2">Issue Details:</p>
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <p className="text-sm text-muted-foreground mt-1">Location: {post.location}</p>
      </div>
      
      <div>
        <label className="text-sm font-medium">Comment</label>
        <Textarea
          placeholder="Add your comment or update..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-24"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!comment.trim()}>
          Add Comment
        </Button>
      </div>
    </form>
  );
};

const AddWorkerForm: React.FC<{ onClose: () => void; onAddWorker: (worker: any) => void }> = ({ onClose, onAddWorker }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    department: '',
    designation: '',
    password: ''
  });

  // Reset form when component mounts
  React.useEffect(() => {
    setFormData({
      name: '',
      username: '',
      phone: '',
      department: '',
      designation: '',
      password: ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Add Worker form submitted with data:', formData);
    const newWorker = {
      id: Date.now(),
      ...formData,
      status: 'available',
      avatar: ''
    };
    console.log('Creating worker:', newWorker);
    onAddWorker(newWorker);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter worker's full name"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Username</label>
        <Input
          type="text"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="worker_username"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1-555-0123"
          required
        />
      </div>
      
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
          value={formData.designation}
          onChange={(e) => handleChange('designation', e.target.value)}
          placeholder="e.g., Senior Technician, Field Supervisor"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter worker's password"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter a secure password for the worker to login.
        </p>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formData.name || !formData.username || !formData.phone || !formData.department || !formData.designation || !formData.password}>
          Add Worker
        </Button>
      </div>
    </form>
  );
};

// Work Review Details Component
const WorkReviewDetails: React.FC<{ post: any; onClose: () => void; onApprove: () => void }> = ({ post, onClose, onApprove }) => {
  // Use actual completion data from the post
  const workerSubmission = {
    workDescription: post.workDone || "No work description provided",
    timeSpent: post.timeSpent || "Not specified",
    completionDate: post.completedAt ? new Date(post.completedAt).toLocaleString() : "Not specified",
    workerRemarks: post.completionNotes || "No additional remarks",
    submittedPhotos: post.completionPhotos || post.completionMedia?.filter((media: any) => media.type === 'image') || [],
    submittedVideos: post.completionVideos || post.completionMedia?.filter((media: any) => media.type === 'video') || [],
    materialsUsed: post.materialsUsed || ["Not specified"],
    cost: post.cost || "Not specified"
  };

  console.log('Work Review Details - Post data:', post);
  console.log('Work Review Details - Worker submission:', workerSubmission);
  console.log('Work Review Details - Post workDone:', post.workDone);
  console.log('Work Review Details - Post timeSpent:', post.timeSpent);
  console.log('Work Review Details - Post completedBy:', post.completedBy);
  console.log('Work Review Details - Post completionNotes:', post.completionNotes);

  return (
    <div className="space-y-6">
      {/* Original Task Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-3">Original Task</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Task ID:</span> {post.id}</p>
            <p><span className="font-medium">Location:</span> {post.location}</p>
            <p><span className="font-medium">Priority:</span> {post.priority}</p>
            <p><span className="font-medium">Created:</span> {post.createdAt}</p>
          </div>
          <div>
            <p><span className="font-medium">Reported by:</span> {post.user.name}</p>
            <p><span className="font-medium">Assigned to:</span> {post.assignedTo || 'Unknown'}</p>
            <p><span className="font-medium">Status:</span> {post.status}</p>
          </div>
        </div>
        <div className="mt-3">
          <p className="font-medium">Description:</p>
          <p className="text-sm text-muted-foreground">{post.content}</p>
        </div>
      </div>

      {/* Worker's Submission */}
      <div className="space-y-4">
        <h3 className="font-semibold">Worker's Submission</h3>
        
        {/* Work Description */}
        <div>
          <h4 className="font-medium mb-2">Work Completed</h4>
          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
            {workerSubmission.workDescription}
          </p>
        </div>

        {/* Worker Remarks */}
        <div>
          <h4 className="font-medium mb-2">Worker Remarks</h4>
          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
            {workerSubmission.workerRemarks}
          </p>
        </div>

        {/* Work Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Time Spent</h4>
            <p className="text-sm text-muted-foreground">{workerSubmission.timeSpent}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Completion Date</h4>
            <p className="text-sm text-muted-foreground">{workerSubmission.completionDate}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Materials Used</h4>
            <ul className="text-sm text-muted-foreground">
              {workerSubmission.materialsUsed.map((material, index) => (
                <li key={index}>• {material}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Cost</h4>
            <p className="text-sm text-muted-foreground">{workerSubmission.cost}</p>
          </div>
        </div>

        {/* Submitted Photos */}
        <div>
          <h4 className="font-medium mb-3">Photos Submitted by Worker</h4>
          {workerSubmission.submittedPhotos && workerSubmission.submittedPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {workerSubmission.submittedPhotos.map((photo, index) => {
                const photoUrl = typeof photo === 'string' ? photo : photo.url;
                const photoAlt = typeof photo === 'string' ? `Work photo ${index + 1}` : photo.filename || `Work photo ${index + 1}`;
                
                return (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img 
                      src={photoUrl} 
                      alt={photoAlt} 
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(photoUrl, '_blank')}
                      onError={(e) => {
                        console.error(`Failed to load photo ${index}:`, photoUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No photos submitted by worker</p>
            </div>
          )}
        </div>

        {/* Submitted Videos */}
        <div>
          <h4 className="font-medium mb-3">Videos Submitted by Worker</h4>
          {workerSubmission.submittedVideos && workerSubmission.submittedVideos.length > 0 ? (
            <div className="space-y-4">
              {workerSubmission.submittedVideos.map((video, index) => {
                const videoUrl = typeof video === 'string' ? video : video.url;
                const videoTitle = typeof video === 'string' ? `Work video ${index + 1}` : video.filename || `Work video ${index + 1}`;
                
                return (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-64 object-cover"
                      preload="metadata"
                      title={videoTitle}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <div className="text-4xl mb-2">🎥</div>
              <p className="text-sm text-muted-foreground">No videos submitted by worker</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button 
          variant="outline" 
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            if (confirm('Are you sure you want to reject this work?')) {
              console.log('Rejecting work for post:', post.id);
              onClose();
            }
          }}
        >
          Reject
        </Button>
        <Button 
          onClick={async () => {
            if (confirm('Are you sure you want to approve this work?')) {
              try {
                await onApprove();
                console.log('Work approved successfully from dialog for post:', post.id);
                alert('Work approved successfully!');
              } catch (error) {
                console.error('Error approving work from dialog:', error);
                alert('Failed to approve work. Please try again.');
              }
            }
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve Work
        </Button>
      </div>
    </div>
  );
};
