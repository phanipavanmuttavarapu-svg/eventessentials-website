"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Decor() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Environment variables with NEXT_PUBLIC_ prefix for Vercel
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const CX = process.env.NEXT_PUBLIC_GOOGLE_CX || "";

  const searchImages = async () => {
    // Alert if keys are missing on the live site
    if (!API_KEY || !CX) {
      alert("Search is currently unavailable. Please check Vercel Environment Variables.");
      return;
    }
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&searchType=image&num=8`
      );
      const data = await response.json();
      
      if (data.error) {
        console.error("Google API Error:", data.error.message);
        alert(`Search Error: ${data.error.message}`);
      } else {
        setImages(data.items || []);
      }
    } catch (error) {
      console.error("Search failed", error);
    }
    setLoading(false);
  };

  const addToDesigner = (imgUrl: string) => {
    const existing = JSON.parse(localStorage.getItem("designer_imports") || "[]");
    localStorage.setItem("designer_imports", JSON.stringify([...existing, imgUrl]));
    alert("Image added to Designer Library!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 px-6 py-12 flex flex-col items-center">
      <title>Event Decor | EventEssentials</title>
      
      {/* Go to Home feature: Logo wrapped in Link */}
      <Link href="/">
        <Image 
          src="/logo.png" 
          alt="Home" 
          width={100} 
          height={100} 
          className="mb-6 cursor-pointer hover:scale-105 transition" 
        />
      </Link>
      
      <h1 className="text-4xl font-black text-[#2B5797] mb-2 text-center">Decor Inspiration</h1>
      
      <div className="w-full max-w-2xl flex gap-2 my-8">
        <input 
          type="text" 
          placeholder="Search e.g., Wedding Stage Marigold..." 
          className="flex-1 px-5 py-3 rounded-full border-2 border-purple-200 focus:border-purple-500 outline-none shadow-sm text-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchImages()}
        />
        <button onClick={searchImages} className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition">
          {loading ? "..." : "Search"}
        </button>
      </div>

      <a href="/decor/designer" className="mb-10 text-purple-600 font-bold hover:underline flex items-center gap-2">
        Go to Visual Designer →
      </a>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {images.map((img: any, index) => (
          <div key={index} className="bg-white p-2 rounded-2xl shadow-md border border-purple-100 group overflow-hidden">
            <div className="relative aspect-square mb-3">
              <img src={img.link} alt="decor" className="w-full h-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                <button onClick={() => addToDesigner(img.link)} className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-xs">
                  Use in Designer
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 truncate px-2">{img.title}</p>
          </div>
        ))}
      </div>
    </main>
  );
}