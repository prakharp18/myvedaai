"use client";

import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  ClipboardList,
  Library,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={`${
        collapsed ? "w-16 items-center" : "w-64"
      } bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/80 hidden md:flex flex-col justify-between p-4 my-3 ml-3 transition-all duration-300 shrink-0 select-none`}
    >
      <div className={collapsed ? "flex flex-col items-center w-full" : "w-full"}>
        {/* Brand Header */}
        <div className={`flex items-center justify-between px-1 py-2 mb-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-extrabold text-lg shadow-sm tracking-tighter">
              V
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                Veda<span className="text-gray-900">AI</span>
              </span>
            )}
          </div>
          {!collapsed && (
            <button className="text-gray-400 hover:text-gray-600 p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </button>
          )}
        </div>

        {/* AI Toolkit Pill Button */}
        <button
          type="button"
          className={`mb-6 bg-[#2B2D31] text-white font-medium text-xs py-2.5 rounded-full flex items-center justify-center transition-all shadow-sm border border-orange-500/80 hover:bg-[#383A40] ${
            collapsed ? "w-10 h-10 px-0" : "w-full px-4 gap-2"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
          {!collapsed && <span>AI Teacher&apos;s Toolkit</span>}
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1 text-sm font-medium w-full flex flex-col items-center">
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-100/70 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-gray-500 shrink-0" />
            {!collapsed && <span>Home</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-100/70 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-gray-500 shrink-0" />
            {!collapsed && <span>My Classroom</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-100/70 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <FileText className="w-4 h-4 text-gray-500 shrink-0" />
            {!collapsed && <span>Assignments</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-900 bg-gray-100/80 font-semibold rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <ClipboardList className="w-4 h-4 text-gray-900 shrink-0" />
            {!collapsed && <span>Exams</span>}
          </a>
          <a
            href="#"
            className={`flex items-center text-gray-600 hover:bg-gray-100/70 rounded-lg transition-all ${
              collapsed ? "w-10 h-10 justify-center p-0" : "w-full gap-3 px-3 py-2"
            }`}
          >
            <Library className="w-4 h-4 text-gray-500 shrink-0" />
            {!collapsed && <span>My Library</span>}
          </a>
        </nav>
      </div>

      {/* Bottom section: School Info (no settings per mockup) */}
      <div className={`pt-4 w-full flex flex-col items-center`}>
        {/* Collapsed: show expand arrow */}
        {collapsed && (
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition mb-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          className={`flex items-center rounded-xl bg-gray-100/70 border border-gray-200/60 overflow-hidden ${
            collapsed ? "p-1 justify-center" : "gap-3 p-2.5 w-full"
          }`}
        >
          <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1 shadow-sm overflow-hidden">
            <img
              src="/images/sidebar_badge.png"
              alt="School Badge"
              className="w-full h-full object-contain"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                el.parentElement!.innerHTML = '<span class="text-green-700 font-serif font-bold text-xs">DPS</span>';
              }}
            />
          </div>
          {!collapsed && (
            <div className="text-xs whitespace-nowrap overflow-hidden">
              <p className="font-semibold text-gray-900">Delhi Public School</p>
              <p className="text-gray-500 text-[11px]">Bokaro Steel City</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
