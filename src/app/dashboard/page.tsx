"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaPlus, FaImage, FaBell, FaUsers, FaCalendarAlt, FaHeart, FaArrowRight, FaFolder, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/auth-js/dist/module/lib/types'; // Import Supabase User type

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string; // Corrected from owner_id to match database query
}

interface Photo {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  vaults?: {
    name: string;
  };
}

interface UserVaultLink { // Define type for the join table result
  role: string; // Add role as it's selected in the query
  vaults: Vault[]; // Change to array as the data seems to be returning an array
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      setUser(currentUser);
      
      // Get user vaults
      const { data: vaultData } = await getUserVaults(currentUser.id);
      if (vaultData) {
        // Cast vaultData to the expected type and map
        // If vaults is an array, use flatMap to get a single array of vaults
        const userVaults = (vaultData as UserVaultLink[]).flatMap((item) => item.vaults);
        setVaults(userVaults);
        
        // Get recent photos from all vaults
        if (userVaults.length > 0) {
          const vaultIds = userVaults.map(v => v.id);
          const { data: photosData } = await supabase
            .from('photos')
            .select(`
              *,
              vaults(name)
            `)
            .in('vault_id', vaultIds)
            .order('created_at', { ascending: false })
            .limit(4);
          
          if (photosData) {
            setRecentPhotos(photosData);
          }
        }
      }
      
      setLoading(false);
    };
    
    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-600 border-r-cyan-500 mx-auto"></div>
            <div className="animate-pulse absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-purple-500 border-l-pink-500"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading your memories...</h3>
            <p className="text-gray-600 dark:text-gray-400">Preparing your family dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Enhanced Header with better spacing and typography */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 lg:mb-12 gap-6 lg:gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FaImage className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl">
              Your family memories are waiting. Create, share, and cherish moments that matter most.
            </p>
          </div>
          
          {/* Action buttons with improved styling */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Button variant="outline" className="flex-1 lg:flex-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
              <FaBell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </Button>
            <Link href="/create-vault" className="flex-1 lg:flex-none">
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <FaPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Vault</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <Card className="p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Vaults</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{vaults.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaFolder className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Photos</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{recentPhotos.length}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <FaImage className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Members</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{vaults.length > 0 ? Math.max(1, vaults.length * 2) : 1}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FaUsers className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Activity</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">{recentPhotos.length > 0 ? 'Active' : 'New'}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FaChartLine className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8 lg:space-y-12">
            {/* Enhanced My Vaults Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    My Family Vaults
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your private collections of precious memories
                  </p>
                </div>
                <Link href="/vault">
                  <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    View All
                    <FaArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {vaults.map((vault) => (
                  <Link key={vault.id} href={`/vault/${vault.id}`}>
                    <Card className="group p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden relative">
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className={`relative w-full h-24 lg:h-32 ${vault.color} rounded-xl mb-4 lg:mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <FaImage className="w-8 h-8 lg:w-10 lg:h-10 text-white opacity-80" />
                      </div>
                      
                      <div className="relative">
                        <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {vault.name}
                        </h3>
                        
                        {vault.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {vault.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created {new Date(vault.created_at).toLocaleDateString()}</span>
                          <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
                
                {vaults.length === 0 && (
                  <div className="col-span-2">
                    <Card className="p-8 lg:p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaFolder className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">Start Your Memory Journey</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Create your first family vault to begin collecting and sharing precious memories with your loved ones.</p>
                      <Link href="/create-vault">
                        <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg">
                          <FaPlus className="w-4 h-4 mr-2" />
                          Create Your First Vault
                        </Button>
                      </Link>
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Recent Photos */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Recent Memories
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your latest uploaded photos and moments
                  </p>
                </div>
                <Link href="/upload">
                  <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    Upload More
                    <FaPlus className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                {recentPhotos.map((photo) => (
                  <Card key={photo.id} className="group overflow-hidden cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
                      <img 
                        src={photo.file_url} 
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg5M1Y4MEg4N1Y3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaHeart className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="p-3 lg:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"></div>
                        <p className="text-xs text-gray-500 truncate">{photo.vaults?.name}</p>
                      </div>
                      <h4 className="font-semibold text-sm lg:text-base mb-2 text-gray-900 dark:text-white truncate">{photo.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {recentPhotos.length === 0 && (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                    <Card className="p-8 lg:p-12 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FaImage className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3">Share Your First Memory</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Upload your first photo to start building your family's digital memory collection.</p>
                      <Link href="/upload">
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                          <FaImage className="w-4 h-4 mr-2" />
                          Upload Your First Photo
                        </Button>
                      </Link>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Quick Actions */}
            <Card className="p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3 lg:space-y-4">
                <Link href="/create-vault">
                  <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <FaPlus className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Create Vault</div>
                      <div className="text-xs text-gray-500">Start a new collection</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/40 dark:hover:to-teal-900/40 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <FaImage className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Upload Photos</div>
                      <div className="text-xs text-gray-500">Add new memories</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                      <FaBell className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Settings</div>
                      <div className="text-xs text-gray-500">Manage preferences</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card className="p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentPhotos.slice(0, 3).map((photo, index) => (
                  <div key={photo.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaImage className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        New photo uploaded
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {photo.title} • {photo.vaults?.name}
                      </p>
                    </div>
                  </div>
                ))}
                
                {recentPhotos.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">Start uploading to see activity</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Account Status */}
            <Card className="p-6 lg:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Account Status</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Storage Used</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {Math.min(recentPhotos.length * 2.5, 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}