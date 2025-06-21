"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getUserVaults } from "@/lib/database";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const [vaults, setVaults] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    try {
      addResult("Testing Supabase connection...");
      const { data, error } = await supabase.from('vaults').select('count');
      if (error) throw error;
      addResult("✅ Supabase connection successful");
    } catch (error) {
      addResult(`❌ Supabase connection failed: ${error}`);
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
    } catch (error) {
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
      setVaults(data || []);
      addResult(`✅ Vaults fetched: ${data?.length || 0} memberships`);
    } catch (error) {
      addResult(`❌ Vault fetch failed: ${error}`);
    }
  };

  const testStorage = async () => {
    try {
      addResult("Testing storage bucket...");
      const { data, error } = await supabase.storage.from('photos').list();
      if (error) throw error;
      addResult("✅ Storage bucket accessible");
    } catch (error) {
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
