"use client";

import { Card } from "@/components/ui/card";
import { FaRocket, FaCamera, FaUpload, FaUser, FaImage } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import Link from "next/link";

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
    { icon: FaCamera, label: 'Create Vault', href: '/create-vault', color: 'from-purple-500 to-pink-500' },
    { icon: FaUpload, label: 'Upload Photos', href: '/upload', color: 'from-emerald-500 to-teal-500' },
    { icon: FaUser, label: 'Profile Settings', href: '/profile', color: 'from-blue-500 to-indigo-500' }
  ];

  return (
    <div className="xl:col-span-1 space-y-6">
      {/* Quick Actions */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaRocket className="w-5 h-5 text-violet-600" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-white/70 dark:bg-gray-800/70">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <IoMdTrendingUp className="w-5 h-5 text-emerald-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentPhotos.slice(0, 3).map((photo) => (
            <div key={photo.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FaImage className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">New photo uploaded</p>
                <p className="text-xs text-gray-500 truncate">{photo.title}</p>
              </div>
            </div>
          ))}
          
          {recentPhotos.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </Card>

      {/* Account Status */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaUser className="w-5 h-5 text-blue-600" />
          Account
        </h3>
        <div className="space-y-3">
          <Link href="/profile">
            <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 cursor-pointer transition-all">
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Profile Settings</span>
              </div>
              <span className="text-xs text-blue-600">→</span>
            </div>
          </Link>
          <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
            <span className="text-sm font-medium">Status</span>
            <span className="text-sm font-semibold text-green-600">Active</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <span className="text-sm font-medium">Storage</span>
            <span className="text-sm font-semibold text-blue-600">{stats.storageUsed.toFixed(0)}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}