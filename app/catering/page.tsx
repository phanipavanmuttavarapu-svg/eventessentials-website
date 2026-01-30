"use client";
import Image from "next/image";
import { useState } from "react";

export default function Catering() {
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const CX = process.env.NEXT_PUBLIC_GOOGLE_CX || "";

  const searchCatering = async () => {
    if (!city || !API_KEY || !CX) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=best+catering+services+in+${city}&num=6`
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Catering search failed", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-6 py-12 flex flex-col items-center">
      <title>Catering | EventEssentials</title>
      <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-6" />
      <h1 className="text-4xl font-black text-[#2B5797] mb-4">Find Local Catering</h1>
      <p className="text-gray-600 max-w-2xl text-center mb-8 italic">
        Delicious menus and buffet setups for your celebration in {city || 'your city'}.
      </p>

      <div className="w-full max-w-md flex gap-2 mb-12">
        <input 
          type="text" 
          placeholder="Enter your city (e.g. Hyderabad)" 
          className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-full focus:outline-none focus:border-orange-500 shadow-sm"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchCatering()}
        />
        <button 
          onClick={searchCatering}
          disabled={!API_KEY || !CX}
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl text-left">
        {results.map((item: any, index) => (
          <div key={index} className="p-6 bg-white rounded-2xl shadow-md border border-orange-100 hover:shadow-xl transition flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{item.snippet}</p>
            </div>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 font-bold text-sm hover:underline mt-2 flex items-center gap-1">
              View Details →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}