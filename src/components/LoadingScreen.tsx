"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-white">
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-6 text-orange-500 animate-pulse flex items-center justify-center">
          <Sparkles className="w-16 h-16" fill="currentColor" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
          <div className="absolute bottom-2 left-0 w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-150" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Extracting...
        </h2>
        <p className="text-gray-500 text-sm">
          This may take a while
        </p>
      </div>
    </div>
  );
}
