"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function AppLayout({ children, headerLeft, headerRight, sidebar }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A2B3C] flex flex-col">
      {/* GLOBAL HEADER */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 md:px-8 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={50} 
                height={50} 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
            </Link>
            <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden md:block"></div>
            {headerLeft}
          </div>
          <div className="flex items-center gap-3">
            {headerRight}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="w-80 bg-white border-r border-gray-100 overflow-y-auto hidden lg:block p-4">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}