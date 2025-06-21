"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FaUpload, FaTrash, FaImage, FaArrowLeft, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults, uploadPhoto } from "@/lib/database";
import { uploadFile } from "@/lib/storage";
import { User } from "@supabase/supabase-js"; // Import User type

// Define the interface for a single vault as returned by the database query
interface Vault {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_by: string;
  created_at: string;
  // Note: 'updated_at' is not returned by the 'getUserVaults' select statement
}

// Define the interface for our processed vault membership
interface VaultMembership {
  role: string;
  vaults: Vault;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'skipped'; // Add status field
  errorMessage?: string; // Add optional error message
}

export default function UploadPage() {
  const router = useRouter();
  const [selectedVault, setSelectedVault] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [vaultMemberships, setVaultMemberships] = useState<VaultMembership[]>([]);
  const [user, setUser] = useState<User | null>(null); // Use User type
  const [isUploading, setIsUploading] = useState(false); // Use isUploading for overall state
  const [generalError, setGeneralError] = useState(""); // Use generalError for vault fetching etc.

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
        console.log('Raw vault data:', data);
        // The data comes as array with vault relationships, so we need to properly handle it
        const validMemberships: VaultMembership[] = [];
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.forEach((item: any) => {
          if (item.vaults) {
            validMemberships.push({
              role: item.role,
              vaults: item.vaults
            });
          }
        });
        
        setVaultMemberships(validMemberships);
      } else if (fetchError) { // Handle fetch error separately
        setGeneralError(fetchError.message);
      }
    };

    loadData();
  }, [router]);

  const handleFileSelect = useCallback((files: FileList) => {
    console.log('Files selected:', files.length);
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      console.log('Processing file:', file.name, file.type, file.size);
      // Check file type and size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.type.startsWith('image/') && file.size <= maxSize) {
        const id = Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        newFiles.push({
          id,
          file,
          preview,
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: "",
          status: 'pending' // Initial status
        });
      } else {
        console.warn(`File ${file.name} skipped: Invalid type or size exceeds 10MB.`);
        // Add skipped file to state with status 'skipped'
        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: '', // No preview for skipped files
          title: file.name,
          description: `Skipped: Invalid type (${file.type}) or size (${(file.size / 1024 / 1024).toFixed(2)}MB > 10MB)`,
          status: 'skipped'
        });
      }
    });

    console.log('New files to add:', newFiles.length);
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
      if (file && file.preview) { // Only revoke if preview exists
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

  const handleUpload = async () => {
    console.log('Upload initiated');
    console.log('Selected vault:', selectedVault);
    console.log('Uploaded files:', uploadedFiles.length);
    console.log('User:', user);
    
    if (!selectedVault || uploadedFiles.length === 0 || !user) {
      const errorMsg = "Please select a vault and ensure there are files to upload.";
      console.error('Upload validation failed:', errorMsg);
      setGeneralError(errorMsg);
      return;
    }

    setIsUploading(true);
    setGeneralError(""); // Clear general errors

    const filesToUpload = uploadedFiles.filter(f => f.status === 'pending');
    console.log('Files to upload:', filesToUpload.length);
    let allSuccessful = true;

    for (const fileData of filesToUpload) {
      console.log('Uploading file:', fileData.title);
      // Update status to uploading
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
      );

      try {
        // Upload file to storage
        console.log('Calling uploadFile...');
        const { data: uploadData, error: uploadError } = await uploadFile(
          fileData.file,
          user.id,
          selectedVault
        );

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
        
        console.log('File uploaded successfully, saving to database...');

        // Save photo record to database
        const { error: dbError } = await uploadPhoto(
          selectedVault,
          user.id,
          fileData.title,
          fileData.description,
          uploadData.publicUrl
        );

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Photo saved to database successfully');

        // Update status to success
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, status: 'success' } : f)
        );

      } catch (error: unknown) { // Use unknown for better type safety
        console.error('Upload failed for file:', fileData.title, error);
        allSuccessful = false;
        // Update status to failed
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileData.id ? { ...f, status: 'failed', errorMessage: error instanceof Error ? error.message : "Upload failed" } : f)
        );
      }
    }

    setIsUploading(false);

    if (allSuccessful) {
      // Optionally show a success message before redirecting
      console.log("All files uploaded successfully!");
      router.push(`/vault/${selectedVault}`);
    } else {
      // Keep user on the page to see failed uploads
      setGeneralError("Some files failed to upload. Please review the list above.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
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

        {/* Debug Info */}
        <Card className="p-6 mb-6 bg-yellow-50 dark:bg-yellow-900/10">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Debug Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'Not authenticated'}</p>
            <p><strong>Vault Memberships:</strong> {vaultMemberships.length}</p>
            <p><strong>Selected Vault:</strong> {selectedVault || 'None'}</p>
            <p><strong>Uploaded Files:</strong> {uploadedFiles.length}</p>
            <p><strong>Files ready to upload:</strong> {uploadedFiles.filter(f => f.status === 'pending').length}</p>
          </div>
        </Card>

        {/* Vault Selection */}
        <Card className="p-6 mb-6">
          <Label className="text-lg font-medium mb-4 block">
            Select Vault
          </Label>
          {generalError && ( // Use generalError here
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">
              {generalError}
            </div>
          )}
          
          {/* Owned Vaults */}
          {vaultMemberships.filter(membership => membership.role === 'admin' || membership.role === 'owner').length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Vaults</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vaultMemberships
                  .filter(membership => membership.role === 'admin' || membership.role === 'owner')
                  .map((membership) => (
                    <button
                      key={membership.vaults.id}
                      onClick={() => {
                        setSelectedVault(membership.vaults.id);
                        setGeneralError(""); // Clear general error when vault is selected
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedVault === membership.vaults.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-full h-16 ${membership.vaults.color} rounded-lg mb-3 flex items-center justify-center`}>
                        <FaImage className="w-6 h-6 text-white opacity-50" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {membership.vaults.name}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Joined Vaults */}
          {vaultMemberships.filter(membership => membership.role === 'member').length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Joined Vaults</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vaultMemberships
                  .filter(membership => membership.role === 'member')
                  .map((membership) => (
                    <button
                      key={membership.vaults.id}
                      onClick={() => {
                        setSelectedVault(membership.vaults.id);
                        setGeneralError(""); // Clear general error when vault is selected
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedVault === membership.vaults.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-full h-16 ${membership.vaults.color} rounded-lg mb-3 flex items-center justify-center relative`}>
                        <FaImage className="w-6 h-6 text-white opacity-50" />
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                          <FaUsers className="w-3 h-3 mr-1" />
                          Joined
                        </Badge>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {membership.vaults.name}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {vaultMemberships.length === 0 && !generalError && (
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No vaults found. Please create a vault first.
            </p>
          )}
        </Card>

        {/* File Upload Area */}
        <Card className="p-6 mb-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
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
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
              title="Upload photos"
            />
            <Button 
              variant="outline" 
              className="cursor-pointer"
              onClick={() => {
                console.log('Browse Files button clicked');
                const fileInput = document.getElementById('file-upload');
                console.log('File input element:', fileInput);
                fileInput?.click();
              }}
            >
              Browse Files
            </Button>
          </div>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Photos to Upload
              </h3>
              <Badge variant="secondary">
                {uploadedFiles.length} files
              </Badge>
            </div>

            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className={`flex gap-4 p-4 border rounded-lg items-center ${
                  file.status === 'failed' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' :
                  file.status === 'success' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                  file.status === 'uploading' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                  file.status === 'skipped' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                  '' // Default border
                }`}>
                  {file.preview && ( // Only show preview for valid files
                    <img
                      src={file.preview}
                      alt={file.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  {!file.preview && ( // Placeholder for skipped files
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <FaImage className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {file.title}
                      {file.status === 'uploading' && <span className="ml-2 text-blue-600 text-sm">Uploading...</span>}
                      {file.status === 'success' && <span className="ml-2 text-green-600 text-sm">Success</span>}
                      {file.status === 'failed' && <span className="ml-2 text-red-600 text-sm">Failed</span>}
                      {file.status === 'skipped' && <span className="ml-2 text-yellow-600 text-sm">Skipped</span>}
                    </div>
                    {file.status !== 'skipped' ? (
                      <>
                        <Input
                          value={file.title}
                          onChange={(e) => updateFileInfo(file.id, 'title', e.target.value)}
                          placeholder="Photo title"
                          className="font-medium"
                          disabled={isUploading} // Disable input during upload
                        />
                        <Textarea
                          value={file.description}
                          onChange={(e) => updateFileInfo(file.id, 'description', e.target.value)}
                          placeholder="Add a description (optional)"
                          rows={2}
                          disabled={isUploading} // Disable input during upload
                        />
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">{file.description}</p>
                    )}
                    {file.errorMessage && (
                      <p className="text-sm text-red-600">{file.errorMessage}</p>
                    )}
                  </div>
                  {file.status !== 'uploading' && ( // Don't show remove button during upload
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upload Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedVault || uploadedFiles.filter(f => f.status === 'pending').length === 0 || isUploading} // Disable if no pending files
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