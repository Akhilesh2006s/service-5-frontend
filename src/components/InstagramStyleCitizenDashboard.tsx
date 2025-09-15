import React, { useState, useEffect } from 'react';
import { Plus, Camera, Video, Hash, MapPin, AlertCircle, CheckCircle, Clock, MessageCircle, Heart, Share2, Filter, Search, TrendingUp, Trash2, MoreVertical, User, Settings, LogOut, Eye, Bookmark, Send, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FileUpload } from './FileUpload';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

interface CitizenDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const InstagramStyleCitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { posts, addPost, deletePost, likePost, addComment, savePostsToLocalStorage } = usePosts();

  const trendingHashtags = [
    { tag: '#streetlights', count: 24 },
    { tag: '#potholes', count: 18 },
    { tag: '#garbage', count: 12 },
    { tag: '#safety', count: 10 },
    { tag: '#roads', count: 8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHashtag = selectedHashtag === 'all' || 
                          post.content.toLowerCase().includes(selectedHashtag.toLowerCase());
    return matchesSearch && matchesHashtag;
  });

  const userPosts = posts.filter(post => post.user.name === user.name);

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    const comment = prompt('Add a comment:');
    if (comment && comment.trim()) {
      try {
        await addComment(postId, comment);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderMedia = (mediaFiles: any[], postId: string) => {
    if (!mediaFiles || mediaFiles.length === 0) return null;

    return (
      <div className="space-y-2">
        {mediaFiles.map((media, index) => (
          <div key={index} className="relative group">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`Post ${postId} media ${index}`}
                className="w-full h-auto max-h-96 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => setExpandedImage(media.url)}
                onError={(e) => {
                  console.log('Image failed to load:', media.url);
                  if (media.base64Data) {
                    e.currentTarget.src = `data:image/jpeg;base64,${media.base64Data}`;
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            ) : (
              <video
                src={media.url}
                controls
                className="w-full h-auto max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  console.log('Video failed to load:', media.url);
                  if (media.base64Data) {
                    e.currentTarget.src = `data:video/mp4;base64,${media.base64Data}`;
                  } else {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPost = (post: any) => (
    <Card key={post.id} className="mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => setShowProfile(true)}>
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm cursor-pointer hover:underline" onClick={() => setShowProfile(true)}>
              {post.user.name}
            </h3>
            <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        
        {post.user.name === user.name && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-sm leading-relaxed mb-3">{post.content}</p>
        
        {/* Location */}
        {post.location && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            {post.location}
          </div>
        )}

        {/* Status Badge */}
        {post.status && (
          <Badge className={cn("text-xs mb-3", getStatusColor(post.status))}>
            {post.status}
          </Badge>
        )}
      </div>

      {/* Media */}
      {renderMedia(post.mediaFiles, post.id)}

      {/* Engagement */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className={cn("p-0 h-auto", post.isLiked && "text-red-500")}
            >
              <Heart className={cn("h-5 w-5", post.isLiked && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleComment(post.id)}
              className="p-0 h-auto"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>

        {/* Likes Count */}
        {post.likes > 0 && (
          <p className="text-sm font-semibold mb-2">{post.likes} likes</p>
        )}

        {/* Comments Count */}
        {post.comments > 0 && (
          <p className="text-sm text-gray-500 mb-2">View all {post.comments} comments</p>
        )}

        {/* Hashtags */}
        {post.content.includes('#') && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.content.match(/#\w+/g)?.map((hashtag, index) => (
              <span
                key={index}
                className="text-blue-600 text-sm cursor-pointer hover:underline"
                onClick={() => setSelectedHashtag(hashtag)}
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  const renderCreatePostForm = () => (
    <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <CreatePostForm
          onPostCreated={(newPost) => {
            addPost(newPost);
            setShowCreatePost(false);
          }}
          user={user}
        />
      </DialogContent>
    </Dialog>
  );

  const renderProfileModal = () => (
    <Dialog open={showProfile} onOpenChange={setShowProfile}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400">Citizen</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{userPosts.length}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userPosts.reduce((sum, post) => sum + post.likes, 0)}</p>
              <p className="text-sm text-gray-500">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userPosts.reduce((sum, post) => sum + post.comments, 0)}</p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Your Posts</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userPosts.map(post => (
                <div key={post.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{post.content.substring(0, 50)}...</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderExpandedImage = () => (
    <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
      <DialogContent className="max-w-4xl p-0">
        {expandedImage && (
          <img
            src={expandedImage}
            alt="Expanded view"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">LocalGov Connect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{user.name}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">My Posts</p>
                  <p className="text-xl font-semibold text-gray-900">{userPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Likes</p>
                  <p className="text-xl font-semibold text-gray-900">{userPosts.reduce((sum, post) => sum + post.likes, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p className="text-xl font-semibold text-gray-900">{userPosts.reduce((sum, post) => sum + post.comments, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-xl font-semibold text-gray-900">{userPosts.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Hashtags */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((hashtag) => (
                <Badge
                  key={hashtag.tag}
                  variant={selectedHashtag === hashtag.tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedHashtag(hashtag.tag)}
                >
                  {hashtag.tag} ({hashtag.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Be the first to post something!'}
                </p>
                <Button onClick={() => setShowCreatePost(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(renderPost)
          )}
        </div>
      </div>

      {/* Modals */}
      {renderCreatePostForm()}
      {renderProfileModal()}
      {renderExpandedImage()}
    </div>
  );
};

// Create Post Form Component
const CreatePostForm: React.FC<{
  onPostCreated: (post: any) => void;
  user: any;
}> = ({ onPostCreated, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    department: 'Public Works'
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        content: formData.description, // For compatibility
        location: formData.location,
        priority: formData.priority,
        department: formData.department,
        mediaFiles: selectedFiles.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          file: file
        })),
        user: {
          name: user.name,
          email: user.email
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        status: 'pending'
      };

      onPostCreated(postData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        department: 'Public Works'
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="What's the issue?"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the issue in detail..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Where is this issue?"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Department</label>
        <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
          <SelectTrigger>
            <SelectValue />
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
        <label className="text-sm font-medium mb-2 block">Photos/Videos</label>
        <FileUpload onFilesSelected={handleFileSelect} />
        {selectedFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{file.name}</span>
                <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating Post...' : 'Create Post'}
      </Button>
    </form>
  );
};
