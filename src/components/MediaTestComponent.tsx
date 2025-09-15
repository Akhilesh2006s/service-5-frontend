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
