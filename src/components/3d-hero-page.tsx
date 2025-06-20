import React from 'react';
import { HeroSection } from "@/components/ui/3d-hero-section-boxes";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Footer } from "@/components/footer";

// This is the main component for the 3D hero page
export function HeroPage() {
  return (
    <div>
      <HeroSection />
      
      {/* Add existing sections below the 3D hero */}
      <TestimonialsSection />
      <Footer />
    </div>
  );
}