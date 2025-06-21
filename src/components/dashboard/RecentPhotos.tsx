"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlus, FaCamera, FaHeart, FaShare, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Memories</h2>
        <Link href="/upload">
          <Button variant="outline" size="sm">
            <FaPlus className="w-3 h-3 mr-2" />
            Upload More
          </Button>
        </Link>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="group overflow-hidden cursor-pointer bg-white/80 dark:bg-gray-800/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                <Image 
                  src={photo.file_url} 
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex justify-between">
                      <button className="p-2 rounded-full bg-red-500/80 hover:bg-red-500">
                        <FaHeart className="w-3 h-3" />
                      </button>
                      <button className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-500">
                        <FaShare className="w-3 h-3" />
                      </button>
                      <button className="p-2 rounded-full bg-green-500/80 hover:bg-green-500">
                        <FaDownload className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{photo.vaults?.name}</p>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{photo.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(photo.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
          
          {photos.length === 0 && (
            <Card className="p-8 text-center col-span-full">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCamera className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Your First Memory</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Upload your first photo to start building your collection</p>
              <Link href="/upload">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <FaCamera className="w-4 h-4 mr-2" />
                  Upload Your First Photo
                </Button>
              </Link>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image 
                    src={photo.file_url} 
                    alt={photo.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{photo.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{photo.vaults?.name}</p>
                  <p className="text-xs text-gray-500">{new Date(photo.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><FaShare className="w-3 h-3" /></Button>
                  <Button size="sm" variant="outline"><FaDownload className="w-3 h-3" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}