import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminPage from '@/pages/AdminPage';
import GovernmentOfficialPage from '@/pages/GovernmentOfficialPage';
import WorkerPage from '@/pages/WorkerPage';
import CitizenPage from '@/pages/CitizenPage';

export const RoleRouter: React.FC = () => {
  const { user } = useAuth();

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

  // Route to specific role page
  switch (user.role) {
    case 'admin':
      return <AdminPage />;
    case 'government':
      return <GovernmentOfficialPage />;
    case 'worker':
      return <WorkerPage />;
    case 'citizen':
      return <CitizenPage />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Role</h1>
            <p className="text-gray-600">Your account has an invalid role. Please contact support.</p>
          </div>
        </div>
      );
  }
};

