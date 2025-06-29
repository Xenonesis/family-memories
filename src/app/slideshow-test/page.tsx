"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { SlideshowTester } from "@/components/slideshow/SlideshowTester";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaImage, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { UserVaultResponse, PhotoCount } from '@/lib/types';

interface Photo {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  uploaded_by: string;
}

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
  photos: PhotoCount[];
}

export default function SlideshowTestPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [selectedVaultId, setSelectedVaultId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (selectedVaultId) {
      loadVaultPhotos(selectedVaultId);
    }
  }, [selectedVaultId]);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setError("Please sign in to test slideshow functionality");
        setLoading(false);
        return;
      }

      const { data: vaultData, error: vaultError } = await getUserVaults(currentUser.id);
      if (vaultError) {
        setError("Failed to load vaults: " + vaultError.message);
        setLoading(false);
        return;
      }

      if (vaultData && vaultData.length > 0) {
        const userVaults = (vaultData as UserVaultResponse[]).map(item => item.vaults);
        setVaults(userVaults);
        
        // Auto-select first vault with photos
        for (const vault of userVaults) {
          if (vault.photos[0]?.count && vault.photos[0].count > 0) {
            setSelectedVaultId(vault.id);
            break;
          }
        }
      }
    } catch (err) {
      setError("An error occurred while loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVaultPhotos = async (vaultId: string) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('vault_id', vaultId)
        .order('created_at', { ascending: false });

      if (error) {
        setError("Failed to load photos: " + error.message);
        return;
      }

      setPhotos(data || []);
    } catch (err) {
      setError("An error occurred while loading photos");
      console.error(err);
    }
  };

  // Sample photos for testing if no real photos available
  const samplePhotos: Photo[] = [
    {
      id: "sample-1",
      title: "Beautiful Sunset",
      description: "A stunning sunset over the mountains",
      file_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      created_at: new Date().toISOString(),
      vault_id: "sample",
      uploaded_by: "sample"
    },
    {
      id: "sample-2",
      title: "Ocean Waves",
      description: "Peaceful ocean waves at the beach",
      file_url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop",
      created_at: new Date().toISOString(),
      vault_id: "sample",
      uploaded_by: "sample"
    },
    {
      id: "sample-3",
      title: "Mountain Lake",
      description: "Crystal clear mountain lake reflection",
      file_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      created_at: new Date().toISOString(),
      vault_id: "sample",
      uploaded_by: "sample"
    },
    {
      id: "sample-4",
      title: "Forest Path",
      description: "A winding path through the forest",
      file_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      created_at: new Date().toISOString(),
      vault_id: "sample",
      uploaded_by: "sample"
    }
  ];

  const testPhotos = photos.length > 0 ? photos : samplePhotos;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading slideshow test environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Slideshow Testing Suite
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive testing for slideshow functionality and performance
            </p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Vault Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaImage className="w-5 h-5" />
              Select Test Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Choose Vault for Testing:
                </label>
                <Select value={selectedVaultId} onValueChange={setSelectedVaultId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vault to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaults.map((vault) => (
                      <SelectItem key={vault.id} value={vault.id}>
                        {vault.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="sample">
                      Use Sample Photos (Demo)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {testPhotos.length} photos available for testing
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slideshow Tester */}
        <SlideshowTester photos={testPhotos} />
      </div>
    </div>
  );
}