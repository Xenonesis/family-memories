"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaUser, FaBell, FaPlus, FaUpload, FaFolder } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { User } from '@supabase/auth-js/dist/module/lib/types';

interface DashboardHeaderProps {
  user: User | null;
  recentUploads: number;
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
}

export function DashboardHeader({ user, recentUploads, showQuickActions, setShowQuickActions }: DashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
            <FaUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80">
              <FaUser className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="bg-white/80 dark:bg-gray-800/80"
          >
            <FaBell className="w-4 h-4 mr-2" />
            {recentUploads > 0 && (
              <Badge className="ml-1 bg-red-500 text-white text-xs px-1">
                {recentUploads}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Link href="/create-vault">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <FaPlus className="w-4 h-4 mr-2" />
            New Vault
          </Button>
        </Link>
        
        <Link href="/upload">
          <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80">
            <FaUpload className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </Link>
        
        <Link href="/vault">
          <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80">
            <FaFolder className="w-4 h-4 mr-2" />
            All Vaults
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}