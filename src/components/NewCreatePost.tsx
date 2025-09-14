import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, DEFAULT_DEPARTMENTS } from '@/constants/categories';

interface NewCreatePostProps {
  user: any;
  onClose: () => void;
}

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export const NewCreatePost: React.FC<NewCreatePostProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    department: ''
  });

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Post Created",
          description: "Your issue has been submitted successfully!",
        });
        onClose();
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 pb-24">
      <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Report an Issue</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Help improve your community by reporting problems
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location *</Label>
              <Input
                id="location"
                placeholder="Where is this issue located? (e.g., Sector 15, Noida)"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-semibold text-gray-700">Relevant Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Issue"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
