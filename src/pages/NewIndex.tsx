import React from 'react';
import { NewAuthPage } from '../components/NewAuthPage';
import { RoleRouter } from '../components/RoleRouter';
import { useAuth } from '../contexts/AuthContext';

const NewIndex = () => {
  const { user, loading } = useAuth();

  if (loading) {
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

  if (!user) {
    return <NewAuthPage />;
  }

  // Route to specific role dashboard
  return <RoleRouter />;
};

export default NewIndex;
