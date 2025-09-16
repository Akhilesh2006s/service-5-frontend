import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    username: string;
    role: string;
    avatar?: string;
  };
  category: string;
  priority: string;
  location: string;
  department: string;
  createdAt: string;
  mediaFiles?: Array<{
    url: string;
    type: 'image' | 'video';
    filename: string;
  }>;
  likes?: number;
  quotes?: number;
  disagrees?: number;
  isLiked?: boolean;
  isQuoted?: boolean;
  isDisagreed?: boolean;
}

interface EnhancedPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onQuote?: (postId: string) => void;
  onDisagree?: (postId: string) => void;
  onShare?: (postId: string) => void;
  className?: string;
}

export const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({
  post,
  onLike,
  onQuote,
  onDisagree,
  onShare,
  className
}) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Set<string>>(new Set());

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleImageError = (url: string) => {
    setImageError(prev => new Set(prev).add(url));
  };

  const renderMedia = () => {
    if (!post.mediaFiles || post.mediaFiles.length === 0) return null;

    return (
      <div className={`grid gap-2 ${
        post.mediaFiles.length === 1 ? 'grid-cols-1' :
        post.mediaFiles.length === 2 ? 'grid-cols-2' :
        post.mediaFiles.length === 3 ? 'grid-cols-2' :
        post.mediaFiles.length === 4 ? 'grid-cols-2' :
        'grid-cols-3'
      }`}>
        {post.mediaFiles.map((media, index) => (
          <div key={index} className="relative group">
            {media.type === 'image' ? (
              <div className="relative">
                {!imageError.has(media.url) ? (
                  <img
                    src={media.url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setExpandedImage(media.url)}
                    onError={() => handleImageError(media.url)}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-2xl mb-2">📷</div>
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <video
                  src={media.url}
                  controls
                  className="w-full h-48 object-cover rounded-lg"
                  preload="metadata"
                  onError={() => handleImageError(media.url)}
                >
                  Your browser does not support the video tag.
                </video>
                {/* Show play icon for videos */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className={cn("w-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {post.author.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {post.author.role}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  @{post.author.username} • {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Post Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>

          {/* Media */}
          {renderMedia()}

          {/* Post Meta */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
            <Badge className={cn("text-xs", getPriorityColor(post.priority))}>
              {post.priority}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {post.department}
            </Badge>
            <Badge variant="outline" className="text-xs">
              📍 {post.location}
            </Badge>
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike?.(post.id)}
                className={cn(
                  "flex items-center space-x-2 h-8 px-3",
                  post.isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
                )}
              >
                <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                <span className="text-sm">{post.likes || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuote?.(post.id)}
                className={cn(
                  "flex items-center space-x-2 h-8 px-3",
                  post.isQuoted ? "text-blue-600 hover:text-blue-700" : "text-gray-600 hover:text-blue-600"
                )}
              >
                <MessageCircle className={cn("h-4 w-4", post.isQuoted && "fill-current")} />
                <span className="text-sm">{post.quotes || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDisagree?.(post.id)}
                className={cn(
                  "flex items-center space-x-2 h-8 px-3",
                  post.isDisagreed ? "text-orange-600 hover:text-orange-700" : "text-gray-600 hover:text-orange-600"
                )}
              >
                <ThumbsDown className={cn("h-4 w-4", post.isDisagreed && "fill-current")} />
                <span className="text-sm">{post.disagrees || 0}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 h-8 px-3 text-gray-600 hover:text-gray-800"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
              onClick={() => setExpandedImage(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
