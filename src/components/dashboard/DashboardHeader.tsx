"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FaUser, FaBell, FaPlus, FaUpload, FaFolder, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { User } from '@supabase/auth-js/dist/module/lib/types';
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  user: User | null;
  recentUploads: number;
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
}

export function DashboardHeader({ user, recentUploads, showQuickActions, setShowQuickActions }: DashboardHeaderProps) {
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();
  
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
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex items-center gap-4"
        >
          <motion.div variants={item}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar className="w-14 h-14 border-2 border-white shadow-lg cursor-pointer bg-gradient-to-r from-violet-600 to-purple-600">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-medium">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{user?.user_metadata?.full_name || 'User'}</h4>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                    <div className="flex items-center pt-2">
                      <Link href="/profile">
                        <Button variant="outline" size="sm" className="text-xs h-8 mr-2">
                          <FaCog className="mr-1 h-3 w-3" /> Settings
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button variant="ghost" size="sm" className="text-xs h-8">
                          <FaSignOutAlt className="mr-1 h-3 w-3" /> Logout
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </motion.div>
          
          <motion.div variants={item}>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 self-end sm:self-auto"
        >
          <motion.div variants={item}>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
                <FaUser className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={item}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 relative"
            >
              <FaBell className="w-4 h-4 mr-2" />
              Notifications
              {recentUploads > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {recentUploads}
                </Badge>
              )}
            </Button>
          </motion.div>

          <motion.div variants={item}>
            <ThemeToggle />
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex flex-wrap gap-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Link href="/create-vault">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
              <FaPlus className="w-4 h-4 mr-2" />
              New Vault
            </Button>
          </Link>
        </motion.div>
        
        <motion.div variants={item}>
          <Link href="/upload">
            <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <FaUpload className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </Link>
        </motion.div>
        
        <motion.div variants={item}>
          <Link href="/vault">
            <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <FaFolder className="w-4 h-4 mr-2" />
              All Vaults
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}