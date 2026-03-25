"use client";
import StageCanvas from "@/components/StageCanvas";
import Link from "next/link";
import Image from "next/image";

export default function DecorDesigner() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <title>Stage Designer | EventEssentials</title>
      
      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <StageCanvas />
        </div>
      </main>
    </div>
  );
}