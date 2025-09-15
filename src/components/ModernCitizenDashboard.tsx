import React, { useState } from 'react';
import { Plus, Camera, Video, Hash, MapPin, AlertCircle, CheckCircle, Clock, MessageCircle, Heart, Share2, Filter, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FileUpload } from './FileUpload';
import { usePosts } from '@/contexts/PostsContext';

interface CitizenDashboardProps {
  user: any;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, currentView, onViewChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { posts, addPost, savePostsToLocalStorage } = usePosts();

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
      {/* Create Post Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button 
                variant="outline" 
                className="w-full justify-start text-muted-foreground"
                onClick={() => setShowCreatePost(true)}
              >
                What's the issue in your area?
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Camera className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          console.log('Rendering post:', post);
          console.log('Post mediaFiles:', post.mediaFiles);
          console.log('Post image:', post.image);
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
                <Badge className={cn("text-xs", getStatusColor(post.status))}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-4">{post.content}</p>
              
              {/* Display all media files */}
              {post.mediaFiles && post.mediaFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {console.log('Rendering mediaFiles:', post.mediaFiles)}
                  {post.mediaFiles.map((media, index) => {
                    console.log('Rendering media:', media);
                    return (
                    <div key={index} className="rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <img 
                          src={media.url} 
                          alt="Post" 
                          className="w-full h-64 object-cover"
                          onLoad={() => console.log('Image loaded successfully:', media.url)}
                          onError={(e) => {
                            console.error('Image failed to load:', media.url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <video 
                          src={media.url} 
                          controls 
                          className="w-full h-64 object-cover"
                          preload="metadata"
                          onLoadStart={() => console.log('Video loading started:', media.url)}
                          onError={(e) => {
                            console.error('Video failed to load:', media.url);
                            e.currentTarget.style.display = 'none';
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
              
              {/* Fallback for old posts with single image */}
              {!post.mediaFiles && post.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  {console.log('Rendering fallback image:', post.image)}
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('Fallback image failed to load:', post.image);
                      e.currentTarget.style.display = 'none';
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
              
              {post.assignedTo && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Assigned to: {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}</p>
                </div>
              )}
              
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
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMyPosts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Posts</h2>
        <Button onClick={() => setShowCreatePost(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <div className="grid gap-4">
        {posts.filter(post => post.user.name === user.name).map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={cn("text-xs", getStatusColor(post.status))}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">{post.createdAt}</span>
              </div>
              <p className="mb-4">{post.content}</p>
              {post.assignedTo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Assigned to: {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAssignedIssues = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Assigned Issues</h2>
      
      <div className="grid gap-4">
        {posts.filter(post => post.user.name === user.name && post.status !== 'completed').map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={cn("text-xs", getStatusColor(post.status))}>
                  {getStatusIcon(post.status)}
                  <span className="ml-1 capitalize">{post.status.replace('_', ' ')}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">{post.createdAt}</span>
              </div>
              <p className="mb-4">{post.content}</p>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Assigned to: {typeof post.assignedTo === 'string' ? post.assignedTo : post.assignedTo.name || 'Unknown'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTrending = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Trending Issues</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">
                    <Hash className="h-3 w-3 mr-1" />
                    {hashtag.tag}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{hashtag.count} posts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return renderHomeFeed();
      case 'trending': return renderTrending();
      case 'my-posts': return renderMyPosts();
      case 'assigned': return renderAssignedIssues();
      default: return renderHomeFeed();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts, hashtags, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedHashtag} onValueChange={setSelectedHashtag}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by hashtag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All hashtags</SelectItem>
              {trendingHashtags.map((hashtag, index) => (
                <SelectItem key={index} value={hashtag.tag}>
                  {hashtag.tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderCurrentView()}

      {/* Create Post Dialog - Available on all pages */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
          </DialogHeader>
              <CreatePostForm
                user={user}
                onClose={() => setShowCreatePost(false)}
                onPostCreated={(newPost) => {
                  console.log('onPostCreated called with:', newPost);
                  addPost(newPost);
                  // Save to localStorage after a short delay to ensure state is updated
                  setTimeout(() => {
                    savePostsToLocalStorage();
                  }, 100);
                  setShowCreatePost(false);
                }}
              />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Create Post Form Component
const CreatePostForm: React.FC<{ user: any; onClose: () => void; onPostCreated: (post: any) => void }> = ({ user, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract hashtags from content and hashtags field
    const allHashtags = [...new Set([
      ...content.match(/#\w+/g) || [],
      ...hashtags.split(' ').filter(tag => tag.startsWith('#'))
    ])];

    // Create new post object
    const newPost = {
      id: Date.now(), // Simple ID generation
      user: { 
        name: user.name, 
        avatar: user.avatar || '', 
        role: user.role || 'citizen' 
      },
      content: content,
      image: selectedFiles.find(file => file.type.startsWith('image/')) ? URL.createObjectURL(selectedFiles.find(file => file.type.startsWith('image/'))!) : null,
      video: selectedFiles.find(file => file.type.startsWith('video/')) ? URL.createObjectURL(selectedFiles.find(file => file.type.startsWith('video/'))!) : null,
      mediaFiles: selectedFiles.map(file => ({
        file: file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video'
      })),
      hashtags: allHashtags,
      location: location,
      status: 'pending',
      assignedTo: null,
      createdAt: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0
    };

    console.log('Creating post:', newPost);
    onPostCreated(newPost);
    
    // Reset form
    setContent('');
    setHashtags('');
    setLocation('');
    setSelectedFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">Citizen</p>
        </div>
      </div>
      
      <Textarea
        placeholder="Describe the problem you're facing..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-32"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Hashtags</label>
          <Input
            placeholder="#streetlights #safety"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Main Street, Downtown"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Add Media</label>
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
        <Button type="submit" disabled={!content.trim()}>
          Post Issue
        </Button>
      </div>
    </form>
  );
};
