import React, { useState } from 'react';
import { HamburgerMenu } from './HamburgerMenu';
import { NewHomePage } from './NewHomePage';
import { TrendingPage } from './TrendingPage';
import { GovernmentDashboard } from './GovernmentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { GovernmentOfficialDashboard } from './GovernmentOfficialDashboard';
import { WorkerDashboard } from './WorkerDashboard';
import { CitizenDashboard } from './CitizenDashboard';
import { EnhancedCreatePost } from './EnhancedCreatePost';
import { EnhancedFeed } from './EnhancedFeed';
import { NewProfilePage } from './NewProfilePage';
import { GovernmentHomePage } from './GovernmentHomePage';
import { IssuesPage } from './IssuesPage';
import { WorkersPage } from './WorkersPage';
import { AssignedTasksPage } from './AssignedTasksPage';
import { GovernmentProfilePage } from './GovernmentProfilePage';
import { CitizenHomePage } from './CitizenHomePage';
import { CitizenReportsPage } from './CitizenReportsPage';
import { CitizenCreateReportPage } from './CitizenCreateReportPage';
import { CitizenProfilePage } from './CitizenProfilePage';
import { WorkerHomePage } from './WorkerHomePage';
import { WorkerCompletedTasksPage } from './WorkerCompletedTasksPage';
import { WorkerProfilePage } from './WorkerProfilePage';
import { AdminHomePage } from './AdminHomePage';
import { AdminDepartmentsPage } from './AdminDepartmentsPage';
import { AdminOfficialsPage } from './AdminOfficialsPage';
import { AdminProfilePage } from './AdminProfilePage';
import { useAuth } from '@/contexts/AuthContext';

export const NewMainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderCurrentPage = () => {
    // Role-based dashboard routing
    if (user?.role === 'admin') {
      // Admins get the new page-based navigation
      switch (currentPage) {
        case 'home':
          return <AdminHomePage />;
        case 'departments':
          return <AdminDepartmentsPage />;
        case 'officials':
          return <AdminOfficialsPage />;
        case 'profile':
          return <AdminProfilePage />;
        default:
          return <AdminHomePage />;
      }
    } else if (user?.role === 'government') {
      // Government officials get the new page-based navigation
      switch (currentPage) {
        case 'home':
          return <GovernmentHomePage />;
        case 'issues':
          return <IssuesPage />;
        case 'workers':
          return <WorkersPage />;
        case 'assigned':
          return <AssignedTasksPage />;
        case 'profile':
          return <GovernmentProfilePage />;
        default:
          return <GovernmentHomePage />;
      }
    } else if (user?.role === 'worker') {
      // Workers get the new page-based navigation
      switch (currentPage) {
        case 'home':
          return <WorkerHomePage />;
        case 'completed':
          return <WorkerCompletedTasksPage />;
        case 'profile':
          return <WorkerProfilePage />;
        default:
          return <WorkerHomePage />;
      }
    } else if (user?.role === 'citizen') {
      // Citizens get the new page-based navigation
      switch (currentPage) {
        case 'home':
          return <EnhancedFeed onCreatePost={() => setShowCreatePost(true)} />;
        case 'reports':
          return <CitizenReportsPage />;
        case 'create':
          return <CitizenCreateReportPage />;
        case 'profile':
          return <CitizenProfilePage />;
        default:
          return <EnhancedFeed onCreatePost={() => setShowCreatePost(true)} />;
      }
    }

    // Fallback for unauthenticated users
    switch (currentPage) {
      case 'home':
        return <EnhancedFeed onCreatePost={() => setShowCreatePost(true)} />;
      case 'trending':
        return <TrendingPage />;
      case 'government':
        return <GovernmentDashboard />;
      case 'profile':
        return <NewProfilePage user={user} onLogout={() => {}} />;
      default:
        return <EnhancedFeed onCreatePost={() => setShowCreatePost(true)} />;
    }
  };

  if (showCreatePost) {
    return <EnhancedCreatePost user={user} onClose={() => setShowCreatePost(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Header with Hamburger Menu */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center justify-between px-4">
            <HamburgerMenu 
              currentPage={currentPage} 
              onPageChange={setCurrentPage}
              onCreatePost={() => setShowCreatePost(true)}
              userRole={user?.role}
            />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏛️</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Citizen Sphere</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="pb-4">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};
