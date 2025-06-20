"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Send, Twitter } from "lucide-react"

function Footerdemo() {
  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <h2 className="mb-4 text-2xl sm:text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-sm sm:text-base text-muted-foreground">
              Join our newsletter for the latest updates on preserving your family memories.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-primary">
                Home
              </Link>

              <Link href="#" className="block transition-colors hover:text-primary">
                About Us
              </Link>
              <Link href="#" className="block transition-colors hover:text-primary">
                Gallery
              </Link>
              <Link href="#" className="block transition-colors hover:text-primary">
                Memories
              </Link>
              <Link href="#" className="block transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>123 Memory Lane</p>
              <p>Family City, FC 12345</p>
              <p>Phone: (555) 123-FAMILY</p>
              <p>Email: hello@familymemories.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex flex-wrap gap-3 sm:gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 Family Memories. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="#" className="transition-colors hover:text-primary whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-primary whitespace-nowrap">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-primary whitespace-nowrap">
              Cookie Settings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }