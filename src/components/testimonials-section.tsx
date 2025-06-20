"use client";

import { CircularTestimonials } from "@/components/ui/circular-testimonials";

const testimonials = [
  {
    quote:
      "Family Memories has transformed how we preserve and share our precious moments. The platform makes it so easy to create beautiful collections that our whole family can enjoy.",
    name: "Sarah Chen",
    designation: "Mother of Three",
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop",
  },
  {
    quote:
      "As a grandparent, this platform helps me stay connected with my grandchildren's milestones. The interface is intuitive and the memories we create are priceless.",
    name: "Michael Rodriguez",
    designation: "Grandfather & Retired Teacher",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
  },
  {
    quote:
      "The collaborative features are amazing! Our extended family can all contribute photos and stories, making every memory richer and more complete.",
    name: "Emily Watson",
    designation: "Family Organizer",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            What Families Say About Us
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4">
            Discover how families around the world are preserving their precious moments 
            and creating lasting memories with our platform.
          </p>
        </div>
        <div className="flex justify-center">
          <CircularTestimonials 
            testimonials={testimonials} 
            autoplay={true}
            colors={{
              name: "#f7f7ff",
              designation: "#e1e1e1",
              testimony: "#f1f1f7",
              arrowBackground: "#0582CA",
              arrowForeground: "#141414",
              arrowHoverBackground: "#f7f7ff",
            }}
            fontSizes={{
              name: "28px",
              designation: "20px",
              quote: "20px",
            }}
          />
        </div>
      </div>
    </section>
  );
}