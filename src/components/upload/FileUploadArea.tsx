"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUpload } from "react-icons/fa";

interface FileUploadAreaProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (files: FileList) => void;
}

export function FileUploadArea({ isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }: FileUploadAreaProps) {
  return (
    <Card className="p-6 mb-6">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drop photos here or click to browse
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Support for JPG, PNG, GIF up to 10MB each
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && onFileSelect(e.target.files)}
          className="hidden"
          id="file-upload"
          title="Upload photos"
        />
        <Button 
          variant="outline" 
          className="cursor-pointer"
          onClick={() => {
            const fileInput = document.getElementById('file-upload');
            fileInput?.click();
          }}
        >
          Browse Files
        </Button>
      </div>
    </Card>
  );
}