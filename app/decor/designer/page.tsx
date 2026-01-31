"use client";
import StageCanvas from "@/components/StageCanvas";
import Link from "next/link";
import Image from "next/image";

export default function DecorDesigner() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <title>Stage Designer | EventEssentials</title>
      
      {/* Navigation Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          {/* Small Logo navigating to Home */}
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Home" 
              width={50} 
              height={50} 
              className="cursor-pointer hover:scale-110 transition-transform" 
            />
          </Link>
          
          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          
          <Link href="/decor" className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back to Search
          </Link>
          
          <h1 className="text-xl font-black text-blue-600 tracking-tighter ml-4">
            STAGE DESIGNER
          </h1>
        </div>
        
        <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Pro Visualization Tool
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <StageCanvas />
        </div>
      </main>
    </div>
  );
}