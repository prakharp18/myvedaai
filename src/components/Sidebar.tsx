"use client";

import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  ClipboardList,
  Library,
  Settings,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 min-h-screen">
      {/* Top section */}
      <div>
        {/* Brand logo */}
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            V
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Veda<span className="text-orange-600">AI</span>
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full mb-6 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 font-medium text-sm py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span>AI Teacher&apos;s Toolkit</span>
        </button>

        {/* Navigation links */}
        <nav className="space-y-1 text-sm font-medium">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <LayoutDashboard className="w-4 h-4 text-gray-400" />
            Home
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <GraduationCap className="w-4 h-4 text-gray-400" />
            My Classroom
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <FileText className="w-4 h-4 text-gray-400" />
            Assignments
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-orange-700 bg-orange-50 font-semibold rounded-lg"
          >
            <ClipboardList className="w-4 h-4 text-orange-600" />
            Exams
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
          >
            <Library className="w-4 h-4 text-gray-400" />
            My Library
          </a>
        </nav>
      </div>

      {/* Bottom section: Settings & School Info */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </a>

        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
            DPS
          </div>
          <div className="text-xs">
            <p className="font-semibold text-gray-800">Delhi Public School</p>
            <p className="text-gray-500">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
