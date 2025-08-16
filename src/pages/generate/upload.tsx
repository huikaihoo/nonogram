import { UploadIcon, X } from 'lucide-react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload';

interface UploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const Upload: React.FC<UploadProps> = ({ files, setFiles }) => {
  const handleAccept = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]);
    }
  };

  const handleFileValidate = () => null;

  const handleUpload = async (
    uploadFiles: File[],
    options: {
      onProgress: (file: File, progress: number) => void;
      onSuccess: (file: File) => void;
    },
  ) => {
    for (const file of uploadFiles) {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        options.onProgress(file, progress);
      }
      options.onSuccess(file);
    }
  };

  return (
    <FileUpload
      value={files}
      onValueChange={setFiles}
      onAccept={handleAccept}
      onFileValidate={handleFileValidate}
      onUpload={handleUpload}
      accept="image/*"
      maxSize={10 * 1024 * 1024}
    >
      <FileUploadDropzone className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-3">
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Drag and drop here</p>
            <p className="text-xs text-muted-foreground">Supports image up to 10MB</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline">Browse Files</Button>
          </FileUploadTrigger>
        </div>
      </FileUploadDropzone>
      <FileUploadList className="space-y-2">
        {Array.from(files).map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
                <span className="sr-only">Delete</span>
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
};

export default Upload;
