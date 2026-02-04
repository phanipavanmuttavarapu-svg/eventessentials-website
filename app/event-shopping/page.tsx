"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { unifiedSearchAction } from "../actions"; 

export default function Shopping() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchShopping = async (category: string) => {
    const term = category || query;
    if (!term) return;

    setLoading(true);
    try {
      // Updated with your actual Data Store ID
      const fullQuery = `${term} wedding shopping india`;
      const data = await unifiedSearchAction(fullQuery, 'eventessentials-search-data_1770226189786', false);
      setResults(data);
    } catch (e) { 
      console.error(e); 
      alert("System Error: Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 px-6 py-12 flex flex-col items-center text-center font-[family-name:var(--font-montserrat)]">
      <title>Event Shopping | EventEssentials</title>
      <Link href="/">
        <Image src="/logo.png" alt="Home" width={120} height={120} className="mb-6 cursor-pointer hover:scale-105 transition" />
      </Link>
      <h1 className="text-4xl font-black text-[#2B5797] mb-8">Shop the Essentials</h1>
      
      <div className="flex gap-3 flex-wrap justify-center mb-8">
        {['Wedding Wear', 'Jewellery', 'Return Gifts', 'Props'].map((cat) => (
          <button key={cat} onClick={() => searchShopping(cat)} className="px-4 py-2 bg-white border border-pink-200 rounded-full text-xs font-bold text-pink-600 hover:bg-pink-50">{cat}</button>
        ))}
      </div>

      <div className="w-full max-w-md flex gap-2 mb-12">
        <input type="text" placeholder="Search for items..." className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-full outline-none text-gray-800" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchShopping("")} />
        <button onClick={() => searchShopping("")} className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg">{loading ? "..." : "Search"}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl text-left">
        {results.map((item: any, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition">
            <h3 className="font-bold text-gray-800 text-sm mb-2 leading-tight">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.snippet}</p>
            <a href={item.link} target="_blank" className="w-full py-2 bg-pink-100 text-pink-600 text-center rounded-lg text-xs font-bold">Shop Now</a>
          </div>
        ))}
      </div>
    </main>
  );
}