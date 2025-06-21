"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Label is used in the component structure
import { Badge } from "@/components/ui/badge";
import { FaUsers, FaFolder, FaLock, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Vault {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_by: string;
  created_at: string;
}

interface VaultMembership {
  role: string;
  vaults: Vault;
}

interface VaultSelectorProps {
  vaultMemberships: VaultMembership[];
  selectedVault: string;
  onVaultSelect: (vaultId: string) => void;
  error: string;
}

export function VaultSelector({ vaultMemberships, selectedVault, onVaultSelect, error }: VaultSelectorProps) {
  const ownedVaults = vaultMemberships.filter(membership => membership.role === 'admin' || membership.role === 'owner');
  const joinedVaults = vaultMemberships.filter(membership => membership.role === 'member');

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FaFolder className="w-5 h-5 text-violet-600" />
            Select Vault
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4 flex items-center"
              >
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <FaLock className="w-4 h-4 text-red-600 dark:text-red-300" />
                </div>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {ownedVaults.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <FaFolder className="w-4 h-4 mr-2 text-violet-600" /> Your Vaults
              </h3>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                {ownedVaults.map((membership) => (
                  <motion.button
                    key={membership.vaults.id}
                    variants={item}
                    onClick={() => onVaultSelect(membership.vaults.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-0 rounded-xl overflow-hidden transition-all shadow-sm ${selectedVault === membership.vaults.id
                      ? "ring-2 ring-violet-500 shadow-md"
                      : "hover:shadow-md"}`}
                  >
                    <div className={`w-full h-24 ${membership.vaults.color} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 flex items-center justify-center">
                        <FaFolder className="w-12 h-12 text-white/90" />
                      </div>
                      {selectedVault === membership.vaults.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                          <FaCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <p className="font-medium text-gray-900 dark:text-white text-left">
                        {membership.vaults.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
                        {new Date(membership.vaults.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}

          {joinedVaults.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <FaUsers className="w-4 h-4 mr-2 text-emerald-600" /> Joined Vaults
              </h3>
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                {joinedVaults.map((membership) => (
                  <motion.button
                    key={membership.vaults.id}
                    variants={item}
                    onClick={() => onVaultSelect(membership.vaults.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-0 rounded-xl overflow-hidden transition-all shadow-sm ${selectedVault === membership.vaults.id
                      ? "ring-2 ring-emerald-500 shadow-md"
                      : "hover:shadow-md"}`}
                  >
                    <div className={`w-full h-24 ${membership.vaults.color} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 flex items-center justify-center">
                        <FaFolder className="w-12 h-12 text-white/90" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                        <FaUsers className="w-3 h-3 mr-1" />
                        Shared
                      </Badge>
                      {selectedVault === membership.vaults.id && (
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                          <FaCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <p className="font-medium text-gray-900 dark:text-white text-left">
                        {membership.vaults.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left">
                        Shared with you
                      </p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}

          {vaultMemberships.length === 0 && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFolder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Vaults Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please create a vault first to upload your memories.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}