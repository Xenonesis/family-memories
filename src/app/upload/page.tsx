"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
// Card components are used in child components
import { FaUpload, FaArrowLeft, FaHome, FaSpinner, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults, uploadPhoto } from "@/lib/database";
import { uploadFile } from "@/lib/storage";
import { User } from "@supabase/supabase-js";
import { ProfileNav } from "@/components/ProfileNav";
import { VaultSelector } from "@/components/upload/VaultSelector";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { FileList } from "@/components/upload/FileList";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UserVaultResponse } from '@/lib/types';

interface Vault {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_by: string;
  created_at: string;
  role: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'skipped';
  errorMessage?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [selectedVault, setSelectedVault] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      setUser(currentUser);
      const { data, error: fetchError } = await getUserVaults(currentUser.id);
      if (!fetchError && data) {
        const fetchedVaults = (data as UserVaultResponse[]).map(item => ({
          id: item.vaults.id,
          name: item.vaults.name,
          description: item.vaults.description,
          color: item.vaults.color,
          created_by: item.vaults.created_by,
          created_at: item.vaults.created_at,
          role: item.role,
        }));
        setVaults(fetchedVaults);
      } else if (fetchError) {
        setGeneralError(fetchError.message);
      }
    };

    loadData();
  }, [router]);

  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = [];
    const maxSize = 10 * 1024 * 1024;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && file.size <= maxSize) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        newFiles.push({
          id,
          file,
          preview,
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: "",
          status: 'pending'
        });
      } else {
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: '',
          title: file.name,
          description: `Skipped: Invalid type (${file.type}) or size (${(file.size / 1024 / 1024).toFixed(2)}MB > 10MB)`,
          status: 'skipped'
        });
      }
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const updateFileInfo = (id: string, field: 'title' | 'description', value: string) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, [field]: value } : file
      )
    );
  };

  const handleVaultSelect = (vaultId: string) => {
    setSelectedVault(vaultId);
    setGeneralError("");
  };

  const handleUpload = async () => {
    if (!selectedVault || uploadedFiles.length === 0 || !user) {
      setGeneralError("Please select a vault and ensure there are files to upload.");
      return;
    }

    setIsUploading(true);
    setGeneralError("");
    setUploadProgress(0);

    const filesToUpload = uploadedFiles.filter(f => f.status === 'pending');
    let allSuccessful = true;
    let completedCount = 0;

    for (const fileData of filesToUpload) {
      // Update status to uploading
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
      );

      try {
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await uploadFile(
          fileData.file,
          user.id,
          selectedVault
        );

        if (uploadError) {
          throw uploadError;
        }

        // Save photo record to database
        const { error: dbError } = await uploadPhoto(
          selectedVault,
          user.id,
          fileData.title,
          fileData.description,
          uploadData.publicUrl
        );

        if (dbError) {
          throw dbError;
        }

        // Update status to success
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, status: 'success' } : f)
        );

        completedCount++;
        setUploadProgress(Math.round((completedCount / filesToUpload.length) * 100));

      } catch (error: unknown) {
        allSuccessful = false;
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, status: 'failed', errorMessage: error instanceof Error ? error.message : "Upload failed" } : f)
        );
        
        completedCount++;
        setUploadProgress(Math.round((completedCount / filesToUpload.length) * 100));
      }
    }

    setIsUploading(false);
    setUploadComplete(true);

    if (allSuccessful) {
      setTimeout(() => {
        router.push(`/vault/${selectedVault}`);
      }, 1500);
    } else {
      setGeneralError("Some files failed to upload. Please review the list above.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 p-6">
      <ProfileNav />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Link href="/dashboard">
            <Button 
              variant="outline" 
              size="sm"
              className="shadow-sm hover:shadow-md transition-all duration-300"
            >
              <FaHome className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight flex items-center">
                <FaUpload className="mr-4 text-violet-600" />
                Upload Photos
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Add new memories to your family collection
              </p>
            </div>
          </div>
        </motion.div>

        <VaultSelector 
          vaults={vaults}
          selectedVault={selectedVault}
          onVaultSelect={handleVaultSelect}
          error={generalError}
        />

        <FileUploadArea 
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onFileSelect={handleFileSelect}
        />

        <FileList 
          files={uploadedFiles}
          isUploading={isUploading}
          onRemoveFile={removeFile}
          onUpdateFile={updateFileInfo}
        />

        {/* Upload Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-end gap-4 items-center"
        >
          {isUploading && (
            <div className="flex-1 mr-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Uploading: {uploadProgress}% complete
              </div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {uploadComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg"
              >
                <FaCheck className="w-4 h-4" />
                <span>Upload Complete!</span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <Button 
                  variant="outline" 
                  onClick={() => router.back()} 
                  disabled={isUploading}
                  className="shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Cancel
                </Button>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedVault || uploadedFiles.filter(f => f.status === 'pending').length === 0 || isUploading}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 px-6"
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="w-4 h-4 mr-2" />
                        Upload {uploadedFiles.filter(f => f.status === 'pending').length} Photos
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Selected Vault Info */}
        {selectedVault && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <p>Photos will be uploaded to your selected vault</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}