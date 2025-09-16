import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface RoleSelectionPageProps {
  onRoleSelect: (role: 'citizen' | 'government' | 'admin' | 'worker') => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onRoleSelect }) => {
  const { user } = useAuth();

  const roles = [
    {
      id: 'citizen' as const,
      title: 'Citizen',
      description: 'Report issues and track progress',
      icon: '👤',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100',
      borderColor: 'border-blue-200',
      features: [
        'Report civic issues',
        'Track complaint status',
        'View resolution reports',
        'Upvote important issues'
      ]
    },
    {
      id: 'government' as const,
      title: 'Government Official',
      description: 'Manage department issues and assign workers',
      icon: '👔',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      features: [
        'View department issues',
        'Assign tasks to workers',
        'Generate official reports',
        'Manage department workers'
      ]
    },
    {
      id: 'admin' as const,
      title: 'System Administrator',
      description: 'Manage departments and system users',
      icon: '⚙️',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-100',
      borderColor: 'border-purple-200',
      features: [
        'Create departments',
        'Manage officials',
        'System statistics',
        'User management'
      ]
    },
    {
      id: 'worker' as const,
      title: 'Field Worker',
      description: 'Execute assigned tasks and update progress',
      icon: '👷',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      features: [
        'View assigned tasks',
        'Update work progress',
        'Upload work proof',
        'Mark tasks complete'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏛️ Government Management System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose your role to access the appropriate dashboard
          </p>
          {user && (
            <p className="text-sm text-gray-500">
              Welcome back, {user.name}!
            </p>
          )}
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className={`border-2 ${role.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br ${role.bgColor}`}
              onClick={() => onRoleSelect(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{role.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl`}
                >
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Overview */}
        <Card className="mt-8 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              🔄 Complete Workflow System
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Seamless collaboration between all roles for efficient issue resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">1. Citizen</h3>
                <p className="text-sm text-gray-600">Reports issues and tracks progress</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👔</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">2. Official</h3>
                <p className="text-sm text-gray-600">Assigns tasks to workers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👷</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">3. Worker</h3>
                <p className="text-sm text-gray-600">Executes tasks and updates status</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">4. Admin</h3>
                <p className="text-sm text-gray-600">Manages system and departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};





