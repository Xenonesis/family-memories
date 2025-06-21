"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, signOut } from "@/lib/auth";
import { ProfileNav } from "@/components/ProfileNav";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, Profile } from "@/lib/profile";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/components/auth/UserProfile";
import { AuthForm } from "../../components/auth/AuthForm";

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <ProfileNav />
        
        {authLoading && (
          <div className="mb-8 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin mx-auto">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-32 mx-auto animate-pulse"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 mx-auto animate-pulse delay-75"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">Checking authentication...</p>
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
        
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
            {/*
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-4 border border-white/20 dark:border-gray-700/20 shadow-xl">
              <Image 
                src="/images/screenshot.svg" 
                alt="Family Memories Logo" 
                width={64} 
                height={64} 
                className="mx-auto h-16 w-auto drop-shadow-lg" 
              />
            </div>
            */}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Family Memories
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Preserve your precious moments forever
            </p>
          </div>
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
    </div>
  );
}// Force refresh
