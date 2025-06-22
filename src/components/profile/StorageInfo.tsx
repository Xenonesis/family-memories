"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCloud, FaArrowUp } from "react-icons/fa";

interface StorageInfoProps {
  storageInfo: {
    usedMb: number;
    totalMb: number;
    usedPercentage: number;
    availableMb: number;
  };
}

function formatMB(mb: number, decimals = 1) {
    if (mb < 1024) {
        return `${mb.toFixed(mb > 0 ? decimals : 0)} MB`;
    }
    return `${(mb / 1024).toFixed(decimals)} GB`;
}

export function StorageInfo({ storageInfo }: StorageInfoProps) {
  const { usedMb, totalMb, usedPercentage, availableMb } = storageInfo;

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FaCloud className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Storage
            </h2>
        </div>
        <span className="font-semibold text-blue-600 dark:text-blue-400">{usedPercentage.toFixed(0)}%</span>
      </div>

      <div className="relative h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="absolute h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${usedPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
        <span>{formatMB(usedMb)} used</span>
        <span>{formatMB(totalMb)} total</span>
      </div>

      <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
        <span>Available: {formatMB(availableMb)}</span>
        <span>Usage: {usedPercentage.toFixed(2)}%</span>
      </div>

      <Button variant="outline" className="w-full mt-6 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300">
        <FaArrowUp className="mr-2 h-4 w-4" />
        Upgrade Plan
      </Button>
    </Card>
  );
}
