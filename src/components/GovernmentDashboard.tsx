
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const criticalIssues = [
    {
      id: 1,
      title: 'Metro Connectivity Extension - Sector 8-12',
      priority: 'Critical',
      status: 'Escalated',
      department: 'Metro Rail Corporation',
      reportedBy: 456,
      engagementScore: 892,
      estimatedCost: '₹50 Cr',
      affectedCitizens: 15000,
      deadline: '7 days',
      assignedOfficer: 'Amit Kumar (IAS)',
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      title: 'Healthcare Center Upgrade - Sector 19-21',
      priority: 'Critical',
      status: 'In Progress',
      department: 'Health Department',
      reportedBy: 398,
      engagementScore: 756,
      estimatedCost: '₹25 Cr',
      affectedCitizens: 8500,
      deadline: '10 days',
      assignedOfficer: 'Dr. Priya Sharma',
      lastUpdate: '4 hours ago'
    },
    {
      id: 3,
      title: 'Sewage Treatment Plant Malfunction - Sector 22-25',
      priority: 'High',
      status: 'Assigned',
      department: 'Sanitation Department',
      reportedBy: 295,
      engagementScore: 567,
      estimatedCost: '₹15 Lakh',
      affectedCitizens: 5500,
      deadline: '3 days',
      assignedOfficer: 'Rajesh Gupta',
      lastUpdate: '6 hours ago'
    }
  ];

  const departments = [
    { name: 'All Departments', value: 'all', count: 42 },
    { name: 'Public Works', value: 'public-works', count: 12 },
    { name: 'Traffic Police', value: 'traffic', count: 8 },
    { name: 'Sanitation', value: 'sanitation', count: 15 },
    { name: 'Health Department', value: 'health', count: 7 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Escalated': return 'bg-red-600 text-white';
      case 'In Progress': return 'bg-blue-600 text-white';
      case 'Assigned': return 'bg-orange-600 text-white';
      case 'Resolved': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🏛️ Government Dashboard</h1>
            <p className="text-blue-100 text-sm">Noida Municipal Corporation - Executive Portal</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Live Updates</div>
            <div className="text-xs text-blue-300">Last sync: 2 min ago</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Critical Alert */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-bold text-red-800">🚨 URGENT ACTION REQUIRED</h2>
          </div>
          <p className="text-sm text-red-700 mb-3">
            3 critical issues require immediate government intervention. Auto-escalated to Mayor's Office.
          </p>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              View Emergency Issues
            </Button>
            <Button size="sm" variant="outline" className="border-red-600 text-red-600">
              Contact Mayor's Office
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">8</div>
                <div className="text-xs text-red-700">Critical Issues</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-xs text-blue-700">In Progress</div>
              </div>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-xs text-green-700">Resolved</div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-xs text-purple-700">Satisfaction</div>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Department Filter */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">📋 Filter by Department</h3>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept.value}
                onClick={() => setSelectedDepartment(dept.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedDepartment === dept.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50'
                }`}
              >
                {dept.name} ({dept.count})
              </button>
            ))}
          </div>
        </div>

        {/* High Priority Issues */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">⚡ High Priority Issues</h3>
          <div className="space-y-3">
            {criticalIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{issue.title}</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs px-2 py-1 border ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </Badge>
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Engagement Score</div>
                    <div className="text-lg font-bold text-blue-600">{issue.engagementScore}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium text-gray-700 ml-1">{issue.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Est. Cost:</span>
                      <span className="font-medium text-gray-700 ml-1">{issue.estimatedCost}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Citizens Affected:</span>
                      <span className="font-medium text-gray-700 ml-1">{issue.affectedCitizens.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <span className="font-medium text-red-600 ml-1">{issue.deadline}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Assigned Officer:</span>
                      <span className="font-medium text-gray-700 ml-1">{issue.assignedOfficer}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{issue.reportedBy} citizens</span>
                    </div>
                    <span>Updated {issue.lastUpdate}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Update Status
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">
                    Assign Officer
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Contact Citizens
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">📊 Monthly Performance Report</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="text-green-600 font-semibold">Issues Resolved</div>
              <div className="text-2xl font-bold text-green-700">284 / 312</div>
              <div className="text-xs text-green-600">91% Success Rate</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="text-blue-600 font-semibold">Avg Response Time</div>
              <div className="text-2xl font-bold text-blue-700">4.2 days</div>
              <div className="text-xs text-blue-600">↓ 1.8 days improvement</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="text-purple-600 font-semibold">Citizen Satisfaction</div>
              <div className="text-2xl font-bold text-purple-700">4.6/5</div>
              <div className="text-xs text-purple-600">↑ 0.3 improvement</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200">
              <div className="text-orange-600 font-semibold">Budget Utilization</div>
              <div className="text-2xl font-bold text-orange-700">87%</div>
              <div className="text-xs text-orange-600">₹15.7 Cr / ₹18 Cr</div>
            </div>
          </div>
        </div>

        {/* Government Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-3">🎯 Platform Impact</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>• Reduced complaint processing time by:</span>
              <span className="font-semibold">68%</span>
            </div>
            <div className="flex justify-between">
              <span>• Increased citizen engagement by:</span>
              <span className="font-semibold">156%</span>
            </div>
            <div className="flex justify-between">
              <span>• Cost savings through prioritization:</span>
              <span className="font-semibold">₹2.3 Cr</span>
            </div>
            <div className="flex justify-between">
              <span>• Authentic issues (Aadhaar verified):</span>
              <span className="font-semibold">99.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
