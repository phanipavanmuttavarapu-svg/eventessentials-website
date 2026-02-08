"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllFavorites } from "@/components/Favorites";

const STAGE_DB = "StageDesignerDB_V2";
const STAGE_STORE = "ProjectGallery";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const db: any = await new Promise((resolve, reject) => {
          const request = indexedDB.open(STAGE_DB);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const tx: any = db.transaction(STAGE_STORE, "readonly");
        const req: any = tx.objectStore(STAGE_STORE).getAll();
        req.onsuccess = () => {
          const projects: any[] = req.result || [];
          const sorted = projects.sort((a: any, b: any) => (b?.timestamp || 0) - (a?.timestamp || 0)).slice(0, 3);
          setRecentProjects(sorted);
        };
      } catch (err) { console.log("No projects yet"); }
    };

    const fetchFavorites = async () => {
      const favs = await getAllFavorites();
      setFavorites(favs.slice(0, 6));
    };

    fetchProjects();
    fetchFavorites();
  }, []);

  const checklist = [
    { id: 1, title: "Book Venue", completed: false },
    { id: 2, title: "Decor Planning", completed: false },
    { id: 3, title: "Catering & Menu", completed: false },
    { id: 4, title: "Photography & Videography", completed: false },
    { id: 5, title: "Music & Entertainment", completed: false },
    { id: 6, title: "Invitations", completed: false },
  ];

  return (
    <main className="min-h-screen bg-white font-sans relative">
      {/* Top Navigation Utilities */}
      <div className="flex justify-end items-center gap-6 px-8 py-6">
        <button 
          onClick={() => setShowRecent(!showRecent)}
          className="text-sm font-bold text-gray-500 hover:text-[#2B63E1] transition-colors"
        >
          {showRecent ? "Hide Recent Designs" : "Recent Designs"}
        </button>
        <button 
          onClick={() => setShowSignup(true)}
          className="px-6 py-2 bg-[#2B63E1] text-white text-sm font-bold rounded-full shadow-md hover:bg-blue-700 transition-all"
        >
          Sign Up
        </button>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-2 pb-10">
        <Image 
          src="/logo.png" 
          alt="EventEssentials Logo" 
          width={140} 
          height={140} 
          className="mb-4"
        />
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#2B63E1] tracking-tight mb-2">
          EventEssentials
        </h1>
        <p className="text-[#4A4A4A] text-xl font-medium">
          Plan Your Perfect Event in One Place
        </p>
      </section>

      {/* All Services Grid */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
          All Services
          <div className="h-px flex-1 bg-gray-100 ml-4"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Decor Ideas", desc: "Explore beautiful decor inspiration", icon: "🎨", href: "/decor" },
            { title: "Shopping", desc: "Find and purchase event essentials", icon: "🛍️", href: "/event-shopping" },
            { title: "Catering", desc: "Book catering and menu services", icon: "🍽️", href: "/catering" },
            { title: "Photography", desc: "Capture your special moments", icon: "📸", href: "/photography" },
            { title: "Sangeet", desc: "Music and dance planning", icon: "🎵", href: "/sangeet" },
            { title: "Pooja", desc: "Spiritual ceremony guidance", icon: "🙏", href: "/pooja" }
          ].map((service) => (
            <Link key={service.title} href={service.href} className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#2B63E1]/20 transition-all duration-300">
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{service.icon}</span>
              <h3 className="font-bold text-xl mt-4 text-gray-800 group-hover:text-[#2B63E1] transition-colors">{service.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{service.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="px-6 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Stage Designs</p>
            <p className="text-5xl font-black text-[#2B63E1] mt-2">{recentProjects.length || 1}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Saved Favorites</p>
            <p className="text-5xl font-black text-purple-600 mt-2">{favorites.length}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Planning Tasks</p>
            <p className="text-5xl font-black text-pink-500 mt-2">{checklist.length}</p>
          </div>
        </div>
      </section>

      {/* Toggleable Recent Designs Section */}
      {showRecent && (
        <section className="px-6 py-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-top-2">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Stage Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
              <p className="font-bold text-gray-800 text-lg">New Design</p>
              <p className="text-xs text-gray-400 mt-1">2/8/2026</p>
              <div className="mt-4 flex gap-2">
                <span className="bg-blue-50 text-[#2B63E1] px-3 py-1 rounded-lg text-[10px] font-bold">30x15 ft</span>
                <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-bold">Wood</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Planning Checklist */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Wedding Planning Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item) => (
            <div key={item.id} className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <input type="checkbox" className="w-6 h-6 rounded-lg border-gray-300 accent-[#2B63E1] cursor-pointer" />
              <span className="text-gray-700 font-bold flex-1">{item.title}</span>
              <span className="text-gray-300 group-hover:text-[#2B63E1] transition-colors">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding CTA */}
      <section className="px-6 py-20 text-center">
        <button
          onClick={() => setShowSignup(true)}
          className="px-12 py-5 bg-gradient-to-r from-[#2B63E1] to-[#6366F1] text-white font-bold rounded-full text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Save My Plans - Sign Up Now
        </button>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/yournumber"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-[90]"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setShowSignup(false)} className="float-right text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h2 className="text-3xl font-black mb-2 text-[#2B63E1]">Welcome!</h2>
            <p className="text-gray-500 mb-8 font-medium">Create an account to save your event plans.</p>
            <form className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 border border-transparent focus:border-[#2B63E1] rounded-2xl outline-none transition-all font-medium" required />
              <input type="tel" placeholder="Phone Number" className="w-full p-4 bg-gray-50 border border-transparent focus:border-[#2B63E1] rounded-2xl outline-none transition-all font-medium" required />
              <button type="button" onClick={() => setShowSignup(false)} className="w-full py-4 bg-[#2B63E1] text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-4">Continue</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}