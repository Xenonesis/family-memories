"use client";

import React, { useState, useEffect } from "react"; // Import React
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaUpload, FaTrash, FaShare, FaCalendar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getVaultPhotos } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface VaultPageProps {
  params: Promise<{ id: string }>;
}

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface Photo {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  uploaded_by: string;
}

export default function VaultDetailPage({ params }: VaultPageProps) {
  const router = useRouter();
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [vault, setVault] = useState<Vault | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Unwrap params using React.use()
  const { id: vaultId } = React.use(params);

  useEffect(() => {
    const loadVaultData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }

      // Get vault details
      const { data: vaultData, error: vaultError } = await supabase
        .from('vaults')
        .select('*')
        .eq('id', vaultId) // Use vaultId
        .single();

      if (vaultError) {
        console.error('Error fetching vault:', vaultError);
        return;
      }

      setVault(vaultData);

      // Get photos
      const { data: photosData, error: photosError } = await getVaultPhotos(vaultId); // Use vaultId
      if (!photosError && photosData) {
        setPhotos(photosData);
      }

      setLoading(false);
    };

    loadVaultData();
  }, [vaultId, router]); // Depend on vaultId

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading vault...</p>
        </div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vault not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The vault you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Link href="/vault">
            <Button>Back to Vaults</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePhotoSelect = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className={`${vault?.color} text-white p-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{vault?.name}</h1>
              <p className="text-blue-100 mb-4">{vault?.description}</p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {photos.length} photos
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/upload">
                <Button variant="secondary">
                  <FaUpload className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </Link>
              <Button variant="secondary">
                <FaShare className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              onClick={() => setViewMode("timeline")}
            >
              <FaCalendar className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </div>

          {selectedPhotos.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPhotos.length} selected
              </span>
              <Button variant="destructive" size="sm">
                <FaTrash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo: unknown) => (
            <Card
              key={photo.id}
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handlePhotoSelect(photo.id)}
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img
                  src={photo.file_url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg5M1Y4MEg4N1Y3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9wYXRoPgo8L3N2Zz4=';
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUpload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No photos yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start building your family memories by uploading your first photos
            </p>
            <Link href="/upload">
              <Button>
                <FaUpload className="w-4 h-4 mr-2" />
                Upload First Photos
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}