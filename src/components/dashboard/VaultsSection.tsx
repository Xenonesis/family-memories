"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaFolder, FaEye, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface VaultsSectionProps {
  vaults: Vault[];
}

export function VaultsSection({ vaults }: VaultsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Family Vaults</h2>
        <Link href="/vault">
          <Button variant="outline" size="sm">
            <FaEye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => (
          <Link key={vault.id} href={`/vault/${vault.id}`}>
            <Card className="group p-0 bg-white/80 dark:bg-gray-800/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
              <div className={`w-full h-32 ${vault.color} flex items-center justify-center`}>
                <FaFolder className="w-12 h-12 text-white/90" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">
                  {vault.name}
                </h3>
                {vault.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{vault.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(vault.created_at).toLocaleDateString()}
                  </span>
                  <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    Private
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        
        {vaults.length === 0 && (
          <Card className="p-12 text-center col-span-full bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaFolder className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Start Your Memory Journey</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first family vault to begin collecting memories</p>
            <Link href="/create-vault">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                <FaPlus className="w-4 h-4 mr-2" />
                Create Your First Vault
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </motion.div>
  );
}