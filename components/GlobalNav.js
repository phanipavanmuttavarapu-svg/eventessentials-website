"use client";
import Link from "next/link";
import { useState } from "react";

export default function GlobalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-xl font-black text-blue-600">EVENT ESSENTIALS</div>
        </Link>

        {/* Desktop Menu intentionally left empty per request (no items in highlighted area) */}
        <div className="hidden md:flex items-center gap-6">
          <div />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-600 font-bold">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-2">
          <Link href="/decor/designer" className="text-sm font-bold text-gray-700 py-2">Stage Designer</Link>
          <Link href="/decor" className="text-sm font-bold text-gray-700 py-2">Decor Ideas</Link>
          <Link href="/event-shopping" className="text-sm font-bold text-gray-700 py-2">Shopping</Link>
          <Link href="/catering" className="text-sm font-bold text-gray-700 py-2">Catering</Link>
          <Link href="/photography" className="text-sm font-bold text-gray-700 py-2">Photography</Link>
          <Link href="/sangeet" className="text-sm font-bold text-gray-700 py-2">Sangeet</Link>
          <Link href="/pooja" className="text-sm font-bold text-gray-700 py-2">Pooja</Link>
        </div>
      )}
    </nav>
  );
}
