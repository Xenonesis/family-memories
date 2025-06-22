"use client";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { SettingsCards } from "@/components/profile/SettingsCards";
import { StorageInfo } from "@/components/profile/StorageInfo";

interface ProfileLayoutProps {
  formData: {
    full_name: string;
    phone_number: string;
    bio: string;
    gender: string;
    avatar_url: string;
    notifications_enabled: boolean;
    email_updates_enabled: boolean;
    two_factor_enabled: boolean;
  };
  user: { id: string; email: string } | null;
  uploadingImage: boolean;
  saving: boolean;
  storageInfo: {
    usedMb: number;
    totalMb: number;
    usedPercentage: number;
    availableMb: number;
  };
  onBack: () => void;
  onSave: () => void;
  onImageUpload: (file: File) => void;
  onChange: (field: string, value: string | boolean) => void;
}

export function ProfileLayout({ 
  formData, 
  user, 
  uploadingImage, 
  saving, 
  storageInfo, 
  onBack, 
  onSave, 
  onImageUpload, 
  onChange 
}: ProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <ProfileHeader 
            onBack={onBack}
            onSave={onSave}
            saving={saving}
          />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-1">
              {user && (
                <ProfileCard 
                  formData={formData}
                  user={user}
                  uploadingImage={uploadingImage}
                  onImageUpload={onImageUpload}
                />
              )}
              <StorageInfo storageInfo={storageInfo} />
            </div>

            <div className="xl:col-span-3 space-y-6">
              {user && (
                <PersonalInfoForm 
                  formData={formData}
                  user={user}
                  onChange={onChange}
                />
              )}
              
              <SettingsCards 
                formData={formData}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}