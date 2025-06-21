"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FaTrash, FaImage, FaSpinner, FaCheck, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'skipped';
  errorMessage?: string;
}

interface FileListProps {
  files: UploadedFile[];
  isUploading: boolean;
  onRemoveFile: (id: string) => void;
  onUpdateFile: (id: string, field: 'title' | 'description', value: string) => void;
}

export function FileList({ files, isUploading, onRemoveFile, onUpdateFile }: FileListProps) {
  if (files.length === 0) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'failed': return 'border-red-400 bg-red-50/50 dark:bg-red-900/10';
      case 'success': return 'border-green-400 bg-green-50/50 dark:bg-green-900/10';
      case 'uploading': return 'border-violet-400 bg-violet-50/50 dark:bg-violet-900/10';
      case 'skipped': return 'border-amber-400 bg-amber-50/50 dark:bg-amber-900/10';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading': return (
        <div className="flex items-center">
          <FaSpinner className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-spin mr-2" />
          <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">Uploading...</span>
        </div>
      );
      case 'success': return (
        <div className="flex items-center">
          <FaCheck className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">Success</span>
        </div>
      );
      case 'failed': return (
        <div className="flex items-center">
          <FaExclamationCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-red-600 dark:text-red-400 text-sm font-medium">Failed</span>
        </div>
      );
      case 'skipped': return (
        <div className="flex items-center">
          <FaExclamationTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
          <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">Skipped</span>
        </div>
      );
      default: return null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FaImage className="w-5 h-5 text-violet-600" />
              Photos to Upload
            </CardTitle>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {files.length} files
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {files.map((file) => (
                <motion.div 
                  key={file.id} 
                  variants={item}
                  layout
                  className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-xl shadow-sm ${getStatusColor(file.status)}`}
                >
                  <div className="sm:w-24 h-24 relative rounded-lg overflow-hidden">
                    {file.preview ? (
                      <Image
                        src={file.preview}
                        alt={file.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <FaImage className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {file.status !== 'pending' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                          {file.status === 'uploading' && <FaSpinner className="w-5 h-5 text-violet-600 animate-spin" />}
                          {file.status === 'success' && <FaCheck className="w-5 h-5 text-green-600" />}
                          {file.status === 'failed' && <FaExclamationCircle className="w-5 h-5 text-red-600" />}
                          {file.status === 'skipped' && <FaExclamationTriangle className="w-5 h-5 text-amber-600" />}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-lg">
                          {file.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <div>
                        {getStatusIcon(file.status)}
                      </div>
                    </div>
                    
                    {file.status !== 'skipped' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Title</label>
                          <Input
                            value={file.title}
                            onChange={(e) => onUpdateFile(file.id, 'title', e.target.value)}
                            placeholder="Photo title"
                            className="font-medium bg-white dark:bg-gray-800"
                            disabled={isUploading || file.status === 'success'}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Description (optional)</label>
                          <Textarea
                            value={file.description}
                            onChange={(e) => onUpdateFile(file.id, 'description', e.target.value)}
                            placeholder="Add a description"
                            rows={2}
                            className="bg-white dark:bg-gray-800 resize-none"
                            disabled={isUploading || file.status === 'success'}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-sm text-amber-700 dark:text-amber-400">{file.description}</p>
                      </div>
                    )}
                    
                    {file.errorMessage && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                        <FaExclamationCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-400">{file.errorMessage}</p>
                      </div>
                    )}
                  </div>
                  
                  {file.status !== 'uploading' && file.status !== 'success' && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveFile(file.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}