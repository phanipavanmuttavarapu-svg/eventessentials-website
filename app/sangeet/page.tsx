"use client";
import Image from "next/image";
import Link from "next/link";

export default function Sangeet() {
  const services = [
    { name: "Choreography", desc: "Expert trainers for group and solo dances." },
    { name: "Live Orchestra", desc: "Bands and singers for traditional melodies." },
    { name: "Sound & DJ Setup", desc: "Top-tier audio and visual entertainment." },
    { name: "Celebrity Bookings", desc: "Bring stars to your celebration." }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 px-6 py-12 flex flex-col items-center">
      <title>Sangeet</title>
      <Link href="/"><Image src="/logo.png" alt="Home" width={120} height={120} className="mb-6 cursor-pointer" /></Link>
      <h1 className="text-4xl font-black text-[#2B5797] mb-4">Sangeet & Entertainment</h1>
      
      <div className="w-full max-w-3xl grid gap-4 mt-8">
        {services.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border-l-8 border-green-400">
            <div>
              <span className="font-bold text-gray-700 block">{item.name}</span>
              <span className="text-xs text-gray-400">{item.desc}</span>
            </div>
            <a href="https://wa.me/919666265166" className="px-6 py-2 bg-green-400 text-white rounded-full font-bold shadow-md">Get Quotes</a>
          </div>
        ))}
      </div>
    </main>
  );
}