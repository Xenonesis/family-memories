"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUpload, FaImage, FaFileImage } from "react-icons/fa";
import { motion } from "framer-motion";

interface FileUploadAreaProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (files: FileList) => void;
}

export function FileUploadArea({ isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }: FileUploadAreaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-6">
          <motion.div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging
              ? "border-violet-500 bg-violet-50/50 dark:bg-violet-900/10 scale-[1.02]"
              : "border-gray-200 dark:border-gray-700"}`}
            animate={{
              borderColor: isDragging ? "#8b5cf6" : "#e5e7eb",
              backgroundColor: isDragging ? "rgba(237, 233, 254, 0.5)" : "transparent"
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md"
              animate={{
                y: isDragging ? [-10, 0, -10] : 0,
                scale: isDragging ? 1.05 : 1
              }}
              transition={{
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                scale: { duration: 0.2 }
              }}
            >
              <FaUpload className="w-10 h-10 text-white" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isDragging ? "Drop your photos here" : "Drop photos here or click to browse"}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Support for JPG, PNG, GIF up to 10MB each. Add multiple photos at once to create a collection.
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && onFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
              title="Upload photos"
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 px-6"
                  onClick={() => {
                    const fileInput = document.getElementById('file-upload');
                    fileInput?.click();
                  }}
                >
                  <FaFileImage className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="outline" 
                  className="shadow-sm hover:shadow-md transition-all duration-300 px-6"
                  onClick={() => {
                    // Open camera if available
                    const fileInput = document.getElementById('file-upload');
                    if (fileInput) {
                      (fileInput as HTMLInputElement).capture = 'environment';
                      fileInput.click();
                    }
                  }}
                >
                  <FaImage className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </motion.div>
            </div>
            
            <div className="flex items-center justify-center mt-8">
              <div className="w-full max-w-xs h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: isDragging ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}