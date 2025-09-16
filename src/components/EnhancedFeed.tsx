import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InstagramPostCard } from './InstagramPostCard';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/contexts/PostsContext';

interface EnhancedFeedProps {
  onCreatePost: () => void;
}

export const EnhancedFeed: React.FC<EnhancedFeedProps> = ({ onCreatePost }) => {
  const { user } = useAuth();
  const { posts, loading, likePost, addComment, deletePost } = usePosts();

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
  const [activeTab, setActiveTab] = useState('feed');
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [govAnnouncements, setGovAnnouncements] = useState<any[]>([]);

  // Mock trending posts (in a real app, this would come from an API)
  useEffect(() => {
    const mockTrendingPosts = posts
      .filter(post => post.likes > 5 || post.quotes > 3)
      .sort((a, b) => (b.likes + b.quotes) - (a.likes + a.quotes))
      .slice(0, 5);
    setTrendingPosts(mockTrendingPosts);
  }, [posts]);

  // Mock government announcements (in a real app, this would come from an API)
  useEffect(() => {
    const mockAnnouncements = [
      {
        id: '1',
        title: 'Road Maintenance Schedule - Sector 15',
        content: 'Road maintenance work will be carried out on Sector 15 roads from 15th to 20th of this month. Please plan your commute accordingly.',
        author: { name: 'Noida Municipal Corporation', username: 'nmc_official', role: 'government' },
        category: 'Infrastructure',
        priority: 'medium',
        location: 'Sector 15, Noida',
        department: 'Public Works',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 12,
        quotes: 5,
        disagrees: 0,
        isAnnouncement: true
      },
      {
        id: '2',
        title: 'Water Supply Interruption Notice',
        content: 'Due to pipeline maintenance, water supply will be interrupted in Sector 12 from 6 AM to 12 PM tomorrow.',
        author: { name: 'Water Department', username: 'water_dept', role: 'government' },
        category: 'Water Supply',
        priority: 'high',
        location: 'Sector 12, Noida',
        department: 'Water Department',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        likes: 8,
        quotes: 3,
        disagrees: 1,
        isAnnouncement: true
      }
    ];
    setGovAnnouncements(mockAnnouncements);
  }, []);

  const handleLike = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Liked post:', postId);
  };

  const handleQuote = (postId: string) => {
    // In a real app, this would open a quote/reply modal
    console.log('Quoted post:', postId);
  };

  const handleDisagree = (postId: string) => {
    // In a real app, this would make an API call
    console.log('Disagreed with post:', postId);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open share options
    console.log('Shared post:', postId);
  };

  const renderFeed = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        posts.map((post) => (
          <InstagramPostCard
            key={post.id}
            post={{
              id: post.id,
              user: {
                name: post.user?.name || post.author?.name || 'Unknown User',
                avatar: post.user?.avatar || post.author?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name || post.author?.name || 'User'}&background=random`,
                role: post.user?.role || post.author?.role || 'citizen'
              },
              content: post.content || post.description || '',
              mediaFiles: post.mediaFiles || (post.image ? [{ url: post.image, type: 'image' as const }] : []),
              location: post.location,
              createdAt: post.createdAt || 'Just now',
              likes: post.likes || post.upvotes?.length || 0,
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
        ))
      )}
    </div>
  );

  const renderTrending = () => (
    <div className="space-y-4">
      {trendingPosts.length > 0 ? (
        trendingPosts.map((post, index) => (
          <div key={post.id} className="relative">
            <div className="absolute -left-2 top-4 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>
            <InstagramPostCard
              post={{
                id: post.id,
                user: {
                  name: post.user?.name || post.author?.name || 'Unknown User',
                  avatar: post.user?.avatar || post.author?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name || post.author?.name || 'User'}&background=random`,
                  role: post.user?.role || post.author?.role || 'citizen'
                },
                content: post.content || post.description || '',
                mediaFiles: post.mediaFiles || (post.image ? [{ url: post.image, type: 'image' as const }] : []),
                location: post.location,
                createdAt: post.createdAt || 'Just now',
                likes: post.likes || post.upvotes?.length || 0,
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
          </div>
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trending Posts Yet</h3>
            <p className="text-gray-600">Be the first to create engaging content!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      {govAnnouncements.map((announcement) => (
        <Card key={announcement.id} className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏛️</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Government Announcement</h3>
                <p className="text-xs text-blue-700">Official Notice</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <InstagramPostCard
              post={{
                id: announcement.id,
                user: {
                  name: announcement.user?.name || announcement.author?.name || 'Government Official',
                  avatar: announcement.user?.avatar || announcement.author?.avatar || `https://ui-avatars.com/api/?name=Government&background=blue`,
                  role: announcement.user?.role || announcement.author?.role || 'government'
                },
                content: announcement.content || announcement.description || '',
                mediaFiles: announcement.mediaFiles || (announcement.image ? [{ url: announcement.image, type: 'image' as const }] : []),
                location: announcement.location,
                createdAt: announcement.createdAt || 'Just now',
                likes: announcement.likes || announcement.upvotes?.length || 0,
                comments: announcement.comments || [],
                isLiked: false
              }}
              currentUser={user}
              onLike={handleLikePost}
              onComment={handleAddComment}
              onShare={handleSharePost}
              onBookmark={handleBookmarkPost}
              onDelete={handleDeletePost}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderConnect = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>💬</span>
            <span>Connect with Officials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => console.log('Open chat with Public Works')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">🏗️</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Public Works Department</p>
                  <p className="text-sm text-gray-500">Infrastructure & Maintenance</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => console.log('Open chat with Water Department')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">💧</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Water Department</p>
                  <p className="text-sm text-gray-500">Water Supply & Quality</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => console.log('Open chat with Sanitation')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">🧹</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Sanitation Department</p>
                  <p className="text-sm text-gray-500">Waste Management & Cleanliness</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => console.log('Open chat with Traffic')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">🚦</span>
                </div>
                <div className="text-left">
                  <p className="font-medium">Traffic Department</p>
                  <p className="text-sm text-gray-500">Traffic Management & Safety</p>
                </div>
              </div>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Tip:</strong> Connect directly with department officials for faster issue resolution
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Post Button */}
      <Button
        onClick={onCreatePost}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <span className="mr-2">📝</span>
        Report an Issue
      </Button>

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="connect">Connect</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6">
          {renderFeed()}
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          {renderTrending()}
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          {renderAnnouncements()}
        </TabsContent>

        <TabsContent value="connect" className="mt-6">
          {renderConnect()}
        </TabsContent>
      </Tabs>
    </div>
  );
};
