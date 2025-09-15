import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'government' | 'worker' | 'admin';
  verified: boolean;
  aadhaarNumber?: string;
  location?: string;
  department?: string;
  designation?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'government' | 'worker' | 'admin';
  aadhaarNumber?: string;
  location?: string;
  department?: string;
  designation?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

// Helper function to get all local users from localStorage
const getLocalUsers = () => {
  try {
    const officials = localStorage.getItem('local-gov-officials');
    const workers = localStorage.getItem('local-gov-workers');
    
    const officialsList = officials ? JSON.parse(officials) : [];
    const workersList = workers ? JSON.parse(workers) : [];
    
    return [...officialsList, ...workersList];
  } catch (error) {
    console.error('Error loading local users:', error);
    return [];
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      // Check if it's a local token
      if (authToken.startsWith('local_')) {
        // Extract user ID from local token
        const userId = authToken.split('_')[2];
        const localUsers = getLocalUsers();
        const localUser = localUsers.find(u => u.id.toString() === userId);
        
        if (localUser) {
          const userData = {
            id: localUser.id.toString(),
            name: localUser.name,
            email: localUser.email,
            role: localUser.role,
            verified: localUser.verified || true,
            department: localUser.department,
            designation: localUser.designation
          };
          setUser(userData);
          setLoading(false);
          return;
        }
      }

      // Try backend API for non-local tokens
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      // First, try to find user in localStorage (for newly created users)
      const localUsers = getLocalUsers();
      console.log('Local users found:', localUsers);
      
      const localUser = localUsers.find(u => u.email === email);
      console.log('Local user found:', localUser);
      
      if (localUser) {
        // For demo purposes, accept any password for local users
        // In a real app, you'd hash and compare passwords
        const userData = {
          id: localUser.id.toString(),
          name: localUser.name,
          email: localUser.email,
          role: localUser.role,
          verified: localUser.verified || true,
          department: localUser.department,
          designation: localUser.designation
        };
        
        const demoToken = `local_${Date.now()}_${localUser.id}`;
        console.log('Login successful with local user:', userData);
        setToken(demoToken);
        setUser(userData);
        localStorage.setItem('token', demoToken);
        return;
      }

      // If not found locally, try backend API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

