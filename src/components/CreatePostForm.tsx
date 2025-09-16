import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';
import { usePosts } from '@/contexts/PostsContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !location.trim()) {
      alert('Please fill in content and location');
      return;
    }

    if (content.trim().length < 5) {
      alert('Please provide a more detailed description (at least 5 characters)');
      return;
    }

    if (location.trim().length < 3) {
      alert('Location must be at least 3 characters long');
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

      // Send to backend first
      const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';
      
      console.log('Content state:', content);
      console.log('Content length:', content.length);
      console.log('Content trimmed:', content.trim());
      
      if (token) {
        try {
          // Prepare data for backend
          const postData = {
            title: content.trim().substring(0, 100) || 'Untitled Post', // Use first 100 chars as title, fallback if empty
            description: content.trim() || 'No description provided', // Fallback if empty
            category: 'other', // Default category
            priority: 'medium',
            location: location,
            department: 'general',
            images: uploadedMediaFiles.filter(f => f.type === 'image').map(f => f.url),
            videos: uploadedMediaFiles.filter(f => f.type === 'video').map(f => f.url),
          };

          console.log('Sending post to backend:', postData);

          const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
          });

          if (response.ok) {
            const backendPost = await response.json();
            console.log('Backend response:', backendPost);
            
            // Convert backend post to frontend format
            const newPost = {
              id: backendPost._id,
              user: { 
                name: backendPost.author?.name || user.name, 
                avatar: user.avatar || '', 
                role: backendPost.author?.role || user.role || 'citizen' 
              },
              content: backendPost.description,
              image: null,
              video: null,
              mediaFiles: uploadedMediaFiles,
              hashtags: allHashtags,
              location: backendPost.location,
              status: backendPost.status,
              assignedTo: null,
              createdAt: 'Just now',
              likes: backendPost.upvotes?.length || 0,
              comments: backendPost.comments?.length || 0,
              shares: 0
            };

            console.log('Converted post for frontend:', newPost);
            onPostCreated(newPost);
          } else {
            const error = await response.json();
            console.error('Backend error:', error);
            console.error('Response status:', response.status);
            throw new Error(error.message || `Failed to create post (${response.status})`);
          }
        } catch (error) {
          console.error('Error sending to backend:', error);
          alert(`Error creating post: ${error.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }
      } else {
        // Fallback for unauthenticated users
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
        onPostCreated(newPost);
      }
      
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
        <Button type="submit" disabled={loading || !content.trim() || !location.trim() || content.trim().length < 5 || location.trim().length < 3}>
          {loading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

