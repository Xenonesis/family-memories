"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaUpload, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults, uploadPhoto } from "@/lib/database";
import { uploadFile } from "@/lib/storage";
import { User } from "@supabase/supabase-js";
import { ProfileNav } from "@/components/ProfileNav";
import { VaultSelector } from "@/components/upload/VaultSelector";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { FileList } from "@/components/upload/FileList";

interface Vault {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_by: string;
  created_at: string;
}

interface VaultMembership {
  role: string;
  vaults: Vault;
}

interface VaultMembershipResponse {
  role: string;
  vaults: {
    id: string;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
    created_by: string;
  }[];
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
  const [vaultMemberships, setVaultMemberships] = useState<VaultMembership[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generalError, setGeneralError] = useState("");

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
        const validMemberships: VaultMembership[] = [];
        
        data.forEach((item: VaultMembershipResponse) => {
          if (item.vaults && Array.isArray(item.vaults)) {
            item.vaults.forEach((vault) => {
              validMemberships.push({
                role: item.role,
                vaults: vault
              });
            });
          }
        });
        
        setVaultMemberships(validMemberships);
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

    const filesToUpload = uploadedFiles.filter(f => f.status === 'pending');
    let allSuccessful = true;

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

      } catch (error: unknown) {
        allSuccessful = false;
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, status: 'failed', errorMessage: error instanceof Error ? error.message : "Upload failed" } : f)
        );
      }
    }

    setIsUploading(false);

    if (allSuccessful) {
      router.push(`/vault/${selectedVault}`);
    } else {
      setGeneralError("Some files failed to upload. Please review the list above.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <ProfileNav />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Upload Photos
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add new memories to your family vault
            </p>
          </div>
        </div>

        <VaultSelector 
          vaultMemberships={vaultMemberships}
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
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedVault || uploadedFiles.filter(f => f.status === 'pending').length === 0 || isUploading}
            className="flex items-center gap-2"
          >
            <FaUpload className="w-4 h-4" />
            {isUploading ? "Uploading..." : `Upload ${uploadedFiles.filter(f => f.status === 'pending').length} Photos`}
          </Button>
        </div>
      </div>
    </div>
  );
}