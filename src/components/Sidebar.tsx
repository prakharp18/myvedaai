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

interface SidebarProps {
  collapsed?: boolean;
}

    <aside
      className={`${
        collapsed ? "w-16 items-center" : "w-64"
      } bg-white border-r border-gray-200 hidden md:flex flex-col justify-between p-4 min-h-screen transition-all duration-300 shrink-0`}
    >
      <div className={collapsed ? "flex flex-col items-center w-full" : "w-full"}>
        <div className={`flex items-center gap-2 px-2 py-3 mb-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 shrink-0 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            V
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
              Veda<span className="text-orange-600">AI</span>
            </span>
          )}
        </div>

        <button
          type="button"
          className={`mb-6 bg-gray-100 border border-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2.5 rounded-full flex items-center justify-center transition-all ${
            collapsed ? "w-10 h-10 px-0" : "w-full px-3 gap-2"
          }`}
        >
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
          {!collapsed && <span>AI Teacher&apos;s Toolkit</span>}
        </button>

        <nav className="space-y-1 text-sm font-medium w-full flex flex-col items-center">
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-50 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-gray-400 shrink-0" />
            {!collapsed && <span>Home</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-50 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
            {!collapsed && <span>My Classroom</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-50 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <FileText className="w-4 h-4 text-gray-400 shrink-0" />
            {!collapsed && <span>Assignments</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-orange-700 bg-orange-50 font-semibold rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <ClipboardList className="w-4 h-4 text-orange-600 shrink-0" />
            {!collapsed && <span>Exams</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-50 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <Library className="w-4 h-4 text-gray-400 shrink-0" />
            {!collapsed && <span>My Library</span>}
          </a>
        </nav>
      </div>

      <div className={`space-y-3 pt-4 border-t border-gray-100 w-full flex flex-col items-center`}>
        <a
          href="#"
          className={`flex items-center text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all ${
            collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </a>

        <div
          className={`flex items-center rounded-lg bg-gray-50 border border-gray-100 overflow-hidden ${
            collapsed ? "p-1 justify-center" : "gap-3 p-2.5 w-full"
          }`}
        >
          <div className="w-8 h-8 shrink-0 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
            DPS
          </div>
          {!collapsed && (
            <div className="text-xs whitespace-nowrap overflow-hidden">
              <p className="font-semibold text-gray-800">Delhi Public School</p>
              <p className="text-gray-500">Bokaro Steel City</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
