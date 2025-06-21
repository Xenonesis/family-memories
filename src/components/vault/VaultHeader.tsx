"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaUpload, FaShare } from "react-icons/fa";
import Link from "next/link";

interface Vault {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface VaultHeaderProps {
  vault: Vault;
  photoCount: number;
}

export function VaultHeader({ vault, photoCount }: VaultHeaderProps) {
  return (
    <div className={`${vault.color} text-white p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{vault.name}</h1>
            <p className="text-blue-100 mb-4">{vault.description}</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {photoCount} photos
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/upload">
              <Button variant="secondary">
                <FaUpload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </Link>
            <Button variant="secondary">
              <FaShare className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}