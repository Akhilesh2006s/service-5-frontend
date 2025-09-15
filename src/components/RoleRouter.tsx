import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ModernMainApp } from './ModernMainApp';

export const RoleRouter: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-white text-2xl font-bold">CS</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Use the modern main app for all roles
  return <ModernMainApp user={user} onLogout={logout} />;
};


