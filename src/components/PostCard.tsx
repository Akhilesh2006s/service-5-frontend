
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: any;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [userReactions, setUserReactions] = useState({
    liked: false,
    quoted: false,
    shared: false
  });

  const handleReaction = (type: 'liked' | 'quoted' | 'shared') => {
    setUserReactions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Action Taken': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">
            {post.user.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{post.user.name}</h3>
            {post.user.verified && (
              <span className="text-green-600 text-xs">✓</span>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mb-2">{post.user.location} • {post.timestamp}</p>
          
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={`text-xs px-2 py-1 ${getPriorityColor(post.priority)}`}>
              {post.priority} Priority
            </Badge>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          
          <p className="text-gray-900 text-sm mb-3 leading-relaxed">{post.content}</p>
          
          {post.hasVideo && (
            <div className="bg-gray-100 rounded-lg p-8 mb-3 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">▶️</span>
                </div>
                <p className="text-sm text-gray-600">Authentic Video Evidence</p>
                <p className="text-xs text-gray-500">Recorded in-app • Verified</p>
              </div>
            </div>
          )}

          {/* Government Response Status */}
          <div className={`border rounded-lg p-2 mb-3 ${getResponseStatusColor(post.governmentResponse)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-xs">🏛️</span>
                <span className="text-xs font-medium">Government Status:</span>
                <span className="text-xs font-semibold">{post.governmentResponse}</span>
              </div>
              {post.governmentResponse === 'Resolved' && (
                <span className="text-xs">✅</span>
              )}
              {post.governmentResponse === 'Critical' && (
                <span className="text-xs">🚨</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('liked')}
              className={cn(
                "flex items-center space-x-1 text-xs",
                userReactions.liked ? "text-red-600" : "text-gray-600"
              )}
            >
              <span>{userReactions.liked ? '❤️' : '🤍'}</span>
              <span>{post.reactions.likes + (userReactions.liked ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('quoted')}
              className={cn(
                "flex items-center space-x-1 text-xs",
                userReactions.quoted ? "text-blue-600" : "text-gray-600"
              )}
            >
              <span>💬</span>
              <span>{post.reactions.quotes + (userReactions.quoted ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReaction('shared')}
              className={cn(
                "flex items-center space-x-1 text-xs",
                userReactions.shared ? "text-green-600" : "text-gray-600"
              )}
            >
              <span>📤</span>
              <span>{post.reactions.shares + (userReactions.shared ? 1 : 0)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
