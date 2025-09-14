
import React from 'react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onCreatePost: () => void;
  userRole?: 'citizen' | 'government' | 'admin' | 'worker';
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPage,
  onPageChange,
  onCreatePost,
  userRole
}) => {
  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { id: 'home', label: 'Dashboard', icon: '⚙️' },
        { id: 'departments', label: 'Departments', icon: '🏢' },
        { id: 'officials', label: 'Officials', icon: '👔' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ];
    } else if (userRole === 'government') {
      return [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'issues', label: 'Issues', icon: '📋' },
        { id: 'workers', label: 'Workers', icon: '👷' },
        { id: 'assigned', label: 'Assigned', icon: '📝' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ];
    } else if (userRole === 'worker') {
      return [
        { id: 'home', label: 'Tasks', icon: '📋' },
        { id: 'completed', label: 'Completed', icon: '✅' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ];
    } else if (userRole === 'citizen') {
      return [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'reports', label: 'My Reports', icon: '📋' },
        { id: 'create', label: 'Report Issue', icon: '📝' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'trending', label: 'Trending', icon: '🔥' },
        { id: 'create', label: 'Post', icon: '➕' },
        { id: 'profile', label: 'Profile', icon: '👤' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-xl z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around py-3 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'create' && userRole === 'citizen') {
                  onPageChange('create');
                } else if (item.id === 'create') {
                  onCreatePost();
                } else {
                  onPageChange(item.id);
                }
              }}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 mx-1",
                currentPage === item.id 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105" 
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:scale-105"
              )}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </div>
    </div>
  );
};
