"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaUpload, FaHeart, FaDownload, FaExpand, FaCheck, FaEye, FaCalendar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  viewMode?: 'grid' | 'masonry' | 'timeline';
  isSelectionMode?: boolean;
}

export function PhotoGrid({ photos, selectedPhotos, onPhotoSelect, viewMode = 'grid', isSelectionMode = false }: PhotoGridProps) {
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getGridClasses = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4';
      case 'timeline':
        return 'grid grid-cols-1 gap-6';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
    }
  };

  if (viewMode === 'timeline') {
    // Group photos by date for timeline view
    const photosByDate = photos.reduce((acc, photo) => {
      const date = new Date(photo.created_at).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(photo);
      return acc;
    }, {} as Record<string, Photo[]>);

    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {Object.entries(photosByDate).map(([date, datePhotos]) => (
          <motion.div key={date} variants={item} className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white dark:bg-gray-800">
                <FaCalendar className="w-3 h-3 mr-2" />
                {date}
              </Badge>
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {datePhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isSelected={selectedPhotos.includes(photo.id)}
                  onSelect={() => onPhotoSelect(photo.id)}
                  isSelectionMode={isSelectionMode}
                  viewMode="grid"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={getGridClasses()}
    >
      <AnimatePresence>
        {photos.map((photo: Photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelected={selectedPhotos.includes(photo.id)}
            onSelect={() => onPhotoSelect(photo.id)}
            isSelectionMode={isSelectionMode}
            viewMode={viewMode}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

interface PhotoCardProps {
  photo: Photo;
  isSelected: boolean;
  onSelect: () => void;
  isSelectionMode: boolean;
  viewMode: 'grid' | 'masonry' | 'timeline';
}

function PhotoCard({ photo, isSelected, onSelect, isSelectionMode, viewMode }: PhotoCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={item}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}
    >
      <Card
        className={`overflow-hidden cursor-pointer transition-all duration-300 group hover:shadow-xl ${
          isSelected ? 'ring-2 ring-violet-500 shadow-lg' : 'hover:shadow-md'
        } bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0`}
        onClick={onSelect}
      >
        <div className={`${viewMode === 'masonry' ? 'aspect-auto' : 'aspect-square'} bg-gray-200 dark:bg-gray-700 overflow-hidden relative`}>
          <Image
            src={photo.file_url}
            alt={photo.title}
            fill={viewMode !== 'masonry'}
            width={viewMode === 'masonry' ? 300 : undefined}
            height={viewMode === 'masonry' ? 200 : undefined}
            className={`${viewMode === 'masonry' ? 'w-full h-auto' : 'object-cover'} transition-transform duration-300 group-hover:scale-105`}
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg5M1Y4MEg4N1Y3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9wYXRoPgo8L3N2Zz4=';
            }}
          />
          
          {/* Selection overlay */}
          {(isSelectionMode || isSelected) && (
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${
              isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                isSelected ? 'bg-violet-500 border-violet-500' : 'bg-black/20'
              }`}>
                {isSelected && <FaCheck className="w-4 h-4 text-white" />}
              </div>
            </div>
          )}
          
          {/* Hover actions */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0">
              <FaHeart className="w-3 h-3 text-white" />
            </Button>
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 border-0">
              <FaExpand className="w-3 h-3 text-white" />
            </Button>
          </div>
          
          {/* Photo info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <FaEye className="w-3 h-3" />
                <span>View</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDownload className="w-3 h-3" />
                <span>Download</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate flex-1">
              {photo.title}
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
              <FaHeart className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
            </Button>
          </div>
          
          {photo.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {photo.description}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{new Date(photo.created_at).toLocaleDateString()}</span>
            <Badge variant="outline" className="text-xs">
              JPG
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}