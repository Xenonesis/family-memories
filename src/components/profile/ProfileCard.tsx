import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaUser, FaCamera, FaEdit, FaPhone } from "react-icons/fa";
import Image from "next/image";

interface ProfileCardProps {
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
  onImageUpload: (file: File) => void;
}

export function ProfileCard({ formData, user, uploadingImage, onImageUpload }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center relative group">
            {formData.avatar_url ? (
              <Image 
                src={formData.avatar_url} 
                alt="Profile" 
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-16 h-16 text-white" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <FaCamera className="w-6 h-6 text-white" />
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
            aria-label="Edit profile picture"
          >
            {uploadingImage ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaEdit className="w-4 h-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
            className="hidden"
          />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {formData.full_name || 'No Name Set'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {user?.email}
        </p>
        {formData.phone_number && (
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mb-2">
            <FaPhone className="w-4 h-4" />
            {formData.phone_number}
          </p>
        )}
        {formData.bio && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            &quot;{formData.bio}&quot;
          </p>
        )}
      </div>
    </Card>
  );
}