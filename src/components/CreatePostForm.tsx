import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';
import { usePosts } from '@/contexts/PostsContext';

interface CreatePostFormProps {
  user: any;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ user, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { uploadMediaFiles } = usePosts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !location.trim()) {
      alert('Please fill in content and location');
      return;
    }

    setLoading(true);
    
    try {
      // Extract hashtags from content and hashtags field
      const allHashtags = [...new Set([
        ...content.match(/#\w+/g) || [],
        ...hashtags.split(' ').filter(tag => tag.startsWith('#'))
      ])];

      // Upload files using the media service
      let uploadedMediaFiles = [];
      
      if (selectedFiles.length > 0) {
        console.log('Uploading files using media service:', selectedFiles);
        uploadedMediaFiles = await uploadMediaFiles(selectedFiles);
        console.log('Media files uploaded successfully:', uploadedMediaFiles);
      }

      // Create the new post with uploaded media files
      const newPost = {
        id: Date.now(),
        user: { 
          name: user.name, 
          avatar: user.avatar || '', 
          role: user.role || 'citizen' 
        },
        content: content,
        image: null,
        video: null,
        mediaFiles: uploadedMediaFiles,
        hashtags: allHashtags,
        location: location,
        status: 'pending',
        assignedTo: null,
        createdAt: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0
      };

      console.log('Created post with media files:', newPost);
      onPostCreated(newPost);
      
      // Reset form
      setContent('');
      setHashtags('');
      setLocation('');
      setSelectedFiles([]);
      onClose();
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">What's the problem?</label>
        <Textarea
          placeholder="Describe the issue you're facing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1"
          rows={4}
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Hashtags (optional)</label>
        <Input
          placeholder="#streetlights #safety #mainstreet"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Location *</label>
        <Input
          placeholder="Where is this problem located?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Add Photos/Videos (optional)</label>
        <FileUpload
          onFileSelect={setSelectedFiles}
          maxFiles={5}
          maxSize={10}
          acceptedTypes={['image/*', 'video/*']}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !content.trim() || !location.trim()}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};
