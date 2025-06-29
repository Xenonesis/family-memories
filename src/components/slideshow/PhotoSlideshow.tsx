"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaTimes, FaExpand, FaCompress, FaDownload, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

interface PhotoSlideshowProps {
  photos: Photo[];
  initialIndex?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onClose?: () => void;
  showControls?: boolean;
  showThumbnails?: boolean;
}

export function PhotoSlideshow({ 
  photos, 
  initialIndex = 0, 
  autoPlay = false,
  autoPlayInterval = 5000,
  onClose,
  showControls = true,
  showThumbnails = true
}: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadingTimes, setLoadingTimes] = useState<Record<string, number>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<Record<string, number>>({});

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      intervalRef.current = setInterval(goToNext, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, goToNext, autoPlayInterval, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          } else if (onClose) {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, isPlaying, isFullscreen, onClose]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      slideshowRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Image loading handlers
  const handleImageLoadStart = (photoId: string) => {
    startTimeRef.current[photoId] = Date.now();
  };

  const handleImageLoad = (photoId: string) => {
    const loadTime = Date.now() - (startTimeRef.current[photoId] || Date.now());
    setImageLoaded(prev => ({ ...prev, [photoId]: true }));
    setLoadingTimes(prev => ({ ...prev, [photoId]: loadTime }));
  };

  const handleImageError = (photoId: string) => {
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
    setImageLoaded(prev => ({ ...prev, [photoId]: false }));
  };

  // Preload adjacent images
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (photos[index] && !imageLoaded[photos[index].id]) {
        const img = new window.Image();
        img.onload = () => handleImageLoad(photos[index].id);
        img.onerror = () => handleImageError(photos[index].id);
        img.src = photos[index].file_url;
        handleImageLoadStart(photos[index].id);
      }
    };

    // Preload current, next, and previous images
    preloadImage(currentIndex);
    preloadImage((currentIndex + 1) % photos.length);
    preloadImage((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, photos, imageLoaded]);

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No photos available for slideshow</p>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div 
      ref={slideshowRef}
      className={`relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg overflow-hidden'}`}
    >
      {/* Main slideshow area */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {imageErrors[currentPhoto.id] ? (
              <div className="flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <FaTimes className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">Failed to load image</p>
                <p className="text-sm text-gray-300">{currentPhoto.title}</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {!imageLoaded[currentPhoto.id] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <Image
                  src={currentPhoto.file_url}
                  alt={currentPhoto.title}
                  fill
                  className="object-contain"
                  onLoad={() => handleImageLoad(currentPhoto.id)}
                  onError={() => handleImageError(currentPhoto.id)}
                  onLoadStart={() => handleImageLoadStart(currentPhoto.id)}
                  priority={Math.abs(currentIndex - initialIndex) <= 1}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        {showControls && photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
              onClick={goToPrevious}
            >
              <FaChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
              onClick={goToNext}
            >
              <FaChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Top controls */}
        {showControls && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-black/50 text-white">
                {currentIndex + 1} / {photos.length}
              </Badge>
              {loadingTimes[currentPhoto.id] && (
                <Badge className="bg-black/50 text-white">
                  {loadingTimes[currentPhoto.id]}ms
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                  onClick={onClose}
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-black/50 backdrop-blur-sm border-white/20 text-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-1">{currentPhoto.title}</h3>
                {currentPhoto.description && (
                  <p className="text-sm text-gray-300 mb-2">{currentPhoto.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(currentPhoto.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  <FaHeart className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 w-8 h-8"
                >
                  <FaDownload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Thumbnail strip */}
      {showThumbnails && photos.length > 1 && (
        <div className="bg-black/80 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-white scale-110' 
                    : 'border-transparent hover:border-white/50'
                }`}
              >
                <Image
                  src={photo.file_url}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {imageErrors[photo.id] && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <FaTimes className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar for auto-play */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}