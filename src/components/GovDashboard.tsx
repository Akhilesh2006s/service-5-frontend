
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const GovDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const governmentIssues = [
    {
      id: 1,
      title: 'Street Light Maintenance - Sector 12',
      priority: 'high',
      status: 'in-progress',
      department: 'Public Works',
      reportedBy: 15,
      lastUpdate: '2 hours ago',
      description: 'Multiple street lights non-functional causing safety concerns'
    },
    {
      id: 2,
      title: 'Traffic Signal Installation Request',
      priority: 'high',
      status: 'assigned',
      department: 'Traffic Police',
      reportedBy: 8,
      lastUpdate: '4 hours ago',
      description: 'Need traffic signal at main crossing near Sector 10'
    },
    {
      id: 3,
      title: 'Irregular Garbage Collection',
      priority: 'medium',
      status: 'resolved',
      department: 'Sanitation',
      reportedBy: 12,
      lastUpdate: '1 day ago',
      description: 'Waste collection schedule normalized in affected areas'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
        <h1 className="text-xl font-bold">Government Dashboard</h1>
        <p className="text-blue-100 text-sm">Real-time citizen issue tracking</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">8</div>
            <div className="text-xs text-red-600">High Priority</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">15</div>
            <div className="text-xs text-yellow-600">In Progress</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-xs text-green-600">Resolved</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Active Issues</h2>
          
          <div className="space-y-3">
            {governmentIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{issue.title}</h3>
                  <div className="flex space-x-1">
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{issue.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>📋 {issue.department}</span>
                  <span>👥 {issue.reportedBy} citizens</span>
                  <span>🕒 {issue.lastUpdate}</span>
                </div>
                
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📊 This Week's Statistics</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>New Reports:</span>
              <span className="font-semibold">42</span>
            </div>
            <div className="flex justify-between">
              <span>Issues Resolved:</span>
              <span className="font-semibold">28</span>
            </div>
            <div className="flex justify-between">
              <span>Average Response Time:</span>
              <span className="font-semibold">4.2 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Citizen Satisfaction:</span>
              <span className="font-semibold">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
