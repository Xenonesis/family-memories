"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FaSearch, FaCamera, FaUsers, FaRocket, FaTimes, FaFilter, FaHeart, FaFolder } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsGrid3X3Gap, BsList } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/auth-js/dist/module/lib/types';
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsGrid } from "@/components/dashboard/DashboardStats";
import { VaultsSection } from "@/components/dashboard/VaultsSection";
import { RecentPhotos } from "@/components/dashboard/RecentPhotos";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardBackground } from "@/components/ui/dashboard-background";

// Vault data structure as it is returned by getUserVaults
interface VaultFromDB {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
}

// The Vault type used in the component state, which includes the photo count
interface Vault extends VaultFromDB {
  photo_count: number;
}

interface Photo {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  vaults?: { name: string };
}

// Type for the data structure returned by getUserVaults
interface UserVaultLinkFromDB {
  role: string;
  vaults: VaultFromDB[];
}

interface DashboardStats {
  totalPhotos: number;
  totalVaults: number;
  totalMembers: number;
  storageUsed: number;
  recentUploads: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter] = useState<'all' | 'recent'>('all');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const setActiveTab = useState('all')[1];
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPhotos: 0,
    totalVaults: 0,
    totalMembers: 0,
    storageUsed: 0,
    recentUploads: 0
  });

  const filteredPhotos = useMemo(() => {
    let filtered = recentPhotos;
    
    if (searchQuery) {
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.vaults?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedFilter === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    return filtered;
  }, [recentPhotos, searchQuery, selectedFilter]);

  const calculateStats = (photosData: Photo[], vaultsData: Vault[]) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    setDashboardStats({
      totalPhotos: photosData.length,
      totalVaults: vaultsData.length,
      totalMembers: Math.max(1, vaultsData.length * 2),
      storageUsed: Math.min(photosData.length * 2.5, 100),
      recentUploads: photosData.filter(p => new Date(p.created_at) > weekAgo).length
    });
  };

  const quickActionsData = [
    { icon: FaCamera, label: 'Take Photo', href: '/upload' },
    { icon: FaUsers, label: 'Invite Family', href: '/profile' },
    { icon: FaRocket, label: 'Upgrade', href: '/upgrade' }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      setUser(currentUser);
      
      const { data: vaultData } = await getUserVaults(currentUser.id);
      if (vaultData) {
        const userVaults = (vaultData as UserVaultLinkFromDB[]).flatMap(item => item.vaults);

        if (userVaults.length > 0) {
          const vaultIds = userVaults.map(v => v.id);

          // Fetch photo counts for each vault
          const photoCountsPromises = userVaults.map(async (vault) => {
            const { count } = await supabase
              .from('photos')
              .select('*', { count: 'exact', head: true })
              .eq('vault_id', vault.id);
            return { ...vault, photo_count: count || 0 };
          });

          const vaultsWithCounts = await Promise.all(photoCountsPromises);
          setVaults(vaultsWithCounts);

          // Fetch recent photos for the dashboard
          const { data: photosData } = await supabase
            .from('photos')
            .select('*, vaults(name)')
            .in('vault_id', vaultIds)
            .order('created_at', { ascending: false })
            .limit(12);

          if (photosData) {
            setRecentPhotos(photosData);
            calculateStats(photosData, vaultsWithCounts);
          } else {
            calculateStats([], vaultsWithCounts);
          }
        } else {
          setVaults([]);
          setRecentPhotos([]);
          calculateStats([], []);
        }
      }
      
      setLoading(false);
    };
    
    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              boxShadow: ["0 0 15px rgba(124, 58, 237, 0.5)", "0 0 30px rgba(124, 58, 237, 0.5)", "0 0 15px rgba(124, 58, 237, 0.5)"]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
            }}
            className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <HiSparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Loading Dashboard...
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Preparing your memories
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-violet-500 to-purple-500 mt-6 max-w-xs mx-auto rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <DashboardBackground
        className="z-0"
        color="rgba(220, 210, 255, 0.4)"
        darkModeColor="rgba(30, 30, 30, 0.4)"
        animation={{ scale: 50, speed: 70 }}
        noise={{ opacity: 0.5, scale: 1 }}
      />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
          <DashboardHeader 
            user={user}
            recentUploads={dashboardStats.recentUploads}
            showQuickActions={showQuickActions}
            setShowQuickActions={setShowQuickActions}
          />

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1" onClick={() => setIsSearchOpen(true)}>
                    <div className="flex items-center w-full pl-4 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/70 border-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <FaSearch className="text-gray-400 w-4 h-4 mr-2" />
                      <span className="text-gray-500 text-sm">Search memories, vaults...</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-300"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <FaFilter className="w-3 h-3" />
                      <span>Filter</span>
                    </Button>
                  </div>
                  
                  <div className="flex gap-1 bg-gray-100 dark:bg-gray-700/70 rounded-lg p-1 shadow-inner">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      title="Grid View"
                    >
                      <BsGrid3X3Gap className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      title="List View"
                    >
                      <BsList className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <DashboardStatsGrid stats={dashboardStats} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
                    <TabsTrigger value="all" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                      All Memories
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
                      Favorites
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <VaultsSection vaults={vaults} />
                  <RecentPhotos photos={filteredPhotos} viewMode={viewMode} />
                </TabsContent>
                
                <TabsContent value="recent" className="mt-0">
                  <RecentPhotos photos={filteredPhotos.slice(0, 8)} viewMode={viewMode} />
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-0">
                  <Card className="p-12 text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-0 shadow-md">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaHeart className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Mark your favorite memories to find them quickly here</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <DashboardSidebar recentPhotos={recentPhotos.slice(0, 3)} stats={dashboardStats} />
          </div>

          {/* Search Dialog */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle>Search Memories</DialogTitle>
                <DialogDescription>
                  Find photos, vaults and memories across your collection
                </DialogDescription>
              </DialogHeader>
              <Command className="rounded-lg border-0">
                <CommandInput placeholder="Type to search..." className="h-12" />
                <CommandList className="max-h-[400px] overflow-auto">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Photos">
                    {recentPhotos.slice(0, 5).map((photo) => (
                      <CommandItem 
                        key={photo.id}
                        className="flex items-center gap-2 py-3"
                        onSelect={() => {
                          setSearchQuery(photo.title);
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                          <Image src={photo.file_url} alt={photo.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{photo.title}</p>
                          <p className="text-sm text-gray-500 truncate">{photo.vaults?.name}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading="Vaults">
                    {vaults.slice(0, 3).map((vault) => (
                      <CommandItem 
                        key={vault.id}
                        className="flex items-center gap-2 py-3"
                        onSelect={() => {
                          router.push(`/vault/${vault.id}`);
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className={`w-10 h-10 ${vault.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                          <FaFolder className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{vault.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {new Date(vault.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">ESC</kbd> to close
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsSearchOpen(false)}>
                  <FaTimes className="w-3 h-3 mr-2" /> Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-4 z-50 w-80"
              >
                <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Quick Actions</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setShowQuickActions(false)}
                    >
                      <FaTimes className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {quickActionsData.map((action, index) => (
                      <motion.div 
                        key={action.label}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={action.href}>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 cursor-pointer transition-all hover:shadow-md">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                              <action.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{action.label}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-sm text-gray-500 mb-3">Recent Activity</p>
                      {recentPhotos.slice(0, 2).map((photo) => (
                        <div key={photo.id} className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden relative">
                            <Image src={photo.file_url} alt={photo.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{photo.title}</p>
                            <p className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}