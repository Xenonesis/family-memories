"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, signOut } from "@/lib/auth";
import { ProfileNav } from "@/components/ProfileNav";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, Profile } from "@/lib/profile";
import { User, Session } from '@supabase/supabase-js';
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/components/auth/UserProfile";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
    
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
      setAuthLoading(true);
      if (session?.user) {
        setCurrentUser(session.user);
        const profile = await getProfile(session.user.id);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkCurrentUser = async () => {
    try {
      setAuthLoading(true);
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const profile = await getProfile(user.id);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error checking current user:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        alert("Check your email for verification link!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <ProfileNav />
      
      {authLoading && (
        <div className="mb-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Checking authentication...</p>
        </div>
      )}
      
      {!authLoading && currentUser && (
        <UserProfile 
          user={currentUser}
          profile={userProfile}
          onGoToDashboard={() => router.push('/dashboard')}
          onSignOut={handleSignOut}
        />
      )}
      
      <div className="mb-8 text-center">
        <Image src="/images/screenshot.svg" alt="Family Memories Logo" width={64} height={64} className="mx-auto h-16 w-auto" />
      </div>

      {!authLoading && !currentUser && (
        <AuthForm 
          isLogin={isLogin}
          email={email}
          password={password}
          name={name}
          loading={loading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onNameChange={setName}
          onSubmit={handleSubmit}
          onToggleMode={() => setIsLogin(!isLogin)}
        />
      )}
    </div>
  );
}