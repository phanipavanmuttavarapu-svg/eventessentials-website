"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";

export default function Catering() {
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const CX = process.env.NEXT_PUBLIC_GOOGLE_CX || "";

  const searchCatering = async () => {
    if (!city) return;
    if (!API_KEY || !CX) {
      alert("Search keys not detected. Please verify Vercel settings.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=best+catering+services+in+${encodeURIComponent(city)}&num=6`
      );
      const data = await response.json();
      
      if (data.error) {
        alert(`Catering Search Error: ${data.error.message}`);
      } else {
        setResults(data.items || []);
      }
    } catch (error) {
      console.error("Catering search failed", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <GlobalNav />
      <section className="px-6 py-12 flex flex-col items-center">
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline mb-4">← Dashboard</Link>
        <h1 className="text-4xl font-black text-[#2B5797] mb-8">Find Local Catering</h1>
      
      <div className="w-full max-w-md flex gap-2 mb-12">
        <input 
          type="text" 
          placeholder="Enter your city (e.g. Hyderabad)" 
          className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-500 shadow-sm text-gray-800"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchCatering()}
        />
        <button onClick={searchCatering} className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
          {loading ? "..." : "Search"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl text-left text-gray-800">
        {results.map((item: any, index) => (
          <div key={index} className="p-6 bg-white rounded-2xl shadow-md border border-orange-100 hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{item.snippet}</p>
            </div>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold text-sm hover:underline">
              View Details →
            </a>
          </div>
        ))}
      </div>
      </section>
    </main>
  );
}