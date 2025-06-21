"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function ProfileNav() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/profile">
        <Button variant="outline" size="sm" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <FaUser className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </Link>
    </div>
  );
}