"use client";

import StageCanvas from "@/components/StageCanvas";
import Image from "next/image";
import Link from "next/link";

export default function DecorDesigner() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/decor" className="text-gray-400 hover:text-gray-600">
            ← Back to Search
          </Link>
          <h1 className="text-xl font-black text-blue-600 tracking-tighter">
            STAGE DESIGNER
          </h1>
        </div>
        <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Pro Visualization Tool
        </div>
      </header>

      {/* Canvas Container */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* We pass the Canvas component here */}
          <StageCanvas />
        </div>
        
        <p className="mt-4 text-[10px] text-gray-400 font-medium">
          Tip: Images searched in the "Event Decor" page will appear automatically in your sidebar library.
        </p>
      </main>
    </div>
  );
}