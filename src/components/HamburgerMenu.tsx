import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HamburgerMenuProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onCreatePost: () => void;
  userRole?: 'citizen' | 'government' | 'admin' | 'worker';
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  currentPage,
  onPageChange,
  onCreatePost,
  userRole
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return [
        { id: 'home', label: 'Dashboard', icon: '⚙️', description: 'Admin Dashboard' },
        { id: 'departments', label: 'Departments', icon: '🏢', description: 'Manage Departments' },
        { id: 'officials', label: 'Officials', icon: '👔', description: 'Manage Officials' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Your Profile' }
      ];
    } else if (userRole === 'government') {
      return [
        { id: 'home', label: 'Home', icon: '🏠', description: 'Dashboard Home' },
        { id: 'issues', label: 'Issues', icon: '📋', description: 'View Issues' },
        { id: 'workers', label: 'Workers', icon: '👷', description: 'Manage Workers' },
        { id: 'assigned', label: 'Assigned', icon: '📝', description: 'Assigned Tasks' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Your Profile' }
      ];
    } else if (userRole === 'worker') {
      return [
        { id: 'home', label: 'Tasks', icon: '📋', description: 'My Tasks' },
        { id: 'completed', label: 'Completed', icon: '✅', description: 'Completed Tasks' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Your Profile' }
      ];
    } else if (userRole === 'citizen') {
      return [
        { id: 'home', label: 'Home', icon: '🏠', description: 'Feed & Updates' },
        { id: 'reports', label: 'Reports', icon: '📋', description: 'My Reports' },
        { id: 'create', label: 'Report Issue', icon: '📝', description: 'Create New Report' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Your Profile' }
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: '🏠', description: 'Main Feed' },
        { id: 'reports', label: 'Reports', icon: '📋', description: 'View Reports' },
        { id: 'create', label: 'Report Issue', icon: '📝', description: 'Create New Report' },
        { id: 'profile', label: 'Profile', icon: '👤', description: 'Your Profile' }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleItemClick = (itemId: string) => {
    if (itemId === 'create' && userRole === 'citizen') {
      onPageChange('create');
    } else if (itemId === 'create') {
      onCreatePost();
    } else {
      onPageChange(itemId);
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg hover:bg-gray-100"
        >
          <div className="flex flex-col space-y-1">
            <div className="h-0.5 w-5 bg-gray-600 rounded"></div>
            <div className="h-0.5 w-5 bg-gray-600 rounded"></div>
            <div className="h-0.5 w-5 bg-gray-600 rounded"></div>
          </div>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🏛️</span>
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-gray-900">
                  Citizen Sphere
                </SheetTitle>
                <p className="text-sm text-gray-500">Noida Municipal Corporation</p>
              </div>
            </div>
          </SheetHeader>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{user.username}
                  </p>
                  <p className="text-xs text-blue-600 font-medium capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                    currentPage === item.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className={cn(
                      "text-xs truncate",
                      currentPage === item.id ? "text-blue-100" : "text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start space-x-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <span className="text-lg">🚪</span>
              <span className="text-sm font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
