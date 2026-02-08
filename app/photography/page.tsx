"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";

export default function Photography() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const CX = process.env.NEXT_PUBLIC_GOOGLE_CX || "";

  const searchPhotography = async (style: string) => {
    const term = style || query;
    if (!term || !API_KEY || !CX) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${term}+wedding+photography+portfolio+india&num=8`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <GlobalNav />
      <section className="px-6 py-12 flex flex-col items-center">
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline mb-4">← Dashboard</Link>
        <h1 className="text-4xl font-black text-[#2B5797] mb-8">Photography & Cinema</h1>
      
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {['Candid', 'Traditional', 'Pre-Wedding', 'Cinematic'].map(s => (
          <button key={s} onClick={() => searchPhotography(s)} className="px-4 py-2 border border-blue-300 bg-white rounded-full text-xs font-bold text-blue-600">{s}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {results.map((item: any, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col justify-between hover:shadow-md transition">
            <h3 className="font-bold text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.snippet}</p>
            <a href={item.link} target="_blank" className="py-2 bg-blue-100 text-blue-600 text-center rounded-lg text-xs font-bold">View Portfolio</a>
          </div>
        ))}
      </div>
      </section>
    </main>
  );
}