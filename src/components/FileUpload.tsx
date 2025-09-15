import React, { useRef, useState } from 'react';
import { Camera, Video, X, Upload, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/*', 'video/*'],
  className
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        alert(`File ${file.name} is not a supported type.`);
        return;
      }

      // Check if it's a video and validate duration (for 1 minute limit)
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (video.duration > 60) {
            alert(`Video ${file.name} is too long. Maximum duration is 1 minute.`);
            return;
          }
          validFiles.push(file);
          if (validFiles.length === fileArray.length) {
            updateFiles(validFiles);
          }
        };
        video.src = URL.createObjectURL(file);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0 && !validFiles.some(f => f.type.startsWith('video/'))) {
      updateFiles(validFiles);
    }
  };

  const updateFiles = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-4 w-4" />;
    }
    return <Upload className="h-4 w-4" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="flex justify-center space-x-4">
            <Camera className="h-8 w-8 text-muted-foreground" />
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Drop files here or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Images and videos up to {maxSize}MB each. Videos max 1 minute.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Upload Buttons */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFiles(target.files);
            };
            input.click();
          }}
        >
          <Camera className="h-4 w-4 mr-2" />
          Add Photos
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFiles(target.files);
            };
            input.click();
          }}
        >
          <Video className="h-4 w-4 mr-2" />
          Add Videos
        </Button>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files ({selectedFiles.length}/{maxFiles})</p>
          <div className="grid grid-cols-1 gap-2">
            {selectedFiles.map((file, index) => (
              <Card key={index} className="p-3">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                          {file.type.startsWith('video/') && ' • Video'}
                          {file.type.startsWith('image/') && ' • Image'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


