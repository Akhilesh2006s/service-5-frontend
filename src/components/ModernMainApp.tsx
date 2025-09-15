import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, User, Settings, LogOut, Home, TrendingUp, Users, FileText, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Import role-specific dashboards
import { InstagramStyleCitizenDashboard } from './InstagramStyleCitizenDashboard';
import { GovernmentOfficialDashboard } from './ModernGovernmentOfficialDashboard';
import { WorkerDashboard } from './ModernWorkerDashboard';
import { AdminDashboard } from './ModernAdminDashboard';

interface ModernMainAppProps {
  user: any;
  onLogout: () => void;
}

export const ModernMainApp: React.FC<ModernMainAppProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState('home');
  const [worker, setWorker] = useState<any>(null);

  // Check for worker login on component mount
  useEffect(() => {
    const storedWorker = localStorage.getItem('worker');
    if (storedWorker) {
      setWorker(JSON.parse(storedWorker));
    }
  }, []);

  const handleWorkerLogin = (workerData: any) => {
    setWorker(workerData);
  };

  const handleWorkerLogout = () => {
    setWorker(null);
    localStorage.removeItem('worker');
    localStorage.removeItem('workerToken');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <User className="h-4 w-4" />;
      case 'government_official':
      case 'government': return <Users className="h-4 w-4" />;
      case 'worker': return <CheckCircle className="h-4 w-4" />;
      case 'admin': return <BarChart3 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'citizen': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'government_official':
      case 'government': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'worker': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'trending', label: 'Trending', icon: TrendingUp },
    ];

    switch (user.role) {
      case 'citizen':
        return [
          ...baseItems,
          { id: 'my-posts', label: 'My Posts', icon: FileText },
          { id: 'assigned', label: 'Assigned Issues', icon: AlertCircle },
        ];
      case 'government_official':
      case 'government':
        return [
          ...baseItems,
          { id: 'department-feed', label: 'Department Feed', icon: Users },
          { id: 'assign-tasks', label: 'Assign Tasks', icon: CheckCircle },
          { id: 'review-work', label: 'Review Work', icon: FileText },
          { id: 'manage-workers', label: 'Manage Workers', icon: Users },
          { id: 'test-media', label: 'Test Media', icon: BarChart3 },
        ];
      case 'worker':
        return [
          ...baseItems,
          { id: 'assigned-tasks', label: 'My Tasks', icon: CheckCircle },
          { id: 'completed-work', label: 'Completed Work', icon: FileText },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'manage-officials', label: 'Manage Officials', icon: Users },
          { id: 'manage-workers', label: 'Manage Workers', icon: CheckCircle },
        ];
      default:
        return baseItems;
    }
  };

  const renderCurrentView = () => {
    // If worker is logged in, show worker dashboard
    if (worker) {
      console.log('Rendering WorkerDashboard for logged in worker:', worker);
      return <WorkerDashboard user={worker} currentView={currentView} onViewChange={setCurrentView} />;
    }

    console.log('ModernMainApp - User role:', user.role, 'User object:', user);
    switch (user.role) {
      case 'citizen':
        console.log('Rendering InstagramStyleCitizenDashboard');
        return <InstagramStyleCitizenDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
      case 'government_official':
        console.log('Rendering GovernmentOfficialDashboard');
        return <GovernmentOfficialDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
      case 'government':
        console.log('Rendering GovernmentOfficialDashboard (government role)');
        return <GovernmentOfficialDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
      case 'worker':
        console.log('Rendering WorkerDashboard');
        return <WorkerDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
      case 'admin':
        console.log('Rendering AdminDashboard');
        return <AdminDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
      default:
        console.log('Rendering InstagramStyleCitizenDashboard (default)');
        return <InstagramStyleCitizenDashboard user={user} currentView={currentView} onViewChange={setCurrentView} />;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between p-6">
                    <h2 className="text-lg font-semibold">LocalGov Connect</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-4 py-4">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <Badge className={cn("text-xs", getRoleColor(user.role))}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1 capitalize">{user.role?.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Navigation Items */}
                      <nav className="space-y-2">
                        {navigationItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={currentView === item.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              setCurrentView(item.id);
                              setSidebarOpen(false);
                            }}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Button>
                        ))}
                      </nav>
                      
                      <Separator />
                      
                      {/* Theme Toggle */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      >
                        {theme === 'dark' ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </Button>
                      
                      {/* Logout */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={onLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">LocalGov Connect</h1>
              <Badge className={cn("text-xs", getRoleColor(user.role))}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role?.replace('_', ' ')}</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <aside className="w-64 border-r bg-background">
          <div className="flex h-full flex-col">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Badge className={cn("text-xs mt-1", getRoleColor(user.role))}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1 capitalize">{user.role?.replace('_', ' ')}</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <ScrollArea className="flex-1 px-4">
              <nav className="space-y-2 py-4">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setCurrentView(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        <main className="container mx-auto px-4 py-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};
