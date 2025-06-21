"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaPlus, FaImage, FaBell } from "react-icons/fa";
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
  owner_id: string;
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
  vaults: Vault;
  // Add other fields from the join table if selected, e.g., user_id, vault_id, role
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
        const userVaults = (vaultData as UserVaultLink[]).map((item) => item.vaults);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here&apos;s what&apos;s happening in your family vaults
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <FaBell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Link href="/create-vault">
              <Button>
                <FaPlus className="w-4 h-4 mr-2" />
                New Vault
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Vaults */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  My Vaults
                </h2>
                <Link href="/vault">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vaults.map((vault) => (
                  <Link key={vault.id} href={`/vault/${vault.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className={`w-full h-24 ${vault.color} rounded-lg mb-4 flex items-center justify-center`}>
                        <FaImage className="w-6 h-6 text-white opacity-50" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {vault.name}
                      </h3>
                      
                      {vault.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {vault.description}
                        </p>
                      )}
                    </Card>
                  </Link>
                ))}
                
                {vaults.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No vaults yet</p>
                    <Link href="/create-vault">
                      <Button>
                        <FaPlus className="w-4 h-4 mr-2" />
                        Create Your First Vault
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Photos */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Photos
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentPhotos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src={photo.file_url} 
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg5M1Y4MEg4N1Y3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 mb-1">{photo.vaults?.name}</p>
                      <h4 className="font-medium text-sm mb-2">{photo.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
                
                {recentPhotos.length === 0 && (
                  <div className="col-span-4 text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No photos yet</p>
                    <Link href="/upload">
                      <Button>
                        <FaImage className="w-4 h-4 mr-2" />
                        Upload Your First Photo
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Vaults</span>
                  <span className="font-semibold">{vaults.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Recent Photos</span>
                  <span className="font-semibold">{recentPhotos.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Account</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/create-vault">
                  <Button variant="outline" className="w-full justify-start">
                    <FaPlus className="w-4 h-4 mr-2" />
                    Create New Vault
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <FaImage className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <FaBell className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}