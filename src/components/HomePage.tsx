
import React, { useState } from 'react';
import { InstagramPostCard } from './InstagramPostCard';
import { Header } from './Header';

interface HomePageProps {
  user: any;
}

export const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const handleLikePost = async (postId: string) => {
    console.log('Liking post:', postId);
  };

  const handleAddComment = async (postId: string, comment: string) => {
    console.log('Adding comment to post:', postId, comment);
  };

  const handleSharePost = (postId: string) => {
    console.log('Sharing post:', postId);
  };

  const handleBookmarkPost = (postId: string) => {
    console.log('Bookmarking post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    console.log('Deleting post:', postId);
  };

  const [posts] = useState([
    {
      id: 1,
      user: {
        name: 'Priya Sharma',
        location: 'Sector 12, Noida',
        verified: true
      },
      content: 'Street lights in our area have been non-functional for 2 weeks. Evening walks are becoming unsafe. Need immediate attention from municipal authorities. This is affecting the entire community safety. Multiple residents have complained but no action taken yet.',
      timestamp: '2 hours ago',
      reactions: { likes: 145, quotes: 78, shares: 42 },
      hasVideo: true,
      category: 'Infrastructure',
      governmentResponse: 'Under Review',
      priority: 'High'
    },
    {
      id: 2,
      user: {
        name: 'Amit Kumar',
        location: 'Sector 15, Noida',
        verified: true
      },
      content: 'Garbage collection has been irregular in our society for the past month. Piling up of waste is causing health concerns and attracting stray animals. Multiple complaints to municipal office have gone unheard. This is a health emergency waiting to happen.',
      timestamp: '4 hours ago',
      reactions: { likes: 238, quotes: 122, shares: 89 },
      hasVideo: true,
      category: 'Sanitation',
      governmentResponse: 'Action Taken',
      priority: 'Critical'
    },
    {
      id: 3,
      user: {
        name: 'Meera Joshi',
        location: 'Sector 10, Noida',
        verified: true
      },
      content: 'Urgent need for a traffic signal at the main crossing near our sector. Multiple accidents have occurred due to poor traffic management. Children and elderly find it dangerous to cross the road. Yesterday another near-miss incident happened.',
      timestamp: '6 hours ago',
      reactions: { likes: 367, quotes: 231, shares: 119 },
      hasVideo: false,
      category: 'Traffic',
      governmentResponse: 'In Progress',
      priority: 'High'
    },
    {
      id: 4,
      user: {
        name: 'Rajesh Gupta',
        location: 'Sector 18, Noida',
        verified: true
      },
      content: 'Water supply has been erratic for the past week. We are getting water only for 2-3 hours daily. This is severely affecting daily household activities. Elderly residents are struggling to manage. Please look into this matter urgently.',
      timestamp: '8 hours ago',
      reactions: { likes: 189, quotes: 94, shares: 67 },
      hasVideo: false,
      category: 'Utilities',
      governmentResponse: 'Resolved',
      priority: 'Medium'
    },
    {
      id: 5,
      user: {
        name: 'Dr. Sunita Verma',
        location: 'Sector 14, Noida',
        verified: true
      },
      content: 'The community park needs immediate attention. Broken swings, damaged benches, and overgrown grass are making it unusable for children and families. Park maintenance has been neglected for months. Kids have nowhere safe to play.',
      timestamp: '10 hours ago',
      reactions: { likes: 133, quotes: 86, shares: 48 },
      hasVideo: true,
      category: 'Public Spaces',
      governmentResponse: 'Under Review',
      priority: 'Medium'
    },
    {
      id: 6,
      user: {
        name: 'Vikash Singh',
        location: 'Sector 16, Noida',
        verified: true
      },
      content: 'Road outside our housing society is full of potholes. During monsoon, it becomes completely waterlogged. Ambulances and emergency vehicles face difficulty accessing our area. This is a life-threatening situation during emergencies.',
      timestamp: '12 hours ago',
      reactions: { likes: 241, quotes: 119, shares: 81 },
      hasVideo: true,
      category: 'Infrastructure',
      governmentResponse: 'Action Taken',
      priority: 'High'
    },
    {
      id: 7,
      user: {
        name: 'Anita Pal',
        location: 'Sector 20, Noida',
        verified: true
      },
      content: 'Street dogs in our locality have become aggressive. There was an incident yesterday where a child was chased. We need animal control services to address this safety concern immediately. Parents are scared to let children play outside.',
      timestamp: '14 hours ago',
      reactions: { likes: 152, quotes: 128, shares: 75 },
      hasVideo: false,
      category: 'Public Safety',
      governmentResponse: 'In Progress',
      priority: 'High'
    },
    {
      id: 8,
      user: {
        name: 'Deepak Mishra',
        location: 'Sector 22, Noida',
        verified: true
      },
      content: 'Sewage overflow near the main market area is causing health hazards. The smell is unbearable and shopkeepers are struggling. This needs immediate intervention from the sanitation department. Business is getting affected badly.',
      timestamp: '16 hours ago',
      reactions: { likes: 195, quotes: 121, shares: 93 },
      hasVideo: true,
      category: 'Sanitation',
      governmentResponse: 'Critical',
      priority: 'Critical'
    },
    {
      id: 9,
      user: {
        name: 'Mrs. Kavita Agarwal',
        location: 'Sector 25, Noida',
        verified: true
      },
      content: 'Public toilet facility near the bus stop is in terrible condition. No water, broken doors, and extremely unhygienic. This reflects poorly on our city\'s infrastructure and affects daily commuters especially women and children.',
      timestamp: '18 hours ago',
      reactions: { likes: 144, quotes: 125, shares: 60 },
      hasVideo: false,
      category: 'Public Facilities',
      governmentResponse: 'Under Review',
      priority: 'Medium'
    },
    {
      id: 10,
      user: {
        name: 'Rohit Sharma',
        location: 'Sector 11, Noida',
        verified: true
      },
      content: 'Electricity cuts have become frequent in our area. Yesterday we had 4 power cuts lasting 2-3 hours each. This is affecting work from home and online classes for students. Business operations are also getting disrupted.',
      timestamp: '20 hours ago',
      reactions: { likes: 179, quotes: 97, shares: 69 },
      hasVideo: false,
      category: 'Utilities',
      governmentResponse: 'Action Taken',
      priority: 'Medium'
    },
    {
      id: 11,
      user: {
        name: 'Suresh Chandra',
        location: 'Sector 8, Noida',
        verified: true
      },
      content: 'Metro connectivity to our sector is urgently needed. Daily commuters are facing huge difficulties traveling to Delhi and Gurgaon. Auto and taxi fares have become unaffordable. This is affecting employment opportunities for residents.',
      timestamp: '1 day ago',
      reactions: { likes: 456, quotes: 278, shares: 156 },
      hasVideo: false,
      category: 'Transportation',
      governmentResponse: 'In Progress',
      priority: 'High'
    },
    {
      id: 12,
      user: {
        name: 'Dr. Neha Gupta',
        location: 'Sector 19, Noida',
        verified: true
      },
      content: 'Healthcare center in our area lacks basic facilities. No proper emergency services, insufficient staff, and outdated equipment. During medical emergencies, we have to travel far distances. This is risking lives of senior citizens.',
      timestamp: '1 day ago',
      reactions: { likes: 298, quotes: 187, shares: 124 },
      hasVideo: true,
      category: 'Healthcare',
      governmentResponse: 'Under Review',
      priority: 'Critical'
    }
  ]);

  return (
    <div className="pb-20">
      <Header user={user} />
      
      <div className="px-4 py-2">
        {/* Government Demo Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-green-800 mb-2">🏛️ Government Demo Platform</h3>
          <p className="text-sm text-green-700 mb-2">
            Real-time citizen engagement platform for Noida Municipal Corporation
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-blue-600">2,847</div>
              <div className="text-gray-600">Active Citizens</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-red-600">156</div>
              <div className="text-gray-600">Open Issues</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">89%</div>
              <div className="text-gray-600">Resolution Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            📍 Showing issues from: <span className="font-semibold">{user.location}</span>
          </p>
        </div>

        {/* Today's Critical Alert */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-red-800 mb-1">🚨 Critical Issues Alert</h3>
          <p className="text-sm text-red-700">
            3 High Priority Issues • Government Action Required • Auto-escalated to Mayor's Office
          </p>
        </div>

        {/* Government Success Story */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-3 mb-4">
          <h3 className="font-semibold text-green-800 mb-1">✅ Recent Success</h3>
          <p className="text-sm text-green-700">
            Sector 15 Garbage Issue Resolved • 238 reactions • Completed in 24 hours
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <InstagramPostCard
            key={post.id}
            post={{
              id: post.id.toString(),
              user: {
                name: post.user.name,
                avatar: `https://ui-avatars.com/api/?name=${post.user.name}&background=random`,
                role: 'citizen'
              },
              content: post.content,
              mediaFiles: post.hasVideo ? [{ url: '/placeholder.svg', type: 'video' as const }] : [],
              location: post.user.location,
              createdAt: post.timestamp,
              likes: post.reactions.likes,
              comments: [],
              isLiked: false
            }}
            currentUser={user}
            onLike={handleLikePost}
            onComment={handleAddComment}
            onShare={handleSharePost}
            onBookmark={handleBookmarkPost}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Load More Section */}
      <div className="p-4">
        <div className="text-center py-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Load More Posts ({posts.length * 2}+ more issues)
          </button>
        </div>
        
        {/* Demo Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
          <p className="text-xs text-gray-600 text-center">
            🏛️ Citizen Sphere Demo • Powered by Aadhaar + DigiLocker Authentication
          </p>
        </div>
      </div>
    </div>
  );
};
