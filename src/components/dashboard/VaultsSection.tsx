"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaFolder, FaEye, FaPlus, FaLock, FaUsers, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
  photo_count: number;
}

interface VaultsSectionProps {
  vaults: Vault[];
}

export function VaultsSection({ vaults }: VaultsSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
        >
          <FaFolder className="mr-2 text-violet-600" /> My Family Vaults
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/vault">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-300">
              <FaEye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
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
                <Card className="group h-full bg-white/90 dark:bg-gray-800/90 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 shadow-md">
                  <div 
                    className={`w-full h-36 ${vault.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40">
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Badge className="bg-black/30 hover:bg-black/40 text-white transition-colors">
                          <FaLock className="w-3 h-3 mr-1" /> Private
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <div className="flex items-center space-x-1 text-white/90">
                          <FaUsers className="w-3 h-3" />
                          <span className="text-xs font-medium">Family</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white/90">
                          <FaImage className="w-3 h-3" />
                          <span className="text-xs font-medium">{vault.photo_count} {vault.photo_count === 1 ? 'photo' : 'photos'}</span>
                        </div>
                      </div>
                    </div>
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaFolder className="w-16 h-16 text-white/90 drop-shadow-lg" />
                    </motion.div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl group-hover:text-violet-600 transition-colors">
                      {vault.name}
                    </CardTitle>
                    {vault.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {vault.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardFooter className="pt-0 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Created {new Date(vault.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <FaEye className="w-3 h-3 mr-1" /> View
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {vaults.length === 0 && (
          <motion.div 
            className="col-span-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-12 text-center bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-0 shadow-lg">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaFolder className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Start Your Memory Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Create your first family vault to begin collecting and sharing precious memories with your loved ones</p>
              <Link href="/create-vault">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 px-6 py-6 h-auto text-base">
                  <FaPlus className="w-5 h-5 mr-2" />
                  Create Your First Vault
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}