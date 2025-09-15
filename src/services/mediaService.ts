// Media upload service for handling file uploads to MongoDB backend

const API_BASE_URL = 'https://service-5-backend-production.up.railway.app/api';

export interface MediaFile {
  id?: string;
  url: string;
  type: 'image' | 'video';
  filename: string;
  size: number;
  uploadedAt?: string;
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
    formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');

    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.id,
        url: result.url,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        filename: file.name,
        size: file.size,
        uploadedAt: result.uploadedAt || new Date().toISOString()
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
  createLocalMediaFile(file: File): MediaFile {
    return {
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };
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

    // Fallback to local URLs if backend is not available
    return files.map(file => this.createLocalMediaFile(file));
  }
}

export const mediaService = new MediaService();
