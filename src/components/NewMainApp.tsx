import React, { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { NewHomePage } from './NewHomePage';
import { TrendingPage } from './TrendingPage';
import { GovernmentDashboard } from './GovernmentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { GovernmentOfficialDashboard } from './GovernmentOfficialDashboard';
import { WorkerDashboard } from './WorkerDashboard';
import { CitizenDashboard } from './CitizenDashboard';
import { NewCreatePost } from './NewCreatePost';
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
          return <CitizenHomePage />;
        case 'reports':
          return <CitizenReportsPage />;
        case 'create':
          return <CitizenCreateReportPage />;
        case 'profile':
          return <CitizenProfilePage />;
        default:
          return <CitizenHomePage />;
      }
    }

    // Fallback for unauthenticated users
    switch (currentPage) {
      case 'home':
        return <NewHomePage user={user} />;
      case 'trending':
        return <TrendingPage />;
      case 'government':
        return <GovernmentDashboard />;
      case 'profile':
        return <NewProfilePage user={user} onLogout={() => {}} />;
      default:
        return <NewHomePage user={user} />;
    }
  };

  if (showCreatePost) {
    return <NewCreatePost user={user} onClose={() => setShowCreatePost(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {renderCurrentPage()}
        <BottomNavigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          onCreatePost={() => setShowCreatePost(true)}
          userRole={user?.role}
        />
      </div>
    </div>
  );
};
