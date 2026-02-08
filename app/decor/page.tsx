"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import { FavoriteButton } from "@/components/Favorites";
import { unifiedSearchAction } from "../actions"; 

export default function Decor() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  const searchImages = async () => {
    if (!query) return;
    setLoading(true);
    setErrorMessage("");
    try {
      // Your specific Data Store ID
      const dataStoreId = 'eventessentials-search-data_1770226189786';
      let data = await unifiedSearchAction(query, dataStoreId, true);

      // Fallback: if server action returned empty and public Google keys exist, use Custom Search API client-side
      if (( !data || data.length === 0 ) && process.env.NEXT_PUBLIC_GOOGLE_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_CX) {
        try {
          const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
          const cx = process.env.NEXT_PUBLIC_GOOGLE_CX;
          const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=8`);
          const json = await res.json();
          data = (json.items || []).map((i: any) => ({
            title: i.title || i.snippet || '',
            link: i.image?.contextLink || i.link || i.displayLink || '#',
            image: i.link || (i.image && i.image.thumbnailLink) || (i.pagemap?.cse_image?.[0]?.src) || null,
            snippet: i.snippet || ''
          }));
        } catch (e) {
          console.warn('Client-side Google CSE fallback failed', e);
        }
      }

      setResults(data || []);
      setErrorMessage("");
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
      setErrorMessage("Search failed. Server error or credentials issue — try a manual URL or sample images below.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <GlobalNav />
      
      <section className="px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-xl mb-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2B5797]">Decor Inspiration</h1>
          <Link href="/" className="text-xs font-bold text-blue-600 hover:underline">← Dashboard</Link>
        </div>
      
      <div className="w-full max-w-xl flex flex-col sm:flex-row gap-2 mb-10">
        <input 
          className="flex-1 p-3 border rounded-full text-black outline-none border-purple-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search wedding decor..."
          onKeyDown={(e) => e.key === 'Enter' && searchImages()}
        />
        <button onClick={searchImages} className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-full font-bold">
          {loading ? "..." : "Search"}
        </button>
      </div>
      {errorMessage && (
        <div className="max-w-xl w-full mb-6 text-sm text-red-600 font-bold">{errorMessage}</div>
      )}

      <div className="max-w-xl w-full mb-6">
        <label className="text-sm font-bold text-gray-600">Or paste an image URL to use in Stage</label>
        <div className="flex gap-2 mt-2">
          <input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="https://...jpg" className="flex-1 p-2 border rounded-md" />
          <button onClick={() => {
            if (!manualUrl) return alert('Enter an image URL first');
            try {
              window.dispatchEvent(new CustomEvent('decor:imageSelected', { detail: { src: manualUrl } }));
            } catch (err) { console.error(err); }
          }} className="bg-green-600 text-white px-4 py-2 rounded-md font-bold">Use URL</button>
        </div>
        <div className="text-[12px] text-gray-500 mt-2">Tip: If remote fetch fails due to CORS, open the image in a new tab and save then upload in Stage.</div>
      </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl">
        {results.map((item, index) => (
          <div key={index} className="border p-2 rounded-xl shadow-sm hover:shadow-md transition relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
              {item.image ? (
                <img src={item.image} className="w-full h-full object-cover" alt="Decor" />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
              )}
            </div>
            <p className="text-xs font-bold truncate pr-6">{item.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <a href={item.link} target="_blank" className="text-[10px] text-blue-500 underline">Source</a>
              {item.image && (
                <button
                  onClick={() => {
                    try {
                      window.dispatchEvent(new CustomEvent('decor:imageSelected', { detail: { src: item.image } }));
                    } catch (err) {
                      console.error('Event dispatch failed', err);
                    }
                  }}
                  className="ml-auto bg-green-600 text-white text-[11px] px-3 py-1 rounded-full font-bold"
                >
                  Use in Stage
                </button>
              )}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <FavoriteButton id={`decor-${index}`} category="decor" title={item.title} link={item.link} src={item.image} />
            </div>
          </div>
        ))}
      </div>

      {/* Fallback sample images when search fails or empty */}
      {results.length === 0 && (
        <section className="w-full max-w-6xl mt-8">
          <h2 className="text-lg font-bold mb-4">Sample Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['/samples/sample1.jpg','/samples/sample2.jpg','/samples/sample3.jpg','/samples/sample4.jpg'].map((s) => (
              <div key={s} className="border p-2 rounded-xl">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img src={s} className="w-full h-full object-cover" />
                </div>
                <div className="flex">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('decor:imageSelected', { detail: { src: s } }))} className="ml-auto bg-green-600 text-white px-3 py-1 rounded-full font-bold">Use in Stage</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}