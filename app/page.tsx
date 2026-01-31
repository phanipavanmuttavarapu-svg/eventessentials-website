"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-center px-6 overflow-hidden relative">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;700&display=swap');
      `}</style>

      {/* 1. Brand Logo */}
      <div className="relative mb-4">
        <Image src="/logo.png" alt="Logo" width={280} height={280} priority className="object-contain" />
      </div>

      {/* 2. Brand Name & Tagline matched to logo colors */}
      <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-6xl md:text-7xl mb-1 text-[#2B5797]">
        EventEssentials
      </h1>
      <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#D4A017] uppercase mb-8">
        Your Partner in Every Celebration
      </p>

      {/* 3. Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 max-w-2xl">
        <a href="/decor" className="px-6 py-2 rounded-full bg-white border-2 border-purple-400 font-semibold hover:shadow-md transition">Decor</a>
        <a href="/event-shopping" className="px-6 py-2 rounded-full bg-white border-2 border-pink-400 font-semibold hover:shadow-md transition">Shopping</a>
        <a href="/catering" className="px-6 py-2 rounded-full bg-white border-2 border-orange-400 font-semibold hover:shadow-md transition">Catering</a>
        <a href="/photography" className="px-6 py-2 rounded-full bg-white border-2 border-blue-400 font-semibold hover:shadow-md transition">Photography</a>
        <a href="/sangeet" className="px-6 py-2 rounded-full bg-white border-2 border-green-400 font-semibold hover:shadow-md transition">Sangeet</a>
        <a href="/pooja" className="px-6 py-2 rounded-full bg-white border-2 border-yellow-400 font-semibold hover:shadow-md transition">Pooja</a>
      </div>

      <a href="/decor/designer" className="mb-14 px-12 py-4 rounded-full bg-gradient-to-r from-[#2B5797] to-[#6366F1] text-white font-bold text-lg shadow-xl hover:scale-105 transition">
        Open Decor Stage Designer
      </a>

      {/* 4. Optional Sign Up moved to bottom of page */}
      <div className="mt-auto pb-10">
        <button 
          onClick={() => setShowSignup(true)}
          className="text-[#2B5797] font-bold text-sm underline underline-offset-4 hover:text-[#D4A017] transition-colors"
        >
          Sign Up (Optional)
        </button>
      </div>

      {showSignup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <button onClick={() => setShowSignup(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-2xl font-bold mb-4 text-[#2B5797]">Join Us</h2>
            <input type="email" placeholder="Email (Optional)" className="w-full p-3 border rounded-xl mb-3 outline-none" />
            <input type="tel" placeholder="Phone (Optional)" className="w-full p-3 border rounded-xl mb-4 outline-none" />
            <button onClick={() => setShowSignup(false)} className="w-full py-3 bg-[#D4A017] text-white rounded-xl font-bold">Continue</button>
          </div>
        </div>
      )}
    </main>
  );
}