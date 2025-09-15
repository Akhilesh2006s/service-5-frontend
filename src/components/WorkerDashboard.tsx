import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Camera, Video, Upload, User, MapPin, Calendar, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface WorkerDashboardProps {
  worker: any;
  onLogout: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ worker, onLogout }) => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofVideo, setProofVideo] = useState<File | null>(null);
  const [proofDescription, setProofDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('workerToken') || localStorage.getItem('token');
      const response = await fetch('https://service-5-backend-production.up.railway.app/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const tasksData = await response.json();
        console.log('Tasks fetched for worker:', tasksData);
        
        // Separate assigned and completed tasks
        const assigned = tasksData.filter((task: any) => task.status === 'assigned' || task.status === 'in-progress');
        const completed = tasksData.filter((task: any) => task.status === 'completed' || task.status === 'closed');
        
        setAssignedTasks(assigned);
        setCompletedTasks(completed);
      } else {
        console.error('Failed to fetch tasks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmitProof = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('workerToken') || localStorage.getItem('token');
      
      // Upload proof files if any
      let proofUrls = [];
      if (proofImage || proofVideo) {
        const formData = new FormData();
        if (proofImage) formData.append('files', proofImage);
        if (proofVideo) formData.append('files', proofVideo);
        
        const uploadResponse = await fetch('https://service-5-backend-production.up.railway.app/api/upload/multiple', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          proofUrls = uploadData.files.map((file: any) => ({
            url: `https://service-5-backend-production.up.railway.app${file.fileUrl}`,
            description: proofDescription,
            uploadedAt: new Date()
          }));
        }
      }

      // Update task status
      const response = await fetch(`https://service-5-backend-production.up.railway.app/api/tasks/${selectedTask._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'completed',
          workerRemarks: proofDescription,
          workProof: proofUrls
        })
      });

      if (response.ok) {
        // Refresh tasks
        await fetchTasks();
        
        setShowProofDialog(false);
        setSelectedTask(null);
        setProofImage(null);
        setProofVideo(null);
        setProofDescription('');
        
        alert('Task completed successfully!');
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error submitting proof:', error);
      alert('Failed to submit proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Welcome, {worker.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {worker.designation} - {worker.department}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Assigned Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{assignedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedTasks.filter(t => t.status === 'completed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Success Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {assignedTasks.length + completedTasks.length > 0 
                      ? Math.round((completedTasks.length / (assignedTasks.length + completedTasks.length)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Assigned Tasks</h2>
          <div className="grid gap-6">
            {assignedTasks.map((task) => (
              <Card key={task._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {task.post?.title || 'Task'}
                        </h3>
                        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                          {task.priority} priority
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {task.description}
                      </p>
                      
                      {task.instructions && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Instructions:</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{task.instructions}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{task.post?.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Assigned by: {task.assignedBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Status: {task.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setSelectedTask(task);
                        setShowProofDialog(true);
                      }}
                      className="ml-4"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Submit Proof
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Completed Tasks</h2>
            <div className="grid gap-6">
              {completedTasks.map((task) => (
                <Card key={task._id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {task.post?.title || 'Task'}
                          </h3>
                          <Badge className={task.status === 'closed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}>
                            {task.status === 'closed' ? 'Closed' : 'Completed'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {task.description}
                        </p>
                        
                        {task.workerRemarks && (
                          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Your Remarks:</p>
                            <p className="text-sm text-green-700 dark:text-green-300">{task.workerRemarks}</p>
                          </div>
                        )}
                        
                        {task.workProof && task.workProof.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Proof Submitted:</p>
                            <div className="space-y-2">
                              {task.workProof.map((proof: any, index: number) => (
                                <div key={index} className="text-sm text-blue-700 dark:text-blue-300">
                                  <a href={proof.url} target="_blank" rel="noopener noreferrer" className="underline">
                                    Proof {index + 1}
                                  </a>
                                  {proof.description && <span> - {proof.description}</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>
                              {task.status === 'closed' 
                                ? 'Task closed and approved' 
                                : 'Proof submitted and pending review'
                              }
                            </span>
                          </div>
                          {task.completionDate && (
                            <div className="mt-1">
                              Completed: {new Date(task.completionDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submit Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Proof of Completion</DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedTask.post?.title || 'Task'}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedTask.description}
                </p>
                {selectedTask.instructions && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Instructions:</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{selectedTask.instructions}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Location: {selectedTask.post?.location || 'Location not specified'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Priority: {selectedTask.priority}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Description of Work Done</label>
                <Textarea
                  value={proofDescription}
                  onChange={(e) => setProofDescription(e.target.value)}
                  placeholder="Describe what work was completed..."
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Photo Proof</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Video Proof</label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setProofVideo(e.target.files?.[0] || null)}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowProofDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitProof}
                  disabled={loading || !proofDescription.trim()}
                >
                  {loading ? 'Submitting...' : 'Submit Proof'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};