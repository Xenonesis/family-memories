"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  name: string;
  loading: boolean;
  error: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export function AuthForm({ 
  isLogin, 
  email, 
  password, 
  name, 
  loading, 
  error, 
  onEmailChange, 
  onPasswordChange, 
  onNameChange, 
  onSubmit, 
  onToggleMode 
}: AuthFormProps) {
  return (
    <Card className="w-full max-w-md p-8 space-y-8 shadow-lg rounded-lg">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          {isLogin ? "Welcome Back" : "Join Family Memories"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {isLogin ? "Sign in to your family vault" : "Create your account to get started"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            {error}
          </div>
        )}
        
        {!isLogin && (
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="John Doe"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            minLength={6}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
        </Button>
      </form>

      {isLogin && (
        <div className="text-center text-sm mt-4">
          <button
            onClick={() => { /* Add forgot password logic here */ }}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Forgot Password?
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </Card>
  );
}