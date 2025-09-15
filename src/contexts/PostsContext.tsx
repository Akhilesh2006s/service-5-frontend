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

  return {
    id: backendPost._id || Date.now(),
    user: {
      name: backendPost.author?.name || 'Unknown User',
      avatar: backendPost.author?.avatar || '',
      role: backendPost.author?.role || 'citizen'
    },
    content: backendPost.description || backendPost.title || '',
    image: backendPost.image || null,
    video: backendPost.video || null,
    mediaFiles: backendPost.mediaFiles || [],
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
        const convertedPosts = backendPosts.map(convertBackendPost);
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
              image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
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
          // Use default mock data
          const defaultPosts = [
            {
              id: 1,
              user: { name: 'John Doe', avatar: '', role: 'citizen' },
              content: 'The street lights on Main Street have been out for 3 days now. It\'s getting dangerous to walk at night. #streetlights #safety #mainstreet',
              image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
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

  const addPost = async (post: Post) => {
    if (!token) {
      // If no token, just add to local state
      setPosts(prevPosts => [post, ...prevPosts]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: post.content.substring(0, 100),
          description: post.content,
          category: 'general',
          priority: post.priority || 'medium',
          status: post.status || 'pending',
          location: post.location,
          department: 'General',
          hashtags: post.hashtags,
          image: post.image,
          video: post.video
        })
      });

      if (response.ok) {
        const newBackendPost = await response.json();
        const convertedPost = convertBackendPost(newBackendPost);
        setPosts(prevPosts => [convertedPost, ...prevPosts]);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      // Fallback to local state
      setPosts(prevPosts => [post, ...prevPosts]);
    }
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
    if (!token) {
      // If no token, just update local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
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
        setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      // Fallback to local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <PostsContext.Provider value={{ 
      posts, 
      addPost, 
      updatePost, 
      deletePost, 
      loading, 
      error, 
      refreshPosts 
    }}>
      {children}
    </PostsContext.Provider>
  );
};

