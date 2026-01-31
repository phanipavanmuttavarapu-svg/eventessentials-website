"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-center px-6 relative font-[family-name:var(--font-montserrat)]">
      <title>Home | EventEssentials</title>
      
      {/* Brand Logo */}
      <div className="mb-4">
        <Image src="/logo.png" alt="Logo" width={280} height={280} priority />
      </div>

      {/* Font & Color matched to Logo */}
      <h1 className="text-6xl md:text-7xl mb-1 text-[#2B5797] font-[family-name:var(--font-great-vibes)]">
        EventEssentials
      </h1>
      <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#D4A017] uppercase mb-10 font-[family-name:var(--font-montserrat)]">
        Your Partner in Every Celebration
      </p>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 max-w-2xl font-bold">
        <a href="/decor" className="px-6 py-2 rounded-full bg-white border-2 border-purple-400">Decor</a>
        <a href="/event-shopping" className="px-6 py-2 rounded-full bg-white border-2 border-pink-400">Shopping</a>
        <a href="/catering" className="px-6 py-2 rounded-full bg-white border-2 border-orange-400">Catering</a>
        <a href="/photography" className="px-6 py-2 rounded-full bg-white border-2 border-blue-400">Photography</a>
        <a href="/sangeet" className="px-6 py-2 rounded-full bg-white border-2 border-green-400">Sangeet</a>
        <a href="/pooja" className="px-6 py-2 rounded-full bg-white border-2 border-yellow-400">Pooja</a>
      </div>

      <a href="/decor/designer" className="mb-6 px-12 py-4 rounded-full bg-gradient-to-r from-[#2B5797] to-[#6366F1] text-white font-bold text-lg shadow-xl active:scale-95 transition">
        Open Decor Stage Designer
      </a>

      {/* Signup at the very bottom */}
      <div className="mt-8 pb-6">
        <button onClick={() => setShowSignup(true)} className="text-[#2B5797] text-sm font-bold underline underline-offset-4">
          Sign Up (Optional)
        </button>
      </div>

      {/* Sign-up Modal Logic */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-[family-name:var(--font-montserrat)]">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full relative">
            <button onClick={() => setShowSignup(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-[#2B5797]">Join Us</h2>
            <form className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-xl outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-xl outline-none" />
              <button type="button" onClick={() => setShowSignup(false)} className="w-full py-3 bg-[#D4A017] text-white rounded-xl font-bold">Continue</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}