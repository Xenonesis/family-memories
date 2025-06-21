"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaTrash, FaCalendar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getVaultPhotos } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ProfileNav } from "@/components/ProfileNav";
import { VaultHeader } from "@/components/vault/VaultHeader";
import { PhotoGrid } from "@/components/vault/PhotoGrid";

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
      <ProfileNav />
      <VaultHeader vault={vault} photoCount={photos.length} />

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

        <PhotoGrid 
          photos={photos}
          selectedPhotos={selectedPhotos}
          onPhotoSelect={handlePhotoSelect}
        />
      </div>
    </div>
  );
}