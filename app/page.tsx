"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import GlobalNav from "@/components/GlobalNav";
import { getAllFavorites } from "@/components/Favorites";

const STAGE_DB = "StageDesignerDB_V2";
const STAGE_STORE = "ProjectGallery";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Fetch recent projects from Stage Designer
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
      } catch (err) {
        console.log("No projects yet");
      }
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

  const navLinks = [
    { href: '/decor/designer', label: 'Stage Designer' },
    { href: '/decor', label: 'Decor Ideas' },
    { href: '/event-shopping', label: 'Shopping' },
    { href: '/catering', label: 'Catering' },
    { href: '/photography', label: 'Photography' },
    { href: '/sangeet', label: 'Sangeet' },
    { href: '/pooja', label: 'Pooja' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <GlobalNav />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-12 md:py-24">
        <Image src="/logo.png" alt="EventEssentials" width={160} height={160} className="mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">EventEssentials</h1>
        <p className="text-gray-600 text-lg mb-8">Plan Your Perfect Event in One Place</p>

        {/* Moved header links (hero nav pills) */}
        <nav className="w-full max-w-4xl mb-6">
          <ul className="flex flex-wrap gap-3 justify-center">
            {navLinks.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold shadow-sm hover:shadow-lg transition text-gray-700">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Single main CTA matching design */}
        <div className="mb-8 w-full max-w-3xl">
          <div className="flex justify-center">
            <Link href="/decor/designer" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold shadow-2xl hover:scale-[1.01] transform transition text-lg">Open Decor Stage Designer</Link>
          </div>
          <div className="text-center mt-3">
            <Link href="#" className="text-sm text-blue-600 underline">Sign Up (Optional)</Link>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <p className="text-gray-500 text-sm font-bold">Stage Designs</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{recentProjects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <p className="text-gray-500 text-sm font-bold">Saved Favorites</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{favorites.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
            <p className="text-gray-500 text-sm font-bold">Planning Tasks</p>
            <p className="text-4xl font-bold text-pink-600 mt-2">{checklist.length}</p>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recent Stage Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((proj) => (
              <Link key={proj.id} href="/decor/designer" className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                <p className="font-bold text-gray-800 mb-2">{proj.projectName}</p>
                <p className="text-xs text-gray-500">{new Date(proj.timestamp).toLocaleDateString()}</p>
                <div className="mt-3 flex gap-2 text-[11px] font-bold">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{proj.widthFt}x{proj.heightFt} ft</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{proj.floorTexture?.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Wedding Planning Checklist */}
      <section className="px-4 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Wedding Planning Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
              <input type="checkbox" defaultChecked={item.completed} className="w-5 h-5 accent-blue-600" />
              <span className="text-gray-700 font-bold flex-1">{item.title}</span>
              <span className="text-xs font-bold text-gray-400">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="px-4 py-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Saved Favorites</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <p className="text-[11px] font-bold text-gray-700 truncate">{fav.title || fav.category}</p>
                {fav.link && (
                  <a href={fav.link} target="_blank" className="text-[10px] text-blue-500 underline mt-1 inline-block">View</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Categories Grid */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">All Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/decor" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-purple-100">
            <p className="text-2xl mb-2">🎨</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-purple-600">Decor Ideas</p>
            <p className="text-sm text-gray-500 mt-2">Explore beautiful decor inspiration</p>
          </Link>
          <Link href="/event-shopping" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-pink-100">
            <p className="text-2xl mb-2">🛍️</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-pink-600">Shopping</p>
            <p className="text-sm text-gray-500 mt-2">Find and purchase event essentials</p>
          </Link>
          <Link href="/catering" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-orange-100">
            <p className="text-2xl mb-2">🍽️</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-orange-600">Catering</p>
            <p className="text-sm text-gray-500 mt-2">Book catering and menu services</p>
          </Link>
          <Link href="/photography" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-blue-100">
            <p className="text-2xl mb-2">📸</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-blue-600">Photography</p>
            <p className="text-sm text-gray-500 mt-2">Capture your special moments</p>
          </Link>
          <Link href="/sangeet" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-green-100">
            <p className="text-2xl mb-2">🎵</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-green-600">Sangeet</p>
            <p className="text-sm text-gray-500 mt-2">Music and dance planning</p>
          </Link>
          <Link href="/pooja" className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition border border-red-100">
            <p className="text-2xl mb-2">🙏</p>
            <p className="font-bold text-lg text-gray-800 group-hover:text-red-600">Pooja</p>
            <p className="text-sm text-gray-500 mt-2">Spiritual ceremony guidance</p>
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 py-12 text-center max-w-6xl mx-auto">
        <button
          onClick={() => setShowSignup(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-lg hover:shadow-lg transition"
        >
          Save My Plans - Sign Up Now
        </button>
      </section>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full">
            <button onClick={() => setShowSignup(false)} className="float-right text-gray-400 text-2xl">✕</button>
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Save Your Plans</h2>
            <form className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg outline-none" required />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg outline-none" required />
              <button type="button" onClick={() => setShowSignup(false)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Continue</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}