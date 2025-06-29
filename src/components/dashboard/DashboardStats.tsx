"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  // Format storage used as a percentage with proper display
  const formatStorageUsed = (storageUsed: number) => {
    if (storageUsed >= 1024) {
      return `${(storageUsed / 1024).toFixed(1)}GB`;
    }
    return `${storageUsed.toFixed(0)}MB`;
  };

  const statsData = [
    { 
      label: 'Vaults', 
      value: stats.totalVaults, 
      icon: FaFolder, 
      color: 'from-purple-500 to-pink-500', 
      hoverColor: 'from-purple-600 to-pink-600' 
    },
    { 
      label: 'Photos', 
      value: stats.totalPhotos, 
      icon: FaImage, 
      color: 'from-emerald-500 to-teal-500', 
      hoverColor: 'from-emerald-600 to-teal-600' 
    },
    { 
      label: 'Members', 
      value: stats.totalMembers, 
      icon: FaUsers, 
      color: 'from-blue-500 to-indigo-500', 
      hoverColor: 'from-blue-600 to-indigo-600' 
    },
    { 
      label: 'Storage', 
      value: formatStorageUsed(stats.storageUsed), 
      icon: FaCloud, 
      color: 'from-orange-500 to-red-500', 
      hoverColor: 'from-orange-600 to-red-600' 
    },
    { 
      label: 'Recent', 
      value: stats.recentUploads, 
      icon: IoMdTrendingUp, 
      color: 'from-cyan-500 to-blue-500', 
      hoverColor: 'from-cyan-600 to-blue-600' 
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
    >
      {statsData.map((stat) => (
        <motion.div 
          key={stat.label} 
          variants={item}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="overflow-hidden h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`}></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} hover:${stat.hoverColor} rounded-xl flex items-center justify-center shadow-sm transition-all duration-300`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}