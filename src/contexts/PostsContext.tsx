import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface MediaFile {
  file: File | null;
  url: string;
  type: 'image' | 'video';
}

interface Post {
  id: number;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string | null;
  video?: string | null;
  mediaFiles?: MediaFile[];
  hashtags: string[];
  location: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedTo?: string | null;
  assignedWorker?: string | null;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
}

interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (id: number, updates: Partial<Post>) => void;
  deletePost: (id: number) => void;
  loading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  savePostsToLocalStorage: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

// Convert backend post format to frontend format
const convertBackendPost = (backendPost: any): Post => {
  // Handle assignedTo field - it could be an object or string
  let assignedTo = null;
  if (backendPost.assignedTo) {
    if (typeof backendPost.assignedTo === 'string') {
      assignedTo = backendPost.assignedTo;
    } else if (backendPost.assignedTo.name) {
      assignedTo = backendPost.assignedTo.name;
    } else {
      assignedTo = 'Unknown';
    }
  }

  // Convert backend images/videos arrays to frontend mediaFiles format
  const mediaFiles: any[] = [];
  
  // Add images
  if (backendPost.images && Array.isArray(backendPost.images)) {
    backendPost.images.forEach((imageUrl: string) => {
      if (imageUrl) {
        mediaFiles.push({
          file: null,
          url: imageUrl,
          type: 'image'
        });
      }
    });
  }
  
  // Add videos
  if (backendPost.videos && Array.isArray(backendPost.videos)) {
    backendPost.videos.forEach((videoUrl: string) => {
      if (videoUrl) {
        mediaFiles.push({
          file: null,
          url: videoUrl,
          type: 'video'
        });
      }
    });
  }

  // Fallback to single image/video if mediaFiles doesn't exist
  let singleImage = null;
  let singleVideo = null;
  if (mediaFiles.length === 0) {
    if (backendPost.image) {
      singleImage = backendPost.image;
    }
    if (backendPost.video) {
      singleVideo = backendPost.video;
    }
  }

  return {
    id: backendPost._id || Date.now(),
    user: {
      name: backendPost.author?.name || 'Unknown User',
      avatar: backendPost.author?.avatar || '',
      role: backendPost.author?.role || 'citizen'
    },
    content: backendPost.description || backendPost.title || '',
    image: singleImage,
    video: singleVideo,
    mediaFiles: mediaFiles,
    hashtags: backendPost.hashtags || [],
    location: backendPost.location || 'Unknown Location',
    status: backendPost.status || 'pending',
    assignedTo: assignedTo,
    assignedWorker: backendPost.assignedWorker || null,
    priority: backendPost.priority || 'medium',
    notes: backendPost.notes || '',
    createdAt: backendPost.createdAt ? new Date(backendPost.createdAt).toLocaleString() : 'Unknown',
    likes: backendPost.upvotes || 0,
    comments: backendPost.comments?.length || 0,
    shares: 0
  };
};

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers
      });

      if (response.ok) {
        const backendPosts = await response.json();
        console.log('Backend posts received:', backendPosts);
        const convertedPosts = backendPosts.map(convertBackendPost);
        console.log('Converted posts:', convertedPosts);
        setPosts(convertedPosts);
        console.log('Successfully fetched posts:', convertedPosts.length);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch posts: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      
      // Fallback to localStorage if API fails
      try {
        const stored = localStorage.getItem('local-gov-posts');
        if (stored) {
          const fallbackPosts = JSON.parse(stored);
          setPosts(fallbackPosts);
          console.log('Using fallback posts from localStorage:', fallbackPosts.length);
        } else {
          // If no stored posts, use default mock data
          const defaultPosts = [
            {
              id: 1,
              user: { name: 'John Doe', avatar: '', role: 'citizen' },
              content: 'The street lights on Main Street have been out for 3 days now. It\'s getting dangerous to walk at night. #streetlights #safety #mainstreet',
              image: null, // Remove this to test mediaFiles only
              video: null,
              mediaFiles: [
                {
                  file: null,
                  url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
                  type: 'image'
                }
              ],
              hashtags: ['#streetlights', '#safety', '#mainstreet'],
              location: 'Main Street, Downtown',
              status: 'assigned',
              assignedTo: 'Public Works Department',
              createdAt: '2 hours ago',
              likes: 12,
              comments: 5,
              shares: 3
            },
            {
              id: 2,
              user: { name: 'Sarah Wilson', avatar: '', role: 'citizen' },
              content: 'Pothole on Oak Avenue is getting bigger every day. Almost damaged my car yesterday! #potholes #roads #oakavenue',
              image: null,
              video: null,
              mediaFiles: [
                {
                  file: null,
                  url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                  type: 'image'
                }
              ],
              hashtags: ['#potholes', '#roads', '#oakavenue'],
              location: 'Oak Avenue',
              status: 'in_progress',
              assignedTo: 'Road Maintenance Team',
              createdAt: '4 hours ago',
              likes: 8,
              comments: 2,
              shares: 1
            },
            {
              id: 3,
              user: { name: 'Mike Johnson', avatar: '', role: 'citizen' },
              content: 'Garbage collection was missed on our street this week. Trash is piling up! #garbage #sanitation #missedcollection',
              image: null,
              video: null,
              mediaFiles: [
                {
                  file: null,
                  url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?w=500',
                  type: 'image'
                }
              ],
              hashtags: ['#garbage', '#sanitation', '#missedcollection'],
              location: 'Pine Street',
              status: 'completed',
              assignedTo: 'Sanitation Department',
              createdAt: '1 day ago',
              likes: 15,
              comments: 8,
              shares: 4
            }
          ];
          setPosts(defaultPosts);
          console.log('Using default mock posts');
        }
      } catch (storageError) {
        console.error('Error loading from localStorage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch posts if we have a token (user is authenticated)
    if (token) {
      fetchPosts();
    } else {
      // If no token, show fallback posts immediately
      setLoading(false);
      try {
        const stored = localStorage.getItem('local-gov-posts');
        if (stored) {
          const fallbackPosts = JSON.parse(stored);
          setPosts(fallbackPosts);
          console.log('Using fallback posts from localStorage (no auth):', fallbackPosts.length);
        } else {
          // Use default mock data with working images
          const defaultPosts = [
            {
              id: 1,
              user: { name: 'John Doe', avatar: '', role: 'citizen' },
              content: 'The street lights on Main Street have been out for 3 days now. It\'s getting dangerous to walk at night. #streetlights #safety #mainstreet',
              image: null,
              video: null,
              mediaFiles: [],
              hashtags: ['#streetlights', '#safety', '#mainstreet'],
              location: 'Main Street, Downtown',
              status: 'assigned',
              assignedTo: 'Public Works Department',
              createdAt: '2 hours ago',
              likes: 12,
              comments: 5,
              shares: 3
            },
            {
              id: 2,
              user: { name: 'Sarah Wilson', avatar: '', role: 'citizen' },
              content: 'Large pothole on Oak Avenue causing traffic issues. Cars are swerving to avoid it. #potholes #roads #oakavenue',
              image: null,
              video: null,
              mediaFiles: [],
              hashtags: ['#potholes', '#roads', '#oakavenue'],
              location: 'Oak Avenue',
              status: 'pending',
              assignedTo: null,
              createdAt: '4 hours ago',
              likes: 8,
              comments: 3,
              shares: 1
            },
            {
              id: 3,
              user: { name: 'Mike Johnson', avatar: '', role: 'citizen' },
              content: 'Garbage collection was missed on Pine Street. Bins are overflowing. #garbage #sanitation #missedcollection',
              image: null,
              video: null,
              mediaFiles: [],
              hashtags: ['#garbage', '#sanitation', '#missedcollection'],
              location: 'Pine Street',
              status: 'in-progress',
              assignedTo: 'Sanitation Department',
              createdAt: '6 hours ago',
              likes: 15,
              comments: 7,
              shares: 2
            }
          ];
          setPosts(defaultPosts);
          console.log('Using default mock posts (no auth)');
        }
      } catch (error) {
        console.error('Error loading fallback posts:', error);
        setPosts([]);
      }
    }
  }, [token]);

  // Save posts to localStorage whenever posts change (for unauthenticated users)
  useEffect(() => {
    if (!token && posts.length > 0) {
      try {
        localStorage.setItem('local-gov-posts', JSON.stringify(posts));
        console.log('Auto-saved posts to localStorage:', posts.length);
      } catch (error) {
        console.error('Error auto-saving posts to localStorage:', error);
      }
    }
  }, [posts, token]);

  const addPost = async (post: Post) => {
    console.log('Adding new post to local state:', post);
    // Just add to local state - the CreatePostForm handles backend calls
    setPosts(prevPosts => {
      const newPosts = [post, ...prevPosts];
      console.log('Added post to local state, total posts:', newPosts.length);
      return newPosts;
    });
  };

  const updatePost = async (id: number, updates: Partial<Post>) => {
    if (!token) {
      // If no token, just update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updates } : post
        )
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === id ? { ...post, ...updates } : post
          )
        );
      } else {
        throw new Error('Failed to update post');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      // Fallback to local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updates } : post
        )
      );
    }
  };

  const deletePost = async (id: number) => {
    console.log('Deleting post with ID:', id);
    
    if (!token) {
      // If no token, remove from local state and localStorage
      setPosts(prevPosts => {
        const newPosts = prevPosts.filter(post => post.id !== id);
        console.log('Removed post from local state, remaining posts:', newPosts.length);
        
        // Update localStorage
        try {
          localStorage.setItem('local-gov-posts', JSON.stringify(newPosts));
          console.log('Updated localStorage after deletion');
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
        
        return newPosts;
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPosts(prevPosts => {
          const newPosts = prevPosts.filter(post => post.id !== id);
          console.log('Removed post from backend and local state');
          return newPosts;
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      // Fallback to local state
      setPosts(prevPosts => {
        const newPosts = prevPosts.filter(post => post.id !== id);
        console.log('Fallback: Removed post from local state');
        return newPosts;
      });
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  const savePostsToLocalStorage = () => {
    if (!token && posts.length > 0) {
      try {
        localStorage.setItem('local-gov-posts', JSON.stringify(posts));
        console.log('Manually saved posts to localStorage:', posts.length);
      } catch (error) {
        console.error('Error manually saving posts to localStorage:', error);
      }
    }
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      addPost, 
      updatePost, 
      deletePost, 
      loading, 
      error, 
      refreshPosts,
      savePostsToLocalStorage
    }}>
      {children}
    </PostsContext.Provider>
  );
};

