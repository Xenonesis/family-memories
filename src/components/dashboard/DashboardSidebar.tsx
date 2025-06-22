"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaRocket, FaCamera, FaUpload, FaUser, FaImage, FaChartPie, FaLock, FaQuestionCircle } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  vault_id: string;
}

interface DashboardStats {
  storageUsed: number;
}

interface DashboardSidebarProps {
  recentPhotos: Photo[];
  stats: DashboardStats;
}

export function DashboardSidebar({ recentPhotos, stats }: DashboardSidebarProps) {
  const quickActions = [
    { icon: FaCamera, label: 'Create Vault', href: '/create-vault', color: 'from-purple-500 to-pink-500', description: 'Create a new memory vault' },
    { icon: FaUpload, label: 'Upload Photos', href: '/upload', color: 'from-emerald-500 to-teal-500', description: 'Add new memories' },
    { icon: FaUser, label: 'Profile Settings', href: '/profile', color: 'from-blue-500 to-indigo-500', description: 'Manage your account' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      className="xl:col-span-1 space-y-6"
    >
      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FaRocket className="w-5 h-5 text-violet-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div 
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 cursor-pointer transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-sm`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{action.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{action.description}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <IoMdTrendingUp className="w-5 h-5 text-emerald-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentPhotos.slice(0, 3).map((photo) => (
                <motion.div 
                  key={photo.id} 
                  whileHover={{ scale: 1.02, x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    <Image 
                      src={photo.file_url} 
                      alt={photo.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">New photo uploaded</p>
                    <p className="text-xs text-gray-500 truncate">{photo.title}</p>
                    <p className="text-xs text-gray-400">{new Date(photo.created_at).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
              
              {recentPhotos.length === 0 && (
                <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <FaUpload className="w-3 h-3 mr-2" /> Upload Photos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Status */}
      <motion.div variants={item}>
        <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FaUser className="w-5 h-5 text-blue-600" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Link href="/profile">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 3 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">U</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium block">Profile Settings</span>
                      <span className="text-xs text-gray-500">Manage your account</span>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600">→</span>
                </motion.div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaLock className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium">Status</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    Active
                  </span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex flex-col justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FaChartPie className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium">Storage</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${stats.storageUsed}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{stats.storageUsed.toFixed(0)}%</span>
                </motion.div>
              </div>
              
              <Link href="/help">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 cursor-pointer transition-all text-gray-600 dark:text-gray-300 text-sm mt-2 shadow-sm hover:shadow-md"
                >
                  <FaQuestionCircle className="w-3 h-3" />
                  <span>Need help?</span>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}