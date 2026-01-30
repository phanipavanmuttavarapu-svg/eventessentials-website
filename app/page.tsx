"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-center px-6 overflow-hidden">
      {/* 1. Import 'Great Vibes' for the perfect logo font match */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;700&display=swap');
      `}</style>
      
      <title>Stage Designer | EventEssentials</title>
      
      {/* 2. Logo with High-End Reflection */}
      <div className="relative group mb-4">
        <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
          <Image 
            src="/logo.png"       
            alt="EventEssentials Logo"
            width={300}          
            height={300}
            priority             
            className="object-contain"
          />
        </div>
        {/* Reflection Effect */}
        <div className="absolute -bottom-24 left-0 right-0 h-24 opacity-10 [transform:scaleY(-1)] pointer-events-none select-none">
          <Image 
            src="/logo.png"       
            alt=""
            width={300}          
            height={300}
            className="object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
      </div>

      {/* 3. EventEssentials Text - Matched to Logo Font & Blue Color */}
      <h1 
        style={{ fontFamily: "'Great Vibes', cursive" }}
        className="text-6xl md:text-7xl mb-1 text-[#2B5797] drop-shadow-sm leading-tight"
      >
        EventEssentials
      </h1>
      
      {/* 4. Tagline - Matched to Logo Gold & Spacing */}
      <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#D4A017] uppercase mb-8">
        Your Partner in Every Celebration
      </p>

      <p className="text-md text-gray-500 max-w-lg mb-10 leading-relaxed italic font-light">
        Decor designing, event shopping, catering & ritual planning.
      </p>

      {/* 5. Category Buttons with Glowing Edges */}
      <div className="flex gap-4 flex-wrap justify-center mb-10">
        <a href="/decor" className="group relative px-6 py-2 rounded-full bg-white text-gray-700 font-semibold transition-all">
          <span className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.6)] transition-all"></span>
          <span className="relative">Decor</span>
        </a>
        <a href="/event-shopping" className="group relative px-6 py-2 rounded-full bg-white text-gray-700 font-semibold transition-all">
          <span className="absolute inset-0 rounded-full border-2 border-pink-400 opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(244,114,182,0.6)] transition-all"></span>
          <span className="relative">Event Shopping</span>
        </a>
        <a href="/catering" className="group relative px-6 py-2 rounded-full bg-white text-gray-700 font-semibold transition-all">
          <span className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(251,146,60,0.6)] transition-all"></span>
          <span className="relative">Catering</span>
        </a>
        <a href="/pooja" className="group relative px-6 py-2 rounded-full bg-white text-gray-700 font-semibold transition-all">
          <span className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-40 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.6)] transition-all"></span>
          <span className="relative">Pooja</span>
        </a>
      </div>

      {/* 6. Main Action Button */}
      <a
        href="/decor/designer"
        className="mb-14 px-12 py-4 rounded-full bg-gradient-to-r from-[#2B5797] to-[#6366F1] text-white font-bold text-lg hover:scale-105 transition-all shadow-xl hover:shadow-indigo-500/40"
      >
        Open Decor Stage Designer
      </a>

      {/* Footer Links */}
      <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <a href="/about" className="hover:text-[#2B5797] transition-colors">About Us</a>
        <a href="/contact" className="hover:text-[#2B5797] transition-colors">Contact</a>
      </div>
    </main>
  );
}