import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MediaTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testMediaUrls = [
    'https://service-5-backend-production.up.railway.app/uploads/files-1757928752454-33660079.png',
    'https://service-5-backend-production.up.railway.app/uploads/files-1757928783717-722410578.mp4',
    'https://service-5-backend-production.up.railway.app/api/test-image'
  ];

  const testMediaLoading = async () => {
    setLoading(true);
    const results = [];

    for (const url of testMediaUrls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        results.push({
          url,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          url,
          status: 'ERROR',
          ok: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  const testBackendEndpoints = async () => {
    setLoading(true);
    const results = [];

    const endpoints = [
      'https://service-5-backend-production.up.railway.app/api/health',
      'https://service-5-backend-production.up.railway.app/api/test-uploads',
      'https://service-5-backend-production.up.railway.app/api/test-image'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        results.push({
          endpoint,
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          ok: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    setTestResults(results);
    setLoading(false);
  };

  const createTestPostWithBase64 = async () => {
    setLoading(true);
    try {
      // Create a simple test image in base64
      const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      const testPost = {
        title: 'Test Post with Base64 Image',
        description: 'This is a test post to verify base64 fallback works',
        content: 'This is a test post to verify base64 fallback works',
        location: 'Test Location',
        priority: 'medium',
        department: 'Public Works',
        category: 'infrastructure',
        images: [{
          url: 'https://service-5-backend-production.up.railway.app/uploads/nonexistent-file.png', // This will fail
          base64Data: testImageBase64 // This should be used as fallback
        }],
        videos: [],
        user: {
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        status: 'pending'
      };

      const response = await fetch('https://service-5-backend-production.up.railway.app/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testPost)
      });

      if (response.ok) {
        const newPost = await response.json();
        results.push({
          endpoint: 'Create Test Post',
          status: response.status,
          ok: response.ok,
          data: { message: 'Test post created successfully', postId: newPost._id },
          timestamp: new Date().toISOString()
        });
      } else {
        results.push({
          endpoint: 'Create Test Post',
          status: response.status,
          ok: false,
          error: 'Failed to create test post',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      results.push({
        endpoint: 'Create Test Post',
        status: 'ERROR',
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Loading Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button onClick={testMediaLoading} disabled={loading}>
              {loading ? 'Testing...' : 'Test Media URLs'}
            </Button>
            <Button onClick={testBackendEndpoints} disabled={loading}>
              {loading ? 'Testing...' : 'Test Backend Endpoints'}
            </Button>
            <Button onClick={createTestPostWithBase64} disabled={loading}>
              {loading ? 'Creating...' : 'Create Test Post with Base64'}
            </Button>
            <Button onClick={() => {
              // Test the fallback system directly
              const testMedia = {
                url: 'https://service-5-backend-production.up.railway.app/uploads/nonexistent-file.png',
                type: 'image',
                base64Data: null,
                isRailwayUpload: true,
                fallbackImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
              };
              console.log('Test media object:', testMedia);
              alert('Check console for test media object');
            }}>
              Test Fallback Object
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Test Results:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                    <span className="text-sm text-gray-500">{result.timestamp}</span>
                  </div>
                  <div className="text-sm">
                    <strong>URL:</strong> {result.url || result.endpoint}
                  </div>
                  {result.contentType && (
                    <div className="text-sm">
                      <strong>Content-Type:</strong> {result.contentType}
                    </div>
                  )}
                  {result.error && (
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  {result.data && (
                    <div className="text-sm">
                      <strong>Response:</strong> 
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
