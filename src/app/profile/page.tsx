"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, updateProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { getUserVaults } from "@/lib/database";
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { UserVaultResponse } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [storageInfo, setStorageInfo] = useState({ usedMb: 0, totalMb: 1024, usedPercentage: 0, availableMb: 1024 });
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    bio: "",
    gender: "",
    avatar_url: "",
    notifications_enabled: true,
    email_updates_enabled: false,
    two_factor_enabled: false,
  });

  const loadUserAndProfile = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth');
        return;
      }
      setUser({ id: currentUser.id, email: currentUser.email || '' });

      // Fetch profile data
      const userProfile = await getProfile(currentUser.id);
      if (userProfile) {
        setFormData({
          full_name: userProfile.full_name || "",
          phone_number: userProfile.phone_number || "",
          bio: userProfile.bio || "",
          gender: userProfile.gender || "",
          avatar_url: userProfile.avatar_url || "",
          notifications_enabled: userProfile.notifications_enabled,
          email_updates_enabled: userProfile.email_updates_enabled,
          two_factor_enabled: userProfile.two_factor_enabled,
        });
      }

      // Fetch vaults and calculate storage
      const { data: vaultMembers, error: vaultsError } = await getUserVaults(currentUser.id);
      if (vaultsError) {
        console.error('Error fetching user vaults:', vaultsError);
      } else if (vaultMembers) {
        const totalPhotos = (vaultMembers as UserVaultResponse[]).reduce((acc, member) => {
          if (member.vaults && member.vaults.photos && member.vaults.photos.length > 0) {
            return acc + (member.vaults.photos[0].count || 0);
          }
          return acc;
        }, 0);

        const usedMb = totalPhotos * 2.5; // 2.5MB per photo
        const totalMb = 1024; // 1GB
        const usedPercentage = Math.min((usedMb / totalMb) * 100, 100);
        const availableMb = totalMb - usedMb;

        setStorageInfo({
          usedMb,
          totalMb,
          usedPercentage,
          availableMb,
        });
      }
    } catch (error) {
      console.error('Error loading user and profile:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserAndProfile();
  }, [loadUserAndProfile]);


  const handleImageUpload = async (file: File) => {
    if (!user) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('photos').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
    } catch {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await updateProfile(user.id, formData);
      if (error) {
        alert('Error saving profile: ' + error.message);
      } else {
        alert('Profile updated successfully!');
        await loadUserAndProfile();
      }
    } catch {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout 
      formData={formData}
      user={user}
      uploadingImage={uploadingImage}
      saving={saving}
      storageInfo={storageInfo}
      onBack={() => router.back()}
      onSave={handleSave}
      onImageUpload={handleImageUpload}
      onChange={handleFormChange}
    />
  );
}