"use client";

import { Card } from "@/components/ui/card";
import { FaFolder, FaImage, FaUsers, FaCloud } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { motion } from "framer-motion";

interface DashboardStats {
  totalPhotos: number;
  totalVaults: number;
  totalMembers: number;
  storageUsed: number;
  recentUploads: number;
}

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsProps) {
  const statsData = [
    { label: 'Vaults', value: stats.totalVaults, icon: FaFolder, color: 'from-purple-500 to-pink-500' },
    { label: 'Photos', value: stats.totalPhotos, icon: FaImage, color: 'from-emerald-500 to-teal-500' },
    { label: 'Members', value: stats.totalMembers, icon: FaUsers, color: 'from-blue-500 to-indigo-500' },
    { label: 'Storage', value: `${stats.storageUsed.toFixed(0)}%`, icon: FaCloud, color: 'from-orange-500 to-red-500' },
    { label: 'Recent', value: stats.recentUploads, icon: IoMdTrendingUp, color: 'from-cyan-500 to-blue-500' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
    >
      {statsData.map((stat) => (
        <Card key={stat.label} className="p-4 bg-white/80 dark:bg-gray-800/80 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}