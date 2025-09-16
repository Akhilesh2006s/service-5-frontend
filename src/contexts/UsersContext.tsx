import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  username: string;
  role: 'government' | 'worker' | 'citizen' | 'admin';
  department?: string;
  designation?: string;
  phone?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'available' | 'busy';
  verified?: boolean;
  createdAt?: string;
  postsAssigned?: number;
  postsResolved?: number;
}

interface UsersContextType {
  governmentOfficials: User[];
  workers: User[];
  addGovernmentOfficial: (official: User) => void;
  addWorker: (worker: User) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number, role: 'government' | 'worker') => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

// Load users from localStorage or use default data
const loadUsersFromStorage = (): { governmentOfficials: User[], workers: User[] } => {
  try {
    const storedOfficials = localStorage.getItem('local-gov-officials');
    const storedWorkers = localStorage.getItem('local-gov-workers');
    
    const governmentOfficials = storedOfficials ? JSON.parse(storedOfficials) : [
      {
        id: 1,
        name: 'Akhilesh',
        username: 'akhilesh',
        role: 'government' as const,
        department: 'Public Works',
        designation: 'Senior Officer',
        phone: '+1-555-0101',
        avatar: '',
        status: 'active' as const,
        verified: true,
        createdAt: '2024-01-15',
        postsAssigned: 15,
        postsResolved: 12
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        username: 'sarah_johnson',
        role: 'government' as const,
        department: 'Sanitation',
        designation: 'Department Head',
        phone: '+1-555-0102',
        avatar: '',
        status: 'active' as const,
        verified: true,
        createdAt: '2024-03-20',
        postsAssigned: 8,
        postsResolved: 6
      }
    ];
    
    const workers = storedWorkers ? (() => {
      const parsedWorkers = JSON.parse(storedWorkers);
      // Migrate 'active' status to 'available' for workers
      return parsedWorkers.map((worker: User) => ({
        ...worker,
        status: worker.status === 'active' ? 'available' : worker.status
      }));
    })() : [
      {
        id: 1,
        name: 'Mike Davis',
        username: 'mike_davis',
        role: 'worker' as const,
        department: 'Public Works',
        designation: 'Field Supervisor',
        phone: '+1-555-0201',
        avatar: '',
        status: 'available' as const,
        verified: true,
        createdAt: '2024-02-10',
        postsAssigned: 0,
        postsResolved: 0
      },
      {
        id: 2,
        name: 'Lisa Wilson',
        username: 'lisa_wilson',
        role: 'worker' as const,
        department: 'Road Maintenance',
        designation: 'Maintenance Worker',
        phone: '+1-555-0202',
        avatar: '',
        status: 'available' as const,
        verified: true,
        createdAt: '2024-04-05',
        postsAssigned: 0,
        postsResolved: 0
      }
    ];
    
    return { governmentOfficials, workers };
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return { governmentOfficials: [], workers: [] };
  }
};

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  const { governmentOfficials: defaultOfficials, workers: defaultWorkers } = loadUsersFromStorage();
  const [governmentOfficials, setGovernmentOfficials] = useState<User[]>(defaultOfficials);
  const [workers, setWorkers] = useState<User[]>(defaultWorkers);

  // Debug logging
  console.log('UsersContext - Loaded Government Officials:', defaultOfficials);
  console.log('UsersContext - Loaded Workers:', defaultWorkers);

  // Save government officials to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('local-gov-officials', JSON.stringify(governmentOfficials));
    } catch (error) {
      console.error('Error saving government officials to localStorage:', error);
    }
  }, [governmentOfficials]);

  // Save workers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('local-gov-workers', JSON.stringify(workers));
    } catch (error) {
      console.error('Error saving workers to localStorage:', error);
    }
  }, [workers]);

  const addGovernmentOfficial = (official: User) => {
    const newOfficial = {
      ...official,
      id: Date.now(), // Simple ID generation
      role: 'government' as const,
      status: 'active' as const,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      postsAssigned: 0,
      postsResolved: 0
    };
    console.log('Adding Government Official:', newOfficial);
    setGovernmentOfficials(prev => {
      const updated = [...prev, newOfficial];
      console.log('Updated Government Officials:', updated);
      return updated;
    });
  };

  const addWorker = (worker: User) => {
    const newWorker = {
      ...worker,
      id: Date.now(), // Simple ID generation
      role: 'worker' as const,
      status: 'available' as const,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      postsAssigned: 0,
      postsResolved: 0
    };
    console.log('Adding Worker:', newWorker);
    setWorkers(prev => {
      const updated = [...prev, newWorker];
      console.log('Updated Workers:', updated);
      return updated;
    });
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setGovernmentOfficials(prev =>
      prev.map(user => (user.id === id ? { ...user, ...updates } : user))
    );
    setWorkers(prev =>
      prev.map(user => (user.id === id ? { ...user, ...updates } : user))
    );
  };

  const deleteUser = (id: number, role: 'government' | 'worker') => {
    if (role === 'government') {
      setGovernmentOfficials(prev => prev.filter(user => user.id !== id));
    } else if (role === 'worker') {
      setWorkers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <UsersContext.Provider value={{ 
      governmentOfficials, 
      workers, 
      addGovernmentOfficial, 
      addWorker, 
      updateUser, 
      deleteUser 
    }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
