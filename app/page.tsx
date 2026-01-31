"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-center px-4 relative font-[family-name:var(--font-montserrat)]">
      <title>Home | EventEssentials</title>

      {/* Logo */}
      <div className="mb-3">
        <Image
          src="/logo.png"
          alt="EventEssentials Logo"
          width={220}
          height={220}
          priority
          className="mx-auto md:w-[280px]"
        />
      </div>

      {/* Brand Name */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl mb-1 text-[#2B5797] font-[family-name:var(--font-great-vibes)] leading-tight">
        EventEssentials
      </h1>

      {/* Tagline */}
      <p className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#D4A017] uppercase mb-8">
        Your Partner in Every Celebration
      </p>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 w-full max-w-md md:max-w-2xl font-bold">
        <a className="py-2 rounded-full bg-white border-2 border-purple-400 text-black" href="/decor">Decor</a>
        <a className="py-2 rounded-full bg-white border-2 border-pink-400 text-black" href="/event-shopping">Shopping</a>
        <a className="py-2 rounded-full bg-white border-2 border-orange-400 text-black" href="/catering">Catering</a>
        <a className="py-2 rounded-full bg-white border-2 border-blue-400 text-black" href="/photography">Photography</a>
        <a className="py-2 rounded-full bg-white border-2 border-green-400 text-black" href="/sangeet">Sangeet</a>
        <a className="py-2 rounded-full bg-white border-2 border-yellow-400 text-black" href="/pooja">Pooja</a>
      </div>

      {/* Main CTA */}
      <a
        href="/decor/designer"
        className="w-full max-w-md mb-6 px-6 py-4 rounded-full bg-gradient-to-r from-[#2B5797] to-[#6366F1] text-white font-bold text-lg shadow-xl active:scale-95 transition"
      >
        Open Decor Stage Designer
      </a>

      {/* Signup */}
      <button
        onClick={() => setShowSignup(true)}
        className="text-[#2B5797] text-sm font-bold underline underline-offset-4 mb-6"
      >
        Sign Up (Optional)
      </button>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full relative">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-[#2B5797]">
              Join Us
            </h2>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded-xl outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="w-full py-3 bg-[#D4A017] text-white rounded-xl font-bold"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}