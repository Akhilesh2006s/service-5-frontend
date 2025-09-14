
import React from 'react';

interface HeaderProps {
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Citizen Sphere</h1>
          <p className="text-xs text-gray-500">{user.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-green-600 text-sm">✓ Verified</span>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
