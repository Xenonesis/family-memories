"use client"

import { useState } from "react";
import { SimpleNavbar } from "@/components/simple-navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Heart, Users, Shield } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        inquiryType: "general"
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@familymemories.com",
      description: "Get help with your account, technical issues, or general questions"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-4567",
      description: "Available Monday-Friday, 9 AM - 6 PM EST"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      details: "123 Memory Lane, Digital City, DC 12345",
      description: "Visit us for partnership opportunities or media inquiries"
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We typically respond to all inquiries within one business day"
    }
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry", icon: MessageCircle },
    { value: "technical", label: "Technical Support", icon: Shield },
    { value: "billing", label: "Billing & Pricing", icon: Users },
    { value: "partnership", label: "Partnership", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Contact Family Memories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're here to help you preserve and share your precious family moments. 
              Reach out to us for support, questions, or just to say hello!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-primary mb-2">{info.details}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Contact Form
                </CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us assist you better
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Type of Inquiry</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {inquiryTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-2 ${
                              formData.inquiryType === type.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions about Family Memories
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How secure are my family photos?",
                  answer: "We use enterprise-grade encryption and secure cloud storage to protect your precious memories. Your photos are private and only accessible to family members you invite."
                },
                {
                  question: "Can I invite family members from different countries?",
                  answer: "Absolutely! Family Memories works globally. You can invite family members from anywhere in the world to join your family vault and share memories together."
                },
                {
                  question: "What file formats do you support?",
                  answer: "We support all major image formats including JPEG, PNG, WEBP, and HEIC. We automatically optimize images for faster loading while preserving quality."
                },
                {
                  question: "Is there a limit to how many photos I can upload?",
                  answer: "Our plans offer generous storage limits. You can upgrade your plan anytime if you need more space for your growing collection of memories."
                },
                {
                  question: "Can I download my photos anytime?",
                  answer: "Yes! You own your memories. You can download individual photos or entire albums anytime. We also provide export tools for backing up your collection."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Preserving Memories?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of families who trust Family Memories to keep their precious moments safe and accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Heart className="w-4 h-4 mr-2" />
                Start Free Trial
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