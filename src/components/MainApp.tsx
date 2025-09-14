
import React, { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { HomePage } from './HomePage';
import { TrendingPage } from './TrendingPage';
import { GovernmentDashboard } from './GovernmentDashboard';
import { CreatePost } from './CreatePost';
import { ProfilePage } from './ProfilePage';

interface MainAppProps {
  user: any;
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ user, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} />;
      case 'trending':
        return <TrendingPage />;
      case 'government':
        return <GovernmentDashboard />;
      case 'profile':
        return <ProfilePage user={user} onLogout={onLogout} />;
      default:
        return <HomePage user={user} />;
    }
  };

  if (showCreatePost) {
    return <CreatePost user={user} onClose={() => setShowCreatePost(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {renderCurrentPage()}
        <BottomNavigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          onCreatePost={() => setShowCreatePost(true)}
        />
      </div>
    </div>
  );
};
