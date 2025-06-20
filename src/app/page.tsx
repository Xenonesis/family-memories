"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center">
      <Navbar />
      <BackgroundPaths title="Family Memories" />
    </main>
  );
}
