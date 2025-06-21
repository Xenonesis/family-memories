"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/auth-js/dist/module/lib/types'; // Import Supabase User type

// Define raw types based on the error message structure from getUserVaults
interface VaultRaw {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string; // This seems to correspond to owner_id
}

interface UserVaultLinkRaw {
  role: string | null; // Role in the vault, based on error
  vaults: VaultRaw[];
}

interface Vault { // Define Vault type for state
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  owner_id: string;
}

export default function DebugPage() {
  const [user, setUser] = useState<User | null>(null);
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      addResult("Testing Supabase connection...");
      const { error } = await supabase.from('vaults').select('count'); // Removed unused 'data'
      if (error) throw error;
      addResult("✅ Supabase connection successful");
    } catch (error: unknown) {
if (error instanceof Error) {
          addResult(`�� Supabase connection failed: ${error.message}`);
        } else {
          addResult(`�� Supabase connection failed: Unknown error`);
        }
      addResult(`❌ Supabase connection failed: ${error}`);
    }
  };

  const testAuth = async () => {
    try {
      addResult("Testing authentication...");
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
if (error instanceof Error) {
          addResult(`�� Authentication test failed: ${error.message}`);
        } else {
          addResult(`�� Authentication test failed: Unknown error`);
        }
        addResult(`✅ User authenticated: ${currentUser.email}`);
      } else {
        addResult("❌ No user authenticated");
      }
    } catch (error: unknown) {
      addResult(`❌ Authentication test failed: ${error}`);
    }
  };

  const testVaults = async () => {
    try {
      addResult("Testing vault fetch...");
      if (!user) {
        addResult("❌ No user for vault test");
        return;
      }
      const { data, error } = await getUserVaults(user.id);
      if (error) throw error;
      // Map the raw data structure to the expected Vault[] state
      setVaults(data?.flatMap((item: UserVaultLinkRaw) => item.vaults.map(vaultRaw => ({
        id: vaultRaw.id,
        name: vaultRaw.name,
        description: vaultRaw.description,
        color: vaultRaw.color,
        created_at: vaultRaw.created_at,
        owner_id: vaultRaw.created_by, // Map created_by from raw data to owner_id
      } as Vault))) || []);
      addResult(`✅ Vaults fetched: ${data?.length || 0} memberships`);
    } catch (error: unknown) {
      addResult(`❌ Vault fetch failed: ${error}`);
    }
  };

  const testStorage = async () => {
    try {
      addResult("Testing storage bucket...");
      const { error } = await supabase.storage.from('photos').list(); // Removed unused 'data'
      if (error) throw error;
      addResult("✅ Storage bucket accessible");
    } catch (error: unknown) {
      addResult(`❌ Storage test failed: ${error}`);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testConnection();
    await testAuth();
    await testVaults();
    await testStorage();
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Upload Debug Page
        </h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <Button onClick={runAllTests} className="mb-4">
            Run All Tests
          </Button>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded">
                {result}
              </div>
            ))}
          </div>
        </Card>

        {user && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </Card>
        )}

        {vaults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vaults</h2>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(vaults, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
