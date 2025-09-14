
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreatePostProps {
  user: any;
  onClose: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ user, onClose }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedVideo, setHasRecordedVideo] = useState(false);

  const categories = [
    'Infrastructure',
    'Sanitation',
    'Traffic',
    'Public Safety',
    'Water Supply',
    'Electricity',
    'Healthcare',
    'Education',
    'Environment',
    'Other'
  ];

  const handleVideoRecord = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setHasRecordedVideo(true);
    }, 3000);
  };

  const handlePost = () => {
    // Here you would normally send the post to your backend
    console.log('Posting:', { content, category, hasVideo: hasRecordedVideo });
    onClose();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <h1 className="font-semibold">New Problem Report</h1>
        <Button 
          onClick={handlePost}
          disabled={!content.trim() || !category}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Post
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.location}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Problem Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Describe the Problem</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the governance issue you want to report..."
            className="min-h-32"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{content.length}/500 characters</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Add Video Evidence (Optional)</label>
          
          {!hasRecordedVideo ? (
            <Button
              onClick={handleVideoRecord}
              disabled={isRecording}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isRecording ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span>Recording... ({isRecording ? '3' : '0'}s)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>📹</span>
                  <span>Record Video Evidence</span>
                </div>
              )}
            </Button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-green-800">Video recorded successfully</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHasRecordedVideo(false)}
                  className="text-red-600"
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Videos are recorded within the app to ensure authenticity and prevent fake content.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Posts with more reactions and quotes will be prioritized for government attention.
          </p>
        </div>
      </div>
    </div>
  );
};
