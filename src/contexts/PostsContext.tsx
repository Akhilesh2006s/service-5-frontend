import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Load posts from localStorage or use default data
const loadPostsFromStorage = (): Post[] => {
  try {
    const stored = localStorage.getItem('local-gov-posts');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
  }
  
  // Return default posts if no stored data
  return [
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
    },
    {
      id: 2,
      user: { name: 'Sarah Wilson', avatar: '', role: 'citizen' },
      content: 'Pothole on Oak Avenue is getting bigger every day. Almost damaged my car yesterday! #potholes #roads #oakavenue',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
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
      mediaFiles: [],
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
};

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(loadPostsFromStorage());

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    try {
      localStorage.setItem('local-gov-posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  }, [posts]);

  const addPost = (post: Post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  const updatePost = (id: number, updates: Partial<Post>) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, ...updates } : post
      )
    );
  };

  const deletePost = (id: number) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};

