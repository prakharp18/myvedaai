"use client";

import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gradient-to-b from-[#F9F9FB] via-[#F4F4F6] to-[#E9EAEC]">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Sparkle Image with subtle floating/pulse animation */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <img
            src="/images/loader_sparkle.png"
            alt="Extracting"
            className="w-full h-full object-contain animate-pulse select-none pointer-events-none"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Extracting...
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          This may take a while
        </p>
      </div>
    </div>
  );
}
