"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FaTrash, FaCalendar, FaTh, FaList, FaSearch, FaFilter, FaSort, FaDownload, FaShare, FaImage, FaPlay, FaExpand } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getVaultPhotos } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ProfileNav } from "@/components/ProfileNav";
import { VaultHeader } from "@/components/vault/VaultHeader";
import { PhotoGrid } from "@/components/vault/PhotoGrid";
import { motion } from "framer-motion";

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
  const [viewMode, setViewMode] = useState<"grid" | "timeline" | "masonry">("grid");
  const [vault, setVault] = useState<Vault | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'favorites'>('all');
  const [activeTab, setActiveTab] = useState('photos');
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  const filteredPhotos = photos
    .filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'recent' && new Date(photo.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filterBy === 'favorites' && false); // Would need favorites data
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'size':
          return 0; // Would need file size data
        default:
          return 0;
      }
    });

  const photoStats = {
    total: photos.length,
    recent: photos.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    selected: selectedPhotos.length
  };

  // Add empty state for filtered results
  if (filteredPhotos.length === 0 && searchQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <ProfileNav />
        <VaultHeader vault={vault} photoCount={photos.length} />
        <div className="max-w-6xl mx-auto p-6">
          <Card className="p-12 text-center bg-white/80 dark:bg-gray-800/80 border-0 shadow-md">
            <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Photos Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn&apos;t find any photos matching &quot;{searchQuery}&quot;</p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <ProfileNav />
      <VaultHeader vault={vault} photoCount={photos.length} />

      {/* Enhanced Controls */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <TabsList className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="photos" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                <FaImage className="w-4 h-4 mr-2" />
                Photos ({photoStats.total})
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                <FaCalendar className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="slideshow" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                <FaPlay className="w-4 h-4 mr-2" />
                Slideshow
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {selectedPhotos.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 px-4 py-2 rounded-lg"
                >
                  <Badge variant="secondary">
                    {selectedPhotos.length} selected
                  </Badge>
                  <Button variant="outline" size="sm">
                    <FaDownload className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <FaShare className="w-3 h-3 mr-2" />
                    Share
                  </Button>
                  <Button variant="destructive" size="sm">
                    <FaTrash className="w-3 h-3 mr-2" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPhotos([])}>
                    Cancel
                  </Button>
                </motion.div>
              ) : (
                <>
                  <Button
                    variant={isSelectionMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsSelectionMode(!isSelectionMode)}
                  >
                    Select
                  </Button>
                  <Button variant="outline" size="sm">
                    <FaExpand className="w-3 h-3 mr-2" />
                    Fullscreen
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/70 border-0 focus-within:ring-2 focus-within:ring-violet-500/20">
                    <FaSearch className="text-gray-400 w-4 h-4 mr-2" />
                    <Input
                      type="text"
                      placeholder="Search photos by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white placeholder-gray-500 p-0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'size') => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <FaSort className="w-3 h-3 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterBy} onValueChange={(value: 'all' | 'recent' | 'favorites') => setFilterBy(value)}>
                    <SelectTrigger className="w-32">
                      <FaFilter className="w-3 h-3 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <FaTh className="w-3 h-3" />
                    </Button>
                    <Button
                      variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('masonry')}
                      className="h-8 w-8 p-0"
                    >
                      <FaList className="w-3 h-3" />
                    </Button>
                    <Button
                      variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('timeline')}
                      className="h-8 w-8 p-0"
                    >
                      <FaCalendar className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <TabsContent value="photos" className="mt-0">
            <PhotoGrid 
              photos={filteredPhotos}
              selectedPhotos={selectedPhotos}
              onPhotoSelect={handlePhotoSelect}
              viewMode={viewMode}
              isSelectionMode={isSelectionMode}
            />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-0">
            <div className="space-y-8">
              {/* Timeline view would be implemented here */}
              <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-0 shadow-md">
                <FaCalendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Timeline View</h3>
                <p className="text-gray-600 dark:text-gray-400">View your photos organized by date and time</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="slideshow" className="mt-0">
            <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-0 shadow-md">
              <FaPlay className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Slideshow Mode</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Enjoy your memories in a beautiful slideshow</p>
              <Button className="bg-green-600 hover:bg-green-700">
                <FaPlay className="w-4 h-4 mr-2" />
                Start Slideshow
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}