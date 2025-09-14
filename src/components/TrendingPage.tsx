
import React from 'react';
import { TrendingUp, TrendingDown, Users, MessageSquare, Share2, AlertTriangle } from 'lucide-react';

export const TrendingPage: React.FC = () => {
  const trendingIssues = [
    {
      id: 1,
      title: 'Metro Connectivity Extension Request',
      location: 'Sector 8-12, Noida',
      engagementScore: 456,
      posts: 28,
      quotes: 278,
      shares: 156,
      trend: 'up',
      trendPercentage: '+45%',
      category: 'Transportation',
      urgency: 'high',
      timeframe: '2 hours ago',
      governmentDept: 'Metro Rail Corporation',
      estimatedCost: '₹50 Cr',
      affectedCitizens: 15000
    },
    {
      id: 2,
      title: 'Healthcare Center Upgrade Needed',
      location: 'Sector 19-21, Noida',
      engagementScore: 398,
      posts: 22,
      quotes: 187,
      shares: 124,
      trend: 'up',
      trendPercentage: '+38%',
      category: 'Healthcare',
      urgency: 'critical',
      timeframe: '4 hours ago',
      governmentDept: 'Health Department',
      estimatedCost: '₹25 Cr',
      affectedCitizens: 8500
    },
    {
      id: 3,
      title: 'Traffic Signal Installation Required',
      location: 'Sector 10-15, Noida',
      engagementScore: 367,
      posts: 18,
      quotes: 231,
      shares: 119,
      trend: 'up',
      trendPercentage: '+28%',
      category: 'Traffic',
      urgency: 'high',
      timeframe: '6 hours ago',
      governmentDept: 'Traffic Police',
      estimatedCost: '₹5 Lakh',
      affectedCitizens: 3200
    },
    {
      id: 4,
      title: 'Sewage Treatment Plant Malfunction',
      location: 'Sector 22-25, Noida',
      engagementScore: 295,
      posts: 15,
      quotes: 121,
      shares: 93,
      trend: 'up',
      trendPercentage: '+25%',
      category: 'Sanitation',
      urgency: 'critical',
      timeframe: '8 hours ago',
      governmentDept: 'Sanitation Department',
      estimatedCost: '₹15 Lakh',
      affectedCitizens: 5500
    },
    {
      id: 5,
      title: 'Road Infrastructure Repair',
      location: 'Sector 16-18, Noida',
      engagementScore: 241,
      posts: 16,
      quotes: 119,
      shares: 81,
      trend: 'up',
      trendPercentage: '+22%',
      category: 'Infrastructure',
      urgency: 'high',
      timeframe: '12 hours ago',
      governmentDept: 'Public Works Department',
      estimatedCost: '₹8 Lakh',
      affectedCitizens: 2800
    },
    {
      id: 6,
      title: 'Irregular Garbage Collection',
      location: 'Sector 15-17, Noida',
      engagementScore: 238,
      posts: 22,
      quotes: 122,
      shares: 89,
      trend: 'down',
      trendPercentage: '-15%',
      category: 'Sanitation',
      urgency: 'medium',
      timeframe: '1 day ago',
      governmentDept: 'Waste Management',
      estimatedCost: 'Resolved',
      affectedCitizens: 4200
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Infrastructure': 'bg-blue-100 text-blue-800',
      'Traffic': 'bg-purple-100 text-purple-800',
      'Sanitation': 'bg-green-100 text-green-800',
      'Utilities': 'bg-orange-100 text-orange-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Transportation': 'bg-indigo-100 text-indigo-800',
      'Public Spaces': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-4">
        <h1 className="text-xl font-bold">🔥 Trending Issues</h1>
        <p className="text-blue-100 text-sm">Government Priority Dashboard - Noida</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Government Stats Overview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h2 className="font-semibold text-green-800 mb-3">📊 Government Analytics Dashboard</h2>
          <div className="grid grid-cols-2 gap-4 text-center mb-3">
            <div>
              <div className="text-2xl font-bold text-red-600">6</div>
              <div className="text-xs text-red-700">Critical Issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">₹98.3 Cr</div>
              <div className="text-xs text-blue-700">Budget Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">39,500</div>
              <div className="text-xs text-purple-700">Citizens Affected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">72 hrs</div>
              <div className="text-xs text-green-700">Avg Response Time</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 text-center">
            Auto-escalation to Mayor's Office for 100+ engagement score
          </div>
        </div>

        {/* Action Required Alert */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="font-semibold text-red-800">Immediate Government Action Required</h3>
          </div>
          <p className="text-sm text-red-700">
            3 issues have crossed critical threshold • Auto-forwarded to concerned departments
          </p>
        </div>

        {/* Trending Issues List */}
        <div className="space-y-3">
          {trendingIssues.map((issue, index) => (
            <div key={issue.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    {issue.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${issue.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                      {issue.trendPercentage}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(issue.urgency)}`}>
                    {issue.urgency.toUpperCase()}
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {issue.engagementScore}
                  </div>
                </div>
              </div>
              
              <div className="mb-2">
                <span className={`inline-block text-xs px-2 py-1 rounded-full ${getCategoryColor(issue.category)}`}>
                  {issue.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
              <p className="text-sm text-gray-600 mb-2">📍 {issue.location}</p>
              
              {/* Government Specific Info */}
              <div className="bg-gray-50 rounded-lg p-2 mb-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium text-gray-700 ml-1">{issue.governmentDept}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Est. Cost:</span>
                    <span className="font-medium text-gray-700 ml-1">{issue.estimatedCost}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Citizens Affected:</span>
                    <span className="font-medium text-gray-700 ml-1">{issue.affectedCitizens.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{issue.posts}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{issue.quotes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-3 h-3" />
                    <span>{issue.shares}</span>
                  </div>
                </div>
                
                <span className="text-xs text-gray-400">{issue.timeframe}</span>
              </div>

              {/* Action Buttons for Government */}
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
                  Assign Department
                </button>
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                  Update Status
                </button>
                <button className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Government Performance */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">📈 This Month's Performance</h3>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex justify-between">
              <span>Issues Resolved:</span>
              <span className="font-semibold">284 / 312 (91%)</span>
            </div>
            <div className="flex justify-between">
              <span>Average Resolution Time:</span>
              <span className="font-semibold">4.2 days (↓ 1.8 days)</span>
            </div>
            <div className="flex justify-between">
              <span>Citizen Satisfaction Score:</span>
              <span className="font-semibold">4.6/5 (↑ 0.3)</span>
            </div>
            <div className="flex justify-between">
              <span>Budget Utilization:</span>
              <span className="font-semibold">₹15.7 Cr / ₹18 Cr (87%)</span>
            </div>
          </div>
        </div>

        {/* How Platform Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">🏛️ Platform Benefits for Government</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Real-time citizen feedback with authentic Aadhaar verification</li>
            <li>• Auto-prioritization based on citizen engagement and urgency</li>
            <li>• Location-specific issue tracking for efficient resource allocation</li>
            <li>• Transparent communication reducing repeated complaints</li>
            <li>• Performance analytics for data-driven governance decisions</li>
            <li>• Video evidence prevents false claims and ensures authenticity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
