"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPlus, FaUsers, FaImage, FaCog } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import Link from "next/link";

export default function VaultPage() {
  const router = useRouter();
  const [vaults, setVaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadVaults = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      setUser(currentUser);
      const { data, error } = await getUserVaults(currentUser.id);
      if (!error && data) {
        setVaults(data.map((item: any) => item.vaults));
      }
      setLoading(false);
    };
    
    loadVaults();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your vaults...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Family Vaults
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your shared memory collections
            </p>
          </div>
          <Link href="/create-vault">
            <Button className="flex items-center gap-2">
              <FaPlus className="w-4 h-4" />
              Create New Vault
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <Card key={vault.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-full h-32 ${vault.color} rounded-lg mb-4 flex items-center justify-center`}>
                <FaImage className="w-8 h-8 text-white opacity-50" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {vault.name}
              </h3>
              
              {vault.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {vault.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <Link href={`/vault/${vault.id}`}>
                  <Button variant="outline" size="sm">
                    View Vault
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <FaCog className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          
          {/* Create New Vault Card */}
          <Link href="/create-vault">
            <Card className="p-6 border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors cursor-pointer">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <FaPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create New Vault
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Start a new family memory collection
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}