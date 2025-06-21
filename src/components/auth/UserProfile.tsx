"use client";

import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { Profile } from "@/lib/profile";
import { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User;
  profile: Profile | null;
  onGoToDashboard: () => void;
  onSignOut: () => void;
}

export function UserProfile({ user, profile, onGoToDashboard, onSignOut }: UserProfileProps) {
  return (
    <div className="mb-6 text-center">
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg border-4 border-white dark:border-gray-800">
          {profile?.avatar_url ? (
            <Image 
              src={profile.avatar_url} 
              alt="Profile" 
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="w-12 h-12 text-white" />
          )}
        </div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      </div>
      
      <div className="bg-white/20 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-3 inline-block shadow-lg">
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
          Welcome back, <span className="font-bold text-blue-600 dark:text-blue-400">{profile?.full_name || user.email}</span>!
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          You&apos;re already signed in
        </p>
      </div>
      
      <div className="mt-6 space-x-3">
        <Button 
          onClick={onGoToDashboard}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 shadow-lg"
        >
          Go to Dashboard
        </Button>
        <Button 
          onClick={onSignOut}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 px-6 py-2"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}