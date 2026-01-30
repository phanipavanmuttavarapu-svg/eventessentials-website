"use client";
import Image from "next/image";

export default function Pooja() {
  const poojaItems = ["Ganapathi Pooja Kit", "Flowers & Garlands", "Homa Samagri", "Traditional Decor", "Pandit Services", "Prasadam Catering"];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-6 py-12 flex flex-col items-center">
      <title>Pooja & Rituals | EventEssentials</title>
      <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-6" />
      <h1 className="text-4xl font-black text-[#2B5797] mb-4">Pooja & Rituals</h1>
      
      <div className="w-full max-w-2xl mt-10 space-y-4">
        {poojaItems.map((item) => (
          <div key={item} className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border-l-4 border-yellow-400">
            <span className="font-semibold text-gray-700">{item}</span>
            <button className="text-xs bg-yellow-400 px-4 py-2 rounded-full font-bold hover:shadow-lg transition">Book Arrangement</button>
          </div>
        ))}
      </div>
    </main>
  );
}