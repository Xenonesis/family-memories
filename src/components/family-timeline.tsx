"use client";

import { Camera, Heart, Users, Gift, Home, Baby } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const familyTimelineData = [
  {
    id: 1,
    title: "First Photo",
    date: "Jan 2020",
    content: "The beginning of our digital family album. Our first precious moment captured and stored safely.",
    category: "Milestone",
    icon: Camera,
    relatedIds: [2, 6],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Wedding Day",
    date: "Jun 2020",
    content: "The most beautiful day of our lives, surrounded by family and friends. Every moment preserved forever.",
    category: "Celebration",
    icon: Heart,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Family Reunion",
    date: "Dec 2020",
    content: "Three generations coming together. Stories shared, memories made, and bonds strengthened.",
    category: "Gathering",
    icon: Users,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "First Birthday",
    date: "Mar 2021",
    content: "Celebrating our little one's first year. Cake, laughter, and countless photos to treasure.",
    category: "Milestone",
    icon: Gift,
    relatedIds: [3, 5, 6],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 5,
    title: "New Home",
    date: "Aug 2021",
    content: "Moving into our forever home. New memories waiting to be made in every room.",
    category: "Life Change",
    icon: Home,
    relatedIds: [4, 6],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 6,
    title: "Baby's First Steps",
    date: "Nov 2021",
    content: "Those precious first steps captured on video. A moment we'll treasure forever.",
    category: "Milestone",
    icon: Baby,
    relatedIds: [1, 4, 5],
    status: "pending" as const,
    energy: 60,
  },
];

export function FamilyTimeline() {
  return (
    <div className="w-full">
      <RadialOrbitalTimeline timelineData={familyTimelineData} />
    </div>
  );
}