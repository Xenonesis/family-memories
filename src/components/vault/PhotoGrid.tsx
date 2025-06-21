"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUpload } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  uploaded_by: string;
}

interface PhotoGridProps {
  photos: Photo[];
  selectedPhotos: string[];
  onPhotoSelect: (photoId: string) => void;
}

export function PhotoGrid({ photos, selectedPhotos, onPhotoSelect }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaUpload className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No photos yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start building your family memories by uploading your first photos
        </p>
        <Link href="/upload">
          <Button>
            <FaUpload className="w-4 h-4 mr-2" />
            Upload First Photos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo: Photo) => (
        <Card
          key={photo.id}
          className={`overflow-hidden cursor-pointer transition-all ${
            selectedPhotos.includes(photo.id) ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onPhotoSelect(photo.id)}
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
            <Image
              src={photo.file_url}
              alt={photo.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg5M1Y4MEg4N1Y3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9wYXRoPgo8L3N2Zz4=';
              }}
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(photo.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}