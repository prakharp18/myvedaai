"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Extracting data...
        </h2>
        <p className="text-gray-500 text-sm max-w-sm text-center">
          Analyzing question paper and mapping handwritten answers. This may take a few moments.
        </p>
      </div>
    </div>
  );
}
