"use client";

import React from "react";
import { ArrowLeft, HelpCircle, Bell, FileText, Menu } from "lucide-react";

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function Header({ onBack, showBack = false }: HeaderProps) {
  return (
    <header className="h-16 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/80 mx-3 mt-3 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile: ← VedaAI */}
        <div className="flex items-center gap-2.5 md:hidden">
          <button
            onClick={onBack}
            type="button"
            className="text-gray-900 hover:text-gray-700 transition p-0.5 -ml-1"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            VedaAI
          </span>
        </div>

        {/* Desktop breadcrumb: ← 📄 Exams */}
        {showBack ? (
          <button
            onClick={onBack}
            type="button"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Back to Upload</span>
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-gray-600 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 font-medium">Exams</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Help - desktop only */}
        <button
          type="button"
          aria-label="Help"
          className="hidden sm:flex text-gray-600 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-gray-800 hover:text-gray-900 w-9 h-9 rounded-full bg-gray-100/80 sm:bg-transparent flex items-center justify-center transition"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5520] rounded-full ring-2 ring-white" />
        </button>

        {/* AI sparkle - desktop only */}
        <button
          type="button"
          aria-label="AI Features"
          className="hidden sm:flex text-gray-600 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <span className="text-base font-bold leading-none">✦</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-orange-400 to-amber-200 text-white flex items-center justify-center font-bold text-xs shadow-inner">
            👤
          </div>
          <span className="text-sm font-medium text-gray-900 hidden sm:inline-block">
            Madhur Rastogi
          </span>
          <span className="text-xs text-gray-400 hidden sm:inline">⌄</span>
        </div>

        {/* Hamburger - mobile only */}
        <button
          type="button"
          aria-label="Menu"
          className="md:hidden text-gray-900 hover:text-gray-700 p-1"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
}
