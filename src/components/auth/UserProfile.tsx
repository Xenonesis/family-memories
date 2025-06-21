"use client";

import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { FiArrowRight, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { Profile } from "@/lib/profile";
import { User } from '@supabase/supabase-js';
import { motion } from "framer-motion";

interface UserProfileProps {
  user: User;
  profile: Profile | null;
  onGoToDashboard: () => void;
  onSignOut: () => void;
}

export function UserProfile({ user, profile, onGoToDashboard, onSignOut }: UserProfileProps) {
  return (
    <motion.div 
      className="mb-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile Avatar Section */}
      <div className="relative inline-block mb-6">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl border-4 border-white/50 dark:border-gray-800/50 backdrop-blur-sm">
            {profile?.avatar_url ? (
              <Image 
                src={profile.avatar_url} 
                alt="Profile" 
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-16 h-16 text-white drop-shadow-lg" />
            )}
          </div>
          {/* Online Status Indicator */}
          <motion.div 
            className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
          >
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Welcome Message Card */}
      <motion.div 
        className="relative mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back!
              </h2>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {profile?.full_name || user.email?.split('@')[0] || 'Family Member'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-600 dark:text-gray-400 space-y-1"
            >
              <p>✨ You&apos;re successfully signed in</p>
              <p className="flex items-center justify-center space-x-1">
                <span>📧</span>
                <span className="font-mono text-xs">{user.email}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Action Buttons */}
      <motion.div 
        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button 
          onClick={onGoToDashboard}
          className="group relative h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <span className="relative flex items-center space-x-2">
            <span>Go to Dashboard</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </Button>
        
        <Button 
          onClick={onSignOut}
          variant="outline"
          className="group h-12 px-8 bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 border-gray-200/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <span className="flex items-center space-x-2">
            <FiLogOut className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-200" />
            <span>Sign Out</span>
          </span>
        </Button>
      </motion.div>

      {/* Additional Info */}
      <motion.div 
        className="mt-6 text-xs text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>🔒 Your session is secure</p>
      </motion.div>
    </motion.div>
  );
}