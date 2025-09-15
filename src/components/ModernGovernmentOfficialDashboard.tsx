import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, AlertCircle, Clock, MapPin, Hash, Filter, Search, UserPlus, FileText, BarChart3, MessageCircle, Heart, Share2, MoreVertical, Edit, Eye, MessageSquare, Plus, Trash2, Mail, Phone, User } from 'lucide-react';
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
import { MediaTestComponent } from './MediaTestComponent';

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
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { posts, updatePost, likePost, addComment } = usePosts();

  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    assignedPosts: 0,
    completedPosts: 0,
    pendingPosts: 0,
    totalWorkers: 0,
    activeWorkers: 0
  });

  const departments = ['Public Works', 'Road Maintenance', 'Sanitation', 'Parks & Recreation', 'Utilities'];

  // Fetch workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

  // Calculate statistics
  useEffect(() => {
    const stats = {
      totalPosts: posts.length,
      assignedPosts: posts.filter(p => p.status === 'assigned').length,
      completedPosts: posts.filter(p => p.status === 'completed').length,
      pendingPosts: posts.filter(p => p.status === 'pending').length,
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'available').length
    };
    setStatistics(stats);
  }, [posts, workers]);

  // Fetch workers from backend
  const fetchWorkers = async () => {
    setWorkersLoading(true);
    try {
      const token = localStorage.getItem('token');
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
      } else {
        console.error('Failed to fetch workers:', response.status);
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
        console.error('Failed to create worker:', response.status);
      }
    } catch (error) {
      console.error('Error creating worker:', error);
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
        {console.log('Government Dashboard - Posts:', posts)}
        {posts.map((post) => {
          console.log('Government Dashboard - Rendering post:', post);
          console.log('Post mediaFiles:', post.mediaFiles);
          console.log('Post mediaFiles length:', post.mediaFiles?.length);
          console.log('Post image:', post.image);
          console.log('Post video:', post.video);
          console.log('Post has mediaFiles?', !!post.mediaFiles);
          console.log('Post mediaFiles is array?', Array.isArray(post.mediaFiles));
          if (post.mediaFiles && post.mediaFiles.length > 0) {
            console.log('First mediaFile:', post.mediaFiles[0]);
          }
          return (
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
              
              {/* Render media files */}
              {(() => {
                console.log('Checking media rendering for post:', post.id);
                console.log('post.mediaFiles:', post.mediaFiles);
                console.log('post.mediaFiles && post.mediaFiles.length > 0:', post.mediaFiles && post.mediaFiles.length > 0);
                return post.mediaFiles && post.mediaFiles.length > 0;
              })() && (
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
              {(() => {
                console.log('Checking fallback image for post:', post.id);
                console.log('post.image:', post.image);
                console.log('!post.mediaFiles:', !post.mediaFiles);
                console.log('post.image && !post.mediaFiles:', post.image && !post.mediaFiles);
                return post.image && !post.mediaFiles;
              })() && (
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
      case 'test-media': return <MediaTestComponent />;
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.pendingPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Assigned</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.assignedPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.completedPosts}</p>
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
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Workers</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.activeWorkers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              workers={workers}
              onClose={() => setShowAssignDialog(false)}
              onUpdatePost={updatePost}
              user={user}
            />
          )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          <AddWorkerForm 
            onClose={() => setShowAddWorkerDialog(false)}
            onAddWorker={handleAddWorker}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Assign Worker Form Component
const AssignWorkerForm: React.FC<{ post: any; workers: any[]; onClose: () => void; onUpdatePost: (id: number, updates: any) => void; user: any }> = ({ post, workers, onClose, onUpdatePost, user }) => {
  const [selectedWorker, setSelectedWorker] = useState('none');
  const [priority, setPriority] = useState(post.priority);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedWorkerData = workers.find(w => w.id.toString() === selectedWorker);
    const assignmentDetails = {
      status: 'assigned',
      assignedTo: selectedWorkerData?.name,
      assignedWorker: selectedWorker,
      assignedWorkerId: selectedWorker,
      assignedBy: user.name,
      assignedByRole: user.role,
      assignedAt: new Date().toISOString(),
      priority: priority,
      notes: notes
    };
    onUpdatePost(post.id, assignmentDetails);
    console.log('Assigning worker:', { post: post.id, assignmentDetails });
    onClose();
  };

  const availableWorkers = workers.filter(worker => 
    worker.status === 'available'
  );

  console.log('AssignWorkerForm - workers:', workers);
  console.log('AssignWorkerForm - availableWorkers:', availableWorkers);
  console.log('AssignWorkerForm - post:', post);

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
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: ''
  });

  // Reset form when component mounts
  React.useEffect(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      password: ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker = {
      id: Date.now(),
      ...formData,
      status: 'available',
      avatar: ''
    };
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
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="worker@city.gov"
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
        <Button type="submit" disabled={!formData.name || !formData.email || !formData.phone || !formData.department || !formData.designation || !formData.password}>
          Add Worker
        </Button>
      </div>
    </form>
  );
};
