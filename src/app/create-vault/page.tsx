"use client";

import { useState, useEffect } from "react";
import { User } from '@supabase/auth-js/dist/module/lib/types'; // Import Supabase User type

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowLeft, FaPalette, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createVault } from "@/lib/database";

export default function CreateVaultPage() {
  const router = useRouter();
  const [vaultName, setVaultName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const [inviteEmails, setInviteEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const colorOptions = [
    "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-red-500",
    "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
  ];

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);
      }
    };
    getUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError("");

    try {
      const { error } = await createVault(vaultName, description, selectedColor, user.id);
      if (error) throw error;
      
      router.push("/vault");
    } catch (error: unknown) { // Specify unknown type for error
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Vault
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set up a new family memory collection
            </p>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            {/* Vault Preview */}
            <div className="text-center mb-6">
              <div className={`w-32 h-20 ${selectedColor} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white font-medium">
                  {vaultName || "Vault Preview"}
                </span>
              </div>
            </div>

            {/* Vault Name */}
            <div>
              <Label htmlFor="vaultName">Vault Name *</Label>
              <Input
                id="vaultName"
                type="text"
                value={vaultName}
                onChange={(e) => setVaultName(e.target.value)}
                placeholder="e.g., Smith Family, Summer 2024, Wedding Memories"
                required
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your family what this vault is about..."
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Color Selection */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <FaPalette className="w-4 h-4" />
                Choose Vault Color
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 ${color} rounded-lg border-2 transition-all ${
                      selectedColor === color 
                        ? "border-gray-900 dark:border-white scale-110" 
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Invite Members */}
            <div>
              <Label htmlFor="inviteEmails" className="flex items-center gap-2">
                <FaUsers className="w-4 h-4" />
                Invite Family Members (Optional)
              </Label>
              <Textarea
                id="inviteEmails"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="Enter email addresses separated by commas&#10;e.g., mom@email.com, dad@email.com, sister@email.com"
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Family members will receive an invitation to join this vault
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create Vault"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}