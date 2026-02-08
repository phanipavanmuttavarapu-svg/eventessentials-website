"use client";

import { useState } from "react";

const HEADER_PATTERN = { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 8px)' };

/**
 * Reusable App Layout Component
 * Provides consistent header, sidebar, and main content area across all pages
 * 
 * Props:
 *   - headerLeft: ReactNode - Content for left side of header
 *   - headerRight: ReactNode - Content for right side of header (controls)
 *   - sidebar: ReactNode - Sidebar content (optional)
 *   - children: ReactNode - Main content area
 *   - title: string - Page title (shown in header)
 */
export default function AppLayout({ 
  headerLeft, 
  headerRight, 
  sidebar, 
  children, 
  title = "Stage Designer" 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div 
      className="w-full h-screen bg-white flex flex-col overflow-hidden" 
      style={{
        fontFamily: 'var(--ee-font, Inter, system-ui, -apple-system, sans-serif)',
        color: 'var(--ee-primary, #1E40AF)'
      }}
    >
      {/* HEADER */}
      <header 
        className="w-full bg-white border-b px-2 md:px-4 py-2 md:py-3 flex flex-row items-center justify-between gap-1 md:gap-2 overflow-x-auto whitespace-nowrap flex-shrink-0 scrollbar-thin" 
        style={{...HEADER_PATTERN}} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 md:gap-3 flex-nowrap">
          {headerLeft}
        </div>

        {/* RIGHT SECTION - CONTROLS */}
        <div className="flex items-center gap-1 md:gap-2 flex-nowrap ml-auto">
          {headerRight}
        </div>
      </header>

      {/* MAIN LAYOUT - SIDEBAR + CONTENT */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden w-full">
        {/* SIDEBAR - Only show on desktop or when open on mobile */}
        {sidebar && (
          <aside 
            className={`w-full md:w-[280px] lg:w-[320px] bg-white border-r p-3 md:p-4 overflow-y-auto flex flex-col gap-3 md:gap-4 flex-shrink-0 transition-all duration-300 ${
              !isSidebarOpen ? 'hidden md:flex' : 'flex'
            }`} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sidebar Close Button */}
            <div className="flex md:hidden justify-between items-center mb-2">
              <h2 className="text-sm font-bold text-gray-700">{title}</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>
            {sidebar}
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-gray-100 flex items-center justify-center p-0 overflow-hidden relative">
          {/* Mobile Sidebar Toggle Button */}
          {sidebar && !isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-2 left-2 z-40 md:hidden p-2 bg-blue-600 text-white rounded-lg shadow-lg text-sm font-bold"
            >
              ☰ Menu
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
