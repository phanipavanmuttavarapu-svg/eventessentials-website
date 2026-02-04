"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Pooja() {
  const [showPremium, setShowPremium] = useState(false);

  const poojaServices = [
    { name: "Ganapathi Pooja", tradition: "Vedic", premium: true },
    { name: "Satyanarayana Vratam", tradition: "Traditional", premium: true },
    { name: "Griha Pravesh", tradition: "Smartha", premium: true },
    { name: "Laxmi Pooja Kit", tradition: "Universal", premium: false }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-6 py-12 flex flex-col items-center">
      <title>Pooja & Rituals | EventEssentials</title>
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-6 hover:opacity-80 transition" />
      </Link>

      <h1 className="text-4xl font-black text-[#2B5797] mb-2">Pooja & Traditions</h1>
      <p className="text-gray-500 mb-10 font-medium">Book Pandits & Learn Ritual Procedures</p>
      
      <div className="w-full max-w-3xl space-y-4">
        {poojaServices.map((service) => (
          <div key={service.name} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border-l-8 border-yellow-400 hover:shadow-md transition">
            <div>
              <span className="font-bold text-gray-800 text-lg block">{service.name}</span>
              <span className="text-xs text-yellow-600 font-bold uppercase tracking-wider">{service.tradition} Tradition</span>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {service.premium && (
                <button 
                  onClick={() => setShowPremium(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  View Ritual Guide (Premium)
                </button>
              )}
              <a href="https://wa.me/919666265166" className="px-4 py-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                Book Pandit
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Ritual Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
             <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">👑</div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Ritual Access</h2>
             <p className="text-gray-500 text-sm mb-6">Unlock step-by-step video guides and traditional procedures for this ritual.</p>
             <button onClick={() => setShowPremium(false)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mb-3">Upgrade to Premium</button>
             <button onClick={() => setShowPremium(false)} className="text-gray-400 text-xs font-bold uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </main>
  );
}