"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FaTrash, FaImage } from "react-icons/fa";
import Image from "next/image";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'skipped';
  errorMessage?: string;
}

interface FileListProps {
  files: UploadedFile[];
  isUploading: boolean;
  onRemoveFile: (id: string) => void;
  onUpdateFile: (id: string, field: 'title' | 'description', value: string) => void;
}

export function FileList({ files, isUploading, onRemoveFile, onUpdateFile }: FileListProps) {
  if (files.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed': return 'border-red-400 bg-red-50 dark:bg-red-900/20';
      case 'success': return 'border-green-400 bg-green-50 dark:bg-green-900/20';
      case 'uploading': return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'skipped': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading': return <span className="ml-2 text-blue-600 text-sm">Uploading...</span>;
      case 'success': return <span className="ml-2 text-green-600 text-sm">Success</span>;
      case 'failed': return <span className="ml-2 text-red-600 text-sm">Failed</span>;
      case 'skipped': return <span className="ml-2 text-yellow-600 text-sm">Skipped</span>;
      default: return null;
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Photos to Upload
        </h3>
        <Badge variant="secondary">
          {files.length} files
        </Badge>
      </div>

      <div className="space-y-4">
        {files.map((file) => (
          <div key={file.id} className={`flex gap-4 p-4 border rounded-lg items-center ${getStatusColor(file.status)}`}>
            {file.preview ? (
              <Image
                src={file.preview}
                alt={file.title}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <FaImage className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <div className="font-medium text-gray-900 dark:text-white">
                {file.title}
                {getStatusText(file.status)}
              </div>
              
              {file.status !== 'skipped' ? (
                <>
                  <Input
                    value={file.title}
                    onChange={(e) => onUpdateFile(file.id, 'title', e.target.value)}
                    placeholder="Photo title"
                    className="font-medium"
                    disabled={isUploading}
                  />
                  <Textarea
                    value={file.description}
                    onChange={(e) => onUpdateFile(file.id, 'description', e.target.value)}
                    placeholder="Add a description (optional)"
                    rows={2}
                    disabled={isUploading}
                  />
                </>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">{file.description}</p>
              )}
              
              {file.errorMessage && (
                <p className="text-sm text-red-600">{file.errorMessage}</p>
              )}
            </div>
            
            {file.status !== 'uploading' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(file.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}