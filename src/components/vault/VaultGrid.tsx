"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaImage, FaFolder, FaLock, FaUsers, FaEye, FaClock, FaHeart, FaStar } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Vault {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface VaultGridProps {
  vaults: Vault[];
  viewMode: 'grid' | 'list';
}

export function VaultGrid({ vaults, viewMode }: VaultGridProps) {
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

  if (viewMode === 'list') {
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence>
          {vaults.map((vault) => (
            <motion.div 
              key={vault.id} 
              variants={item}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01, x: 5 }}
              whileTap={{ scale: 0.99 }}
              layout
            >
              <Link href={`/vault/${vault.id}`}>
                <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 ${vault.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <FaFolder className="w-10 h-10 text-white/90" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                            {vault.name}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                              <FaLock className="w-3 h-3 mr-1" /> Private
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FaHeart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                            </Button>
                          </div>
                        </div>
                        
                        {vault.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {vault.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FaImage className="w-3 h-3" />
                              <span>12 photos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers className="w-3 h-3" />
                              <span>Family</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              <span>{new Date(vault.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <FaEye className="w-3 h-3 mr-2" /> View Vault
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Create New Vault Card - List View */}
        <motion.div 
          variants={item}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.01, x: 5 }}
          whileTap={{ scale: 0.99 }}
        >
          <Link href="/create-vault">
            <Card className="overflow-hidden bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-2 border-dashed border-violet-200 dark:border-violet-800/30 hover:border-violet-400 dark:hover:border-violet-700 transition-colors duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaPlus className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Create New Vault
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start a new family memory collection to preserve and share your precious moments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {vaults.map((vault) => (
          <motion.div 
            key={vault.id} 
            variants={item}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <Link href={`/vault/${vault.id}`}>
              <Card className="h-full overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className={`w-full h-48 ${vault.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Badge className="bg-black/30 hover:bg-black/40 text-white transition-colors">
                        <FaLock className="w-3 h-3 mr-1" /> Private
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-black/20 hover:bg-black/40">
                        <FaHeart className="w-3 h-3 text-white/70 hover:text-red-400 transition-colors" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className="flex items-center space-x-1 text-white/90">
                        <FaUsers className="w-3 h-3" />
                        <span className="text-xs font-medium">Family</span>
                      </div>
                      <div className="flex items-center space-x-1 text-white/90">
                        <FaImage className="w-3 h-3" />
                        <span className="text-xs font-medium">12 photos</span>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaFolder className="w-20 h-20 text-white/90 drop-shadow-lg" />
                  </motion.div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                      <FaEye className="w-3 h-3 mr-2" /> Quick View
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl group-hover:text-violet-600 transition-colors truncate">
                      {vault.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 ml-2">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-500">4.8</span>
                    </div>
                  </div>
                  {vault.description && (
                    <CardDescription className="text-sm line-clamp-2">
                      {vault.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardFooter className="pt-0 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <FaClock className="w-3 h-3 mr-1" />
                    {new Date(vault.created_at).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm">
                    <FaEye className="w-3 h-3 mr-2" /> View
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Create New Vault Card - Grid View */}
      <motion.div 
        variants={item}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href="/create-vault">
          <Card className="h-full overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-2 border-dashed border-violet-200 dark:border-violet-800/30 rounded-xl shadow-sm hover:border-violet-400 dark:hover:border-violet-700 transition-colors duration-300 cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center text-center p-8 h-full">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaPlus className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create New Vault
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base max-w-xs mx-auto">
                Start a new family memory collection to preserve and share your precious moments
              </p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </motion.div>
  );
}