"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlus, FaCamera, FaHeart, FaShare, FaDownload, FaImage, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Photo {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  vault_id: string;
  vaults?: { name: string };
}

interface RecentPhotosProps {
  photos: Photo[];
  viewMode: 'grid' | 'list';
}

export function RecentPhotos({ photos, viewMode }: RecentPhotosProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-gray-900 dark:text-white flex items-center"
        >
          <FaImage className="mr-2 text-emerald-600" /> Recent Memories
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/upload">
            <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-300">
              <FaPlus className="w-3 h-3 mr-2" />
              Upload More
            </Button>
          </Link>
        </motion.div>
      </div>
      
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {photos.map((photo) => (
              <motion.div 
                key={photo.id}
                variants={item}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredId(photo.id)}
                onHoverEnd={() => setHoveredId(null)}
                layout
              >
                <Card className="group overflow-hidden cursor-pointer bg-white/90 dark:bg-gray-800/90 hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                    {!loadedImages[photo.id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Skeleton className="w-full h-full absolute" />
                        <FaImage className="w-8 h-8 text-gray-400 animate-pulse" />
                      </div>
                    )}
                    <Image 
                      src={photo.file_url} 
                      alt={photo.title}
                      fill
                      className={`object-cover transition-all duration-500 ${hoveredId === photo.id ? 'scale-110' : 'scale-100'} ${!loadedImages[photo.id] ? 'opacity-0' : 'opacity-100'}`}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      onLoad={() => handleImageLoad(photo.id)}
                      priority
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${hoveredId === photo.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-3 text-white">
                        <motion.button 
                          className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaHeart className="w-3 h-3" />
                        </motion.button>
                        <motion.button 
                          className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-500 shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaShare className="w-3 h-3" />
                        </motion.button>
                        <motion.button 
                          className="p-2 rounded-full bg-green-500/80 hover:bg-green-500 shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaDownload className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/30 text-white text-xs">
                        {photo.vaults?.name}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{photo.title}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(photo.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <FaEye className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {photos.length === 0 && (
              <motion.div 
                className="col-span-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-0 shadow-lg">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaCamera className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Share Your First Memory</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Upload your first photo to start building your collection of precious family moments</p>
                  <Link href="/upload">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300">
                      <FaCamera className="w-4 h-4 mr-2" />
                      Upload Your First Photo
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="space-y-3"
          >
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                variants={item}
                whileHover={{ scale: 1.01, x: 3 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/90 dark:bg-gray-800/90">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative shadow-sm">
                        {!loadedImages[`list-${photo.id}`] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Skeleton className="w-full h-full absolute" />
                            <FaImage className="w-4 h-4 text-gray-400 animate-pulse" />
                          </div>
                        )}
                        <Image 
                          src={photo.file_url} 
                          alt={photo.title}
                          width={64}
                          height={64}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${!loadedImages[`list-${photo.id}`] ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={() => handleImageLoad(`list-${photo.id}`)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{photo.title}</h4>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="mr-2 text-xs bg-transparent">
                                {photo.vaults?.name}
                              </Badge>
                              <p className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <FaHeart className="w-3 h-3 text-red-500" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <FaShare className="w-3 h-3 text-blue-500" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <FaDownload className="w-3 h-3 text-green-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {photos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 text-center border-dashed border-2 border-gray-200 dark:border-gray-700 bg-transparent">
                  <FaCamera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No photos yet. Start by uploading your first memory.</p>
                  <div className="mt-4">
                    <Link href="/upload">
                      <Button variant="outline" size="sm">
                        <FaPlus className="w-3 h-3 mr-2" /> Upload Photos
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}