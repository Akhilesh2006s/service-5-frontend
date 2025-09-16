// Media upload service for handling file uploads to MongoDB backend

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export interface MediaFile {
  id?: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  uploadedAt?: string;
  base64Data?: string;
  isRailwayUpload?: boolean;
  fallbackImage?: string;
}

export interface UploadResponse {
  success: boolean;
  mediaFiles: MediaFile[];
  error?: string;
}

class MediaService {
  private async uploadFile(file: File): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/upload/single`, {
        method: 'POST',
        headers,
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);
      
      return {
        id: result.filename, // Use filename as ID
        url: result.fileUrl,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async uploadFiles(files: File[]): Promise<UploadResponse> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file));
      const mediaFiles = await Promise.all(uploadPromises);

      return {
        success: true,
        mediaFiles
      };
    } catch (error) {
      console.error('Error uploading files:', error);
      return {
        success: false,
        mediaFiles: [],
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async deleteMedia(mediaId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/media/${mediaId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }

  // Fallback method for when backend is not available
  async createLocalMediaFile(file: File): Promise<MediaFile> {
    try {
      // Convert file to base64 data URL for persistence
      const base64Data = await this.fileToBase64(file);
      console.log('Creating local media file with base64:', {
        filename: file.name,
        type: file.type,
        size: file.size,
        base64Length: base64Data.length
      });
      
      return {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: base64Data,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        base64Data: base64Data
      };
    } catch (error) {
      console.error('Error creating local media file:', error);
      // Fallback to blob URL if base64 conversion fails
      const localUrl = URL.createObjectURL(file);
      return {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: localUrl,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        base64Data: null
      };
    }
  }

  // Convert file to base64 data URL
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  // Convert local media files to backend format
  async convertLocalToBackend(files: File[]): Promise<MediaFile[]> {
    try {
      // Try to upload to backend first
      const uploadResult = await this.uploadFiles(files);
      if (uploadResult.success) {
        return uploadResult.mediaFiles;
      }
    } catch (error) {
      console.warn('Backend upload failed, using local fallback:', error);
    }

    // Fallback to local base64 URLs if backend is not available
    const localMediaFiles = await Promise.all(
      files.map(file => this.createLocalMediaFile(file))
    );
    return localMediaFiles;
  }
}

export const mediaService = new MediaService();

