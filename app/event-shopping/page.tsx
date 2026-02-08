  "use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import { FavoriteButton } from "@/components/Favorites";
import { unifiedSearchAction } from "../actions"; 

export default function Shopping() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchShopping = async (category: string) => {
    const term = category || query;
    if (!term) return;

    setLoading(true);
    setErrorMessage("");
    try {
      // Updated with your actual Data Store ID
      const fullQuery = `${term} wedding shopping india`;
      let data = await unifiedSearchAction(fullQuery, 'eventessentials-search-data_1770226189786', false);

      // Fallback to Google Custom Search (client-side) if server returns empty and public keys exist
      if (( !data || data.length === 0 ) && process.env.NEXT_PUBLIC_GOOGLE_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_CX) {
        try {
          const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
          const cx = process.env.NEXT_PUBLIC_GOOGLE_CX;
          const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(fullQuery)}&num=8`);
          const json = await res.json();
          data = (json.items || []).map((i: any) => ({
            title: i.title,
            link: i.link,
            image: i.pagemap?.cse_image?.[0]?.src || null,
            snippet: i.snippet || ''
          }));
        } catch (e) {
          console.warn('Client-side Google CSE fallback failed', e);
        }
      }

      setResults(data);
      if (!data || data.length === 0) {
        setErrorMessage("No results found. Try a different search term or browse by category.");
      }
    } catch (e) { 
      console.error(e);
      setErrorMessage("Search encountered an issue. Make sure Google Cloud credentials are configured, or try a different search.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <GlobalNav />
      
      <section className="px-6 py-12 flex flex-col items-center">
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline mb-4">← Dashboard</Link>
        <h1 className="text-4xl font-black text-[#2B5797] mb-6">Shop the Essentials</h1>
      
      <div className="flex gap-3 flex-wrap justify-center mb-8">
        {['Wedding Wear', 'Jewellery', 'Return Gifts', 'Props'].map((cat) => (
          <button key={cat} onClick={() => searchShopping(cat)} className="px-4 py-2 bg-white border border-pink-200 rounded-full text-xs font-bold text-pink-600 hover:bg-pink-50">{cat}</button>
        ))}
      </div>

      <div className="w-full max-w-md flex flex-col sm:flex-row gap-2 mb-12">
        <input type="text" placeholder="Search for items..." className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-full outline-none text-gray-800" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchShopping("")} />
        <button onClick={() => searchShopping("")} className="w-full sm:w-auto bg-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">{loading ? "..." : "Search"}</button>
      </div>

      {errorMessage && (
        <div className="max-w-md w-full mb-6 text-sm text-red-600 font-bold">{errorMessage}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl text-left">
        {results.map((item: any, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex flex-col justify-between hover:shadow-md transition relative group">
            <h3 className="font-bold text-gray-800 text-sm mb-2 leading-tight pr-6">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item.snippet}</p>
            <a href={item.link} target="_blank" className="w-full py-2 bg-pink-100 text-pink-600 text-center rounded-lg text-xs font-bold">Shop Now</a>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
              <FavoriteButton id={`shop-${index}`} category="shopping" title={item.title} link={item.link} src={item.image || ''} />
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !errorMessage && (
        <div className="max-w-2xl text-center text-gray-500 mt-8">
          <p className="text-sm font-bold mb-4">👉 Try searching above or browse by category</p>
          <p className="text-xs">Popular: Wedding Wear, Jewellery, Return Gifts, Props</p>
        </div>
      )}
      </section>
    </main>
  );
}