"use client";

import React from "react";
import { ArrowLeft, HelpCircle, Bell, User } from "lucide-react";

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function Header({ onBack, showBack = false }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile brand indicator */}
        <div className="flex items-center gap-1.5 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            V
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            Veda<span className="text-orange-600">AI</span>
          </span>
        </div>

        {showBack ? (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition bg-gray-50 sm:bg-transparent px-2.5 py-1.5 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-gray-200"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Back to Upload</span>
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-gray-700 text-sm font-medium">
            <span className="text-gray-400">Exams</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">AI Assessment Extraction</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Help"
          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-xs border border-orange-200">
            MR
          </div>
          <span className="text-sm font-medium text-gray-800 hidden sm:inline-block">
            Madhur Rastogi
          </span>
        </div>
      </div>
    </header>
  );
}
