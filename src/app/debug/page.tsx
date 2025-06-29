"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { User } from '@supabase/auth-js/dist/module/lib/types';
import { UserVaultResponse } from '@/lib/types';
import { ProfileNav } from "@/components/ProfileNav";

interface Vault {
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

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testConnection = async () => {
    try {
      addResult("Testing Supabase connection...");
      const { error } = await supabase.from('vaults').select('count');
      if (error) throw error;
      addResult("✅ Supabase connection successful");
    } catch (error: unknown) {
      addResult(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testAuth = async () => {
    try {
      addResult("Testing authentication...");
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        addResult(`✅ User authenticated: ${currentUser.email}`);
      } else {
        addResult("❌ No user authenticated");
      }
    } catch (error: unknown) {
      addResult(`❌ Authentication test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      setVaults(data?.map((item: UserVaultResponse) => ({
        id: item.vaults.id,
        name: item.vaults.name,
        description: item.vaults.description,
        color: item.vaults.color,
        created_at: item.vaults.created_at,
        owner_id: item.vaults.created_by,
      } as Vault)) || []);
      
      addResult(`✅ Vaults fetched: ${data?.length || 0} memberships`);
    } catch (error: unknown) {
      addResult(`❌ Vault fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testStorage = async () => {
    try {
      addResult("Testing storage bucket...");
      const { error } = await supabase.storage.from('photos').list();
      if (error) throw error;
      addResult("✅ Storage bucket accessible");
    } catch (error: unknown) {
      addResult(`❌ Storage test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <ProfileNav />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Panel
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-2">
              <Button onClick={runAllTests} className="w-full">
                Run All Tests
              </Button>
              <Button onClick={testConnection} variant="outline" className="w-full">
                Test Connection
              </Button>
              <Button onClick={testAuth} variant="outline" className="w-full">
                Test Authentication
              </Button>
              <Button onClick={testVaults} variant="outline" className="w-full">
                Test Vaults
              </Button>
              <Button onClick={testStorage} variant="outline" className="w-full">
                Test Storage
              </Button>
            </div>
          </Card>

          {/* Current State */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <div className="space-y-3">
              <div>
                <strong>User:</strong> {user ? user.email : 'Not authenticated'}
              </div>
              <div>
                <strong>Vaults:</strong> {vaults.length}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
              </div>
            </div>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p>No tests run yet...</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}