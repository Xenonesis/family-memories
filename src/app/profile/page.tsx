"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, updateProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { ProfileLayout } from "@/components/profile/ProfileLayout";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
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
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth');
        return;
      }

      setUser({ id: currentUser.id, email: currentUser.email || '' });
      
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
      onBack={() => router.back()}
      onSave={handleSave}
      onImageUpload={handleImageUpload}
      onChange={handleFormChange}
    />
  );
}