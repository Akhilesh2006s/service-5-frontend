import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Camera, Video, FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { CATEGORIES, PRIORITIES, DEFAULT_DEPARTMENTS } from '@/constants/categories';

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const CitizenCreateReportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    department: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  // Fetch departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/departments/public`);
      if (response.ok) {
        const data = await response.json();
        // Transform API data to match our format
        const transformedDepartments = data.map((dept: any) => ({
          value: dept.code.toLowerCase(),
          label: dept.name
        }));
        setDepartments(transformedDepartments);
      } else {
        // Fallback to default departments if API fails
        setDepartments(DEFAULT_DEPARTMENTS);
      }
    } catch (error) {
      // Fallback to default departments
      setDepartments(DEFAULT_DEPARTMENTS);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          department: formData.department || 'general', // Provide default if not selected
          images: [], // For now, we'll handle file uploads separately
          videos: []
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Issue reported successfully!",
        });
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'medium',
          location: '',
          department: ''
        });
        setImages([]);
        setVideos([]);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to report issue');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to report issue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h1>
        <p className="text-gray-600">Help improve your community by reporting issues</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
            <CardDescription>Provide basic information about the issue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Brief description of the issue"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about the issue..."
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Where is this issue located? (e.g., Sector 15, Noida)"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category and Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
            <CardDescription>Help us categorize and prioritize your report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange('category', category.value)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg mr-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      formData.priority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Badge className={priority.color}>
                      {priority.label}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={departmentsLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">
                  {departmentsLoading ? 'Loading departments...' : 'Select department (optional)'}
                </option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Media Evidence</CardTitle>
            <CardDescription>Add photos or videos to support your report (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload photos</span>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Video className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload videos</span>
                </label>
              </div>
              
              {videos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{video.name}</span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                location: '',
                department: ''
              });
              setImages([]);
              setVideos([]);
            }}
          >
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.title || !formData.description || !formData.location || !formData.category}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Reporting...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Report Issue
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
