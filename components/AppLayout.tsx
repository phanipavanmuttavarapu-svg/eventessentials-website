"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AppLayoutProps {
  title?: string;
  children: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function AppLayout({ title, children, headerLeft, headerRight, sidebar }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    const close = () => setIsSidebarOpen(false);
    window.addEventListener('closeSidebar', close);
    return () => window.removeEventListener('closeSidebar', close);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2B3C] flex flex-col">
      {/* GLOBAL HEADER */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 md:px-8 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 overflow-x-auto">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="cursor-pointer hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-xs md:text-sm font-bold text-gray-600">← Back to Search</div>
                <div className="text-base md:text-xl font-black text-blue-700">{title || 'STAGE DESIGNER'}</div>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sidebar && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden px-2 py-1 border border-gray-200 rounded-md text-[10px] font-bold bg-white shadow-sm"
                aria-label="Open sidebar"
              >
                ☰ Menu
              </button>
            )}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              {headerLeft}
              {headerRight}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="w-80 bg-white border-r border-gray-100 overflow-y-auto hidden lg:block p-4">
            {sidebar}
          </aside>
        )}

        {sidebar && (
          <aside className={`fixed inset-y-0 left-0 z-50 w-11/12 max-w-sm bg-white border-r border-gray-100 p-4 shadow-xl transition-transform duration-200 ease-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black">Menu</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="h-[calc(100vh-80px)] overflow-y-auto">{sidebar}</div>
          </aside>
        )}

        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/25 lg:hidden" />
        )}

        <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}