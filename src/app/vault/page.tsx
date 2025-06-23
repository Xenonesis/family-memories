"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaPlus, FaArrowLeft, FaHome, FaFolder, FaUsers, FaSearch, FaClock, FaHeart, FaFilter, FaSort, FaTh, FaList, FaImage } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import Link from "next/link";
import { ProfileNav } from "@/components/ProfileNav";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { VaultStats } from "@/components/vault/VaultStats";
import { motion } from "framer-motion";

interface VaultFromDB {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  created_by: string;
  photos: { count: number }[];
}

interface UserVaultLinkFromDB {
  role: string;
  vaults: VaultFromDB[];
}

interface Vault {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  created_by: string;
  photo_count?: number;
  creator_name?: string;
}

export default function VaultPage() {
  const router = useRouter();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'photos'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'private' | 'shared'>('all');

  const filteredVaults = vaults
    .filter(vault => {
      const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vault.description && vault.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'private' && vault.created_by) || 
        (filterBy === 'shared' && !vault.created_by);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'photos':
          return (photoCounts[b.id] || 0) - (photoCounts[a.id] || 0);
        default:
          return 0;
      }
    });

  const vaultStats = {
    total: vaults.length,
    private: vaults.filter(v => v.created_by).length,
    shared: vaults.filter(v => !v.created_by).length,
    recent: vaults.filter(v => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(v.created_at) > weekAgo;
    }).length,
    totalPhotos: Object.values(photoCounts).reduce((sum, count) => sum + count, 0)
  };

  useEffect(() => {
    const loadVaults = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      try {
        const { data, error } = await getUserVaults(currentUser.id);
        if (!error && data) {
          const vaultData = (data as UserVaultLinkFromDB[]).flatMap(item => 
            item.vaults.map((vault: VaultFromDB) => ({
              ...vault,
              role: item.role,
              photo_count: vault.photos[0]?.count || 0,
            }))
          );

          setVaults(vaultData);

          const photoCounts = vaultData.reduce((acc: Record<string, number>, vault: Vault) => {
            acc[vault.id] = vault.photo_count || 0;
            return acc;
          }, {});
          setPhotoCounts(photoCounts);
        } else if (error) {
          console.error("Error fetching vaults:", error);
        }
      } catch (error) {
        console.error('Error loading vaults:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadVaults();
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
            <FaFolder className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Loading Vaults...
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Preparing your collections
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 p-6 sm:p-8 lg:p-12">
      <ProfileNav />
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
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
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div className="mb-6 sm:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight flex items-center">
              <FaFolder className="mr-4 text-violet-600" />
              Your Family Vaults
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
              Shared collections of your most precious memories.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {vaultStats.total} Total
              </Badge>
              <Badge variant="outline">
                {vaultStats.private} Private
              </Badge>
              <Badge variant="outline">
                {vaultStats.shared} Shared
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <FaImage className="w-3 h-3 mr-1" />
                {vaultStats.totalPhotos} Photos
              </Badge>
              {vaultStats.recent > 0 && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  {vaultStats.recent} New
                </Badge>
              )}
            </div>
          </div>
          <Link href="/create-vault">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button className="flex items-center gap-2 px-6 py-6 h-auto text-base rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hover:shadow-xl">
                <FaPlus className="w-5 h-5" />
                Create New Vault
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Vault Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VaultStats stats={vaultStats} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <div className="flex items-center w-full pl-4 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/70 border-0 focus-within:ring-2 focus-within:ring-violet-500/20">
                    <FaSearch className="text-gray-400 w-4 h-4 mr-2" />
                    <Input
                      type="text"
                      placeholder="Search vaults by name or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white placeholder-gray-500 p-0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'photos') => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <FaSort className="w-3 h-3 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="photos">Photos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterBy} onValueChange={(value: 'all' | 'private' | 'shared') => setFilterBy(value)}>
                    <SelectTrigger className="w-32">
                      <FaFilter className="w-3 h-3 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
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
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <FaList className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="all" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
              <FaFolder className="w-4 h-4 mr-2" />
              All Vaults
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
              <FaClock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
              <FaHeart className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="shared" className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 dark:data-[state=active]:bg-violet-900/30 dark:data-[state=active]:text-violet-300">
              <FaUsers className="w-4 h-4 mr-2" />
              Shared
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <VaultGrid vaults={filteredVaults} viewMode={viewMode} photoCounts={photoCounts} />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <VaultGrid vaults={filteredVaults.slice(0, 6)} viewMode={viewMode} photoCounts={photoCounts} />
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
              <h3 className="text-xl font-bold mb-2">No Favorite Vaults Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Mark your favorite vaults to find them quickly here</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="shared" className="mt-0">
            <VaultGrid vaults={filteredVaults.filter(v => !v.created_by)} viewMode={viewMode} photoCounts={photoCounts} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}