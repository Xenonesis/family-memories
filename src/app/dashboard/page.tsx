"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaSearch } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsGrid3X3Gap, BsList } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  file_url: string;
  created_at: string;
  vault_id: string;
  vaults?: { name: string };
}

interface UserVaultLink {
  role: string;
  vaults: Vault[];
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
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent'>('all');
  const [showQuickActions, setShowQuickActions] = useState(false);
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
    { icon: 'FaCamera', label: 'Take Photo', href: '/upload' },
    { icon: 'FaUsers', label: 'Invite Family', href: '/profile' },
    { icon: 'FaRocket', label: 'Upgrade', href: '/upgrade' }
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
        const userVaults = (vaultData as UserVaultLink[]).flatMap(item => item.vaults);
        setVaults(userVaults);
        
        if (userVaults.length > 0) {
          const vaultIds = userVaults.map(v => v.id);
          const { data: photosData } = await supabase
            .from('photos')
            .select('*, vaults(name)')
            .in('vault_id', vaultIds)
            .order('created_at', { ascending: false })
            .limit(12);
          
          if (photosData) {
            setRecentPhotos(photosData);
            calculateStats(photosData, userVaults);
          }
        } else {
          calculateStats([], userVaults);
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
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <HiSparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Loading Dashboard...</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Preparing your memories</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
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
          <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search memories, vaults..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-violet-500 text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'recent'].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter as 'all' | 'recent')}
                    className={selectedFilter === filter ? 'bg-violet-500 text-white' : ''}
                  >
                    {filter === 'all' ? 'All' : 'Recent'}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <BsGrid3X3Gap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <BsList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        <DashboardStatsGrid stats={dashboardStats} />

        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 z-50 w-80"
            >
              <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Quick Actions</h3>
                  <button onClick={() => setShowQuickActions(false)}>×</button>
                </div>
                <div className="space-y-3">
                  {quickActionsData.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="w-5 h-5 text-white">📷</span>
                          </div>
                          <span className="font-medium">{action.label}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <VaultsSection vaults={vaults} />
            <RecentPhotos photos={filteredPhotos} viewMode={viewMode} />
          </div>
          <DashboardSidebar recentPhotos={recentPhotos} stats={dashboardStats} />
        </div>
      </div>
    </div>
  );
}