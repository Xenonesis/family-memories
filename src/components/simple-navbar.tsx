"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SimpleNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg sm:text-xl">Family Memories</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition duration-150">Home</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm transition duration-150">About</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm transition duration-150">Contact</Link>
          </div>
        </div>

        <div className="flex items-center">
          <Link href="/contact">
            <Button 
              variant="outline" 
              className="px-5 py-2 rounded-full text-sm transition duration-300"
            >
              Let&apos;s Talk!
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}