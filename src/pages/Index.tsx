
import React, { useState } from 'react';
import { AuthPage } from '../components/AuthPage';
import { MainApp } from '../components/MainApp';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
};

export default Index;
