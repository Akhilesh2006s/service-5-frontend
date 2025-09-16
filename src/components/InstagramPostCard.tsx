import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface InstagramPostCardProps {
  post: {
    id: string;
    user: {
      name: string;
      avatar: string;
      role: string;
    };
    content: string;
    mediaFiles: Array<{
      url: string;
      type: 'image' | 'video';
    }>;
    location?: string;
    createdAt: string;
    likes: number;
    comments: Array<{
      id: string;
      author: string;
      text: string;
      createdAt: string;
    }>;
    isLiked?: boolean;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

export const InstagramPostCard: React.FC<InstagramPostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handlePreviousSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(post.mediaFiles.length - 1, prev + 1));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment.trim());
      setNewComment('');
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg mb-6 max-w-2xl mx-auto">
      {/* DEBUG: Instagram Post Card is working! */}
      <div className="bg-yellow-500 text-black p-2 text-center text-sm font-bold">
        🎉 INSTAGRAM STYLE POST CARD IS WORKING! 🎉
      </div>
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 p-0.5">
              <img
                src={post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.name}&background=random`}
                alt={post.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="font-semibold text-sm text-white">{post.user.name}</div>
            {post.location && (
              <div className="text-xs text-gray-400">{post.location}</div>
            )}
          </div>
        </div>
        <button className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Section */}
      <div className="relative bg-black">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {post.mediaFiles.map((media, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={`Post ${index + 1}`}
                    className="w-full h-auto max-h-[600px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-auto max-h-[600px] object-contain"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {post.mediaFiles.length > 1 && (
          <>
            <button
              onClick={handlePreviousSlide}
              disabled={currentSlide === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                currentSlide === 0 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              disabled={currentSlide === post.mediaFiles.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                currentSlide === post.mediaFiles.length - 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {post.mediaFiles.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {post.mediaFiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className={`transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsCommenting(!isCommenting)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => onBookmark(post.id)}
            className="text-gray-700 hover:text-gray-500 transition-colors"
          >
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes Count */}
        {post.likes > 0 && (
          <div className="font-semibold text-sm mb-2 text-white">
            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
          </div>
        )}

        {/* Post Content */}
        <div className="text-sm mb-2 text-white">
          <span className="font-semibold mr-2">{post.user.name}</span>
          <span>{post.content}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mb-2">
            {post.comments.length > 2 && (
              <button className="text-gray-400 text-sm mb-1">
                View all {post.comments.length} comments
              </button>
            )}
            {post.comments.slice(-2).map((comment) => (
              <div key={comment.id} className="text-sm mb-1 text-white">
                <span className="font-semibold mr-2">{comment.author}</span>
                <span>{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Time */}
        <div className="text-gray-400 text-xs mb-3">
          {formatTimeAgo(post.createdAt)}
        </div>

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm border-none outline-none placeholder-gray-400 bg-transparent text-white"
          />
          {newComment.trim() && (
            <button
              type="submit"
              className="text-blue-500 font-semibold text-sm hover:text-blue-700"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
