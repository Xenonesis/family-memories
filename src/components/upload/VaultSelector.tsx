"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FaImage, FaUsers } from "react-icons/fa";

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

  return (
    <Card className="p-6 mb-6">
      <Label className="text-lg font-medium mb-4 block">Select Vault</Label>
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {ownedVaults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Your Vaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ownedVaults.map((membership) => (
              <button
                key={membership.vaults.id}
                onClick={() => onVaultSelect(membership.vaults.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVault === membership.vaults.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className={`w-full h-16 ${membership.vaults.color} rounded-lg mb-3 flex items-center justify-center`}>
                  <FaImage className="w-6 h-6 text-white opacity-50" />
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {membership.vaults.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {joinedVaults.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Joined Vaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {joinedVaults.map((membership) => (
              <button
                key={membership.vaults.id}
                onClick={() => onVaultSelect(membership.vaults.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVault === membership.vaults.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <div className={`w-full h-16 ${membership.vaults.color} rounded-lg mb-3 flex items-center justify-center relative`}>
                  <FaImage className="w-6 h-6 text-white opacity-50" />
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                    <FaUsers className="w-3 h-3 mr-1" />
                    Joined
                  </Badge>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {membership.vaults.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {vaultMemberships.length === 0 && !error && (
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          No vaults found. Please create a vault first.
        </p>
      )}
    </Card>
  );
}