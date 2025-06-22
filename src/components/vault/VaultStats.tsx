"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FaFolder, FaImage, FaClock, FaHeart, FaShare } from "react-icons/fa";
import { motion } from "framer-motion";

interface VaultStatsProps {
  stats: {
    total: number;
    private: number;
    shared: number;
    recent: number;
    totalPhotos: number;
  };
}

export function VaultStats({ stats }: VaultStatsProps) {
  const statsData = [
    { 
      label: 'Total Vaults', 
      value: stats.total, 
      icon: FaFolder, 
      color: 'from-violet-500 to-purple-500', 
      hoverColor: 'from-violet-600 to-purple-600',
      description: 'Family collections'
    },
    { 
      label: 'Total Photos', 
      value: stats.totalPhotos, 
      icon: FaImage, 
      color: 'from-blue-500 to-indigo-500', 
      hoverColor: 'from-blue-600 to-indigo-600',
      description: 'Precious memories'
    },
    { 
      label: 'Private Vaults', 
      value: stats.private, 
      icon: FaHeart, 
      color: 'from-pink-500 to-rose-500', 
      hoverColor: 'from-pink-600 to-rose-600',
      description: 'Personal collections'
    },
    { 
      label: 'Shared Vaults', 
      value: stats.shared, 
      icon: FaShare, 
      color: 'from-emerald-500 to-teal-500', 
      hoverColor: 'from-emerald-600 to-teal-600',
      description: 'Family accessible'
    }
  ];

  // Add recent vaults if there are any
  if (stats.recent > 0) {
    statsData.push({
      label: 'Recent Vaults', 
      value: stats.recent, 
      icon: FaClock, 
      color: 'from-amber-500 to-orange-500', 
      hoverColor: 'from-amber-600 to-orange-600',
      description: 'This week'
    });
  }

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
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
    >
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} hover:bg-gradient-to-r hover:${stat.hoverColor} rounded-xl flex items-center justify-center transition-all duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <motion.div 
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                
                {/* Progress indicator for visual appeal */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <motion.div 
                      className={`bg-gradient-to-r ${stat.color} h-1 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((stat.value / Math.max(...statsData.map(s => typeof s.value === 'number' ? s.value : 0))) * 100, 100)}%` 
                      }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
