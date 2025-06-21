"use client"

import { SimpleNavbar } from "@/components/simple-navbar";
import { Footer } from "@/components/footer";
import { ProfileNav } from "@/components/ProfileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, Zap, Database, Cloud, Code, Palette, Lock, Globe } from "lucide-react";

export default function AboutPage() {
  const techStack = [
    { name: "Next.js 14+", description: "React framework with App Router", icon: Code },
    { name: "TypeScript", description: "Type-safe development", icon: Code },
    { name: "ShadCN UI", description: "Beautiful UI components", icon: Palette },
    { name: "Tailwind CSS", description: "Utility-first styling", icon: Palette },
    { name: "Supabase", description: "Backend & authentication", icon: Database },
    { name: "PostgreSQL", description: "Reliable database", icon: Database },
    { name: "Vercel", description: "Fast deployment", icon: Cloud }
  ];

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption protects your precious memories with advanced security protocols."
    },
    {
      icon: Users,
      title: "Family Collaboration",
      description: "Invite family members with role-based permissions to contribute and view memories together."
    },
    {
      icon: Zap,
      title: "Smart Organization",
      description: "AI-powered tagging and timeline views make finding memories effortless."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your family vault from anywhere in the world with seamless synchronization."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ProfileNav />
      <SimpleNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Heart className="w-4 h-4 mr-2" />
              About Family Memories
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Preserving Family Stories for Generations
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Family Memories is a secure, private platform designed to help families preserve, organize, 
              and share their most precious moments across generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every family has a unique story worth preserving. Our mission is to provide 
              a secure, intuitive platform where families can safely store, organize, and share their 
              memories, ensuring precious moments are never lost and can be passed down through generations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Family Memories?</h2>
            <p className="text-muted-foreground">Built with families in mind, designed for the future</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
              <p className="text-muted-foreground">
                Powered by cutting-edge technologies for performance, security, and reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <tech.icon className="w-5 h-5 text-primary mr-2" />
                    <CardTitle className="text-base">{tech.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Platform Architecture</h2>
              <p className="text-muted-foreground">
                Designed for scalability, security, and seamless user experience
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Frontend Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Next.js 14 App Router</span>
                    <Badge variant="secondary">React 18</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">TypeScript</span>
                    <Badge variant="secondary">Type Safety</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ShadCN UI + Tailwind</span>
                    <Badge variant="secondary">Design System</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Framer Motion</span>
                    <Badge variant="secondary">Animations</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Backend Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Supabase Platform</span>
                    <Badge variant="secondary">BaaS</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">PostgreSQL Database</span>
                    <Badge variant="secondary">Relational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Row Level Security</span>
                    <Badge variant="secondary">RLS</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Real-time Subscriptions</span>
                    <Badge variant="secondary">Live Updates</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Security & Privacy First</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your family memories deserve the highest level of protection. We implement enterprise-grade 
              security measures including end-to-end encryption, secure authentication, and privacy-by-design 
              architecture to ensure your precious moments remain safe and private.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Private by Default</h3>
                <p className="text-sm text-muted-foreground">Invite-only access with role-based permissions</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">Full data ownership and deletion rights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Start Your Family Memory Journey</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of families who trust Family Memories to preserve their most precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Heart className="w-4 h-4 mr-2" />
                Create Your Vault
              </Button>
              <Button variant="outline" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}