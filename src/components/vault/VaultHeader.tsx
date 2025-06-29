"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FaUpload, FaShare, FaEdit, FaCog, FaUsers, FaCalendar, FaHeart, FaDownload, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface VaultHeaderProps {
  vault: Vault;
  photoCount: number;
}

interface VaultStats {
  totalPhotos: number;
  storageUsed: string;
  memberCount: number;
  recentUploads: number;
}

export function VaultHeader({ vault, photoCount }: VaultHeaderProps) {
  const router = useRouter();
  const [stats, setStats] = useState<VaultStats>({
    totalPhotos: 0,
    storageUsed: "0 MB",
    memberCount: 0,
    recentUploads: 0
  });

  useEffect(() => {
    const fetchVaultStats = async () => {
      try {
        // Get member count
        const { count: memberCount } = await supabase
          .from('vault_members')
          .select('*', { count: 'exact', head: true })
          .eq('vault_id', vault.id);

        // Get recent uploads (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const { count: recentCount } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .eq('vault_id', vault.id)
          .gte('created_at', weekAgo.toISOString());

        // Calculate storage used (estimate based on photo count)
        const estimatedStorageMB = photoCount * 2.5; // Assume 2.5MB per photo average
        const storageUsed = estimatedStorageMB > 1024 
          ? `${(estimatedStorageMB / 1024).toFixed(1)} GB`
          : `${estimatedStorageMB.toFixed(0)} MB`;

        setStats({
          totalPhotos: photoCount,
          storageUsed,
          memberCount: memberCount || 1,
          recentUploads: recentCount || 0
        });
      } catch (error) {
        console.error('Error fetching vault stats:', error);
        // Set fallback values
        setStats({
          totalPhotos: photoCount,
          storageUsed: `${(photoCount * 2.5).toFixed(0)} MB`,
          memberCount: 1,
          recentUploads: 0
        });
      }
    };

    if (vault.id) {
      fetchVaultStats();
    }
  }, [vault.id, photoCount]);
  
  return (
    <div className={`${vault.color} text-white relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
      </div>
      
      <div className="max-w-7xl mx-auto p-8 relative">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Link href="/vault">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              All Vaults
            </Button>
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              {vault.name}
            </h1>
            {vault.description && (
              <p className="text-white/90 text-lg mb-6 max-w-2xl leading-relaxed">
                {vault.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors px-4 py-2 text-sm">
                <FaUsers className="w-4 h-4 mr-2" />
                {stats.totalPhotos} Photos
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors px-4 py-2 text-sm">
                <FaCalendar className="w-4 h-4 mr-2" />
                Created {new Date(vault.created_at).toLocaleDateString()}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors px-4 py-2 text-sm">
                <FaHeart className="w-4 h-4 mr-2" />
                Private
              </Badge>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/upload">
              <Button 
                variant="secondary" 
                className="bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-300 px-6 py-3 h-auto"
              >
                <FaUpload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-6 py-3 h-auto"
            >
              <FaShare className="w-4 h-4 mr-2" />
              Share Vault
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 h-12 w-12 p-0"
              >
                <FaDownload className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 h-12 w-12 p-0"
              >
                <FaEdit className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 h-12 w-12 p-0"
              >
                <FaCog className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Stats - Now showing real data */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="text-2xl font-bold">{stats.totalPhotos}</div>
            <div className="text-sm text-white/80">Total Photos</div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="text-2xl font-bold">{stats.storageUsed}</div>
            <div className="text-sm text-white/80">Storage Used</div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="text-2xl font-bold">{stats.memberCount}</div>
            <div className="text-sm text-white/80">Contributors</div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <div className="text-sm text-white/80">This Week</div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}