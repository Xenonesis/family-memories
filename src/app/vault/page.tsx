"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaPlus, FaImage } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import Link from "next/link";

interface Vault {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
  created_by: string;
}

export default function VaultPage() {
  const router = useRouter();
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVaults = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      
      const { data, error } = await getUserVaults(currentUser.id);
      if (!error && data) {
        setVaults(data.flatMap((item: { vaults: Vault[] }) => item.vaults));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            Back
          </Button>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="mb-6 sm:mb-0">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Your Family Vaults
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
              Shared collections of your most precious memories.
            </p>
          </div>
          <Link href="/create-vault">
            <Button className="flex items-center gap-2 px-6 py-3 text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700">
              <FaPlus className="w-5 h-5" />
              Create New Vault
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <Link key={vault.id} href={`/vault/${vault.id}`}>
            <Card className="p-6 flex flex-col justify-between h-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div>
                <div className={`w-full h-40 ${vault.color} rounded-lg mb-4 flex items-center justify-center text-white text-opacity-70`}>
                  <FaImage className="w-12 h-12" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                  {vault.name}
                </h3>
                
                {vault.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-base line-clamp-2">
                    {vault.description}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-auto">
                  <Button variant="outline" size="sm" className="w-full">
                    View Vault
                  </Button>
              </div>
            </Card>
            </Link>
          ))}
          
          {/* Create New Vault Card */}
          <Link href="/create-vault">
            <Card className="p-6 h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl shadow-sm hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 cursor-pointer">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <FaPlus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Create New Vault
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                Start a new family memory collection
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}