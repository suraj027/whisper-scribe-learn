
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, File, X, AlertCircle, Info } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';

const ACCEPTED_FILE_TYPES = ['application/pdf', '.pdf', '.doc', '.docx', 'application/vnd.google-apps.document'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
}

const UploadPage: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Handle file selection from input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  // Process files
  const handleFiles = useCallback((fileList: FileList) => {
    const files = Array.from(fileList);
    const newFiles: UploadedFile[] = [];
    let hasErrors = false;
    
    files.forEach(file => {
      // Check file type
      const fileType = file.type.toLowerCase();
      const isAcceptedType = ACCEPTED_FILE_TYPES.some(type => {
        if (type.startsWith('.')) {
          // Check extension
          return file.name.toLowerCase().endsWith(type);
        } else {
          // Check MIME type
          return fileType === type;
        }
      });
      
      // Validate file
      if (!isAcceptedType) {
        toast.error(`${file.name} is not a supported file type`);
        hasErrors = true;
      } else if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 50MB size limit`);
        hasErrors = true;
      } else {
        newFiles.push({
          id: `file-${Date.now()}-${newFiles.length}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadProgress: 0
        });
      }
    });

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }

    return !hasErrors;
  }, []);

  // Open file dialog
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove a file from the list
  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file upload
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    
    // Simulate file upload with progress
    for (const file of uploadedFiles) {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, uploadProgress: progress } : f
        ));
        
        // Add a delay to simulate upload time
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    toast.success('Files uploaded successfully!');
    setIsUploading(false);
    
    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload PDFs and Google Docs to analyze with AI
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>
              Supported file types: PDF and Google Docs (max 50MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drop zone */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 transition-all text-center",
                isDragging ? "border-primary bg-primary/5 drag-active" : "border-muted-foreground/25 hover:border-muted-foreground/50",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleButtonClick}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg">Drag and drop files</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  or click to browse from your device
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" disabled={isUploading}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>
            </div>

            {/* File list */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Selected files</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <File className="h-5 w-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {file.uploadProgress > 0 && file.uploadProgress < 100 ? (
                          <div className="w-20">
                            <Progress value={file.uploadProgress} className="h-2" />
                          </div>
                        ) : file.uploadProgress === 100 ? (
                          <span className="text-xs text-green-500">Complete</span>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info alerts */}
            <div className="mt-6 space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>File Size Limit</AlertTitle>
                <AlertDescription>
                  Each file must be under 50MB. For larger files, consider splitting them into smaller documents.
                </AlertDescription>
              </Alert>
              
              <Alert variant="outline">
                <Info className="h-4 w-4" />
                <AlertTitle>Google Docs Integration</AlertTitle>
                <AlertDescription>
                  To import Google Docs, connect your Google Drive account in Settings.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploadedFiles.length === 0 || isUploading}
              className="sm:w-auto w-full"
            >
              {isUploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
