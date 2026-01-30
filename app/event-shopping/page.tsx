"use client";
import Image from "next/image";

export default function Shopping() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 px-6 py-12 flex flex-col items-center">
      <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-6" />
      <h1 className="text-4xl font-black text-[#2B5797] mb-4">Shop the Essentials</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl mt-10">
        {['Backdrops', 'Lighting', 'Flower Props', 'Sofas'].map((item) => (
          <div key={item} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 hover:shadow-md transition">
            <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
            <h3 className="font-bold text-gray-800">{item}</h3>
            <p className="text-sm text-pink-500 font-bold">$29.99 / Day</p>
            <button className="w-full mt-3 py-2 bg-pink-100 text-pink-600 rounded-lg text-xs font-bold">Add to Cart</button>
          </div>
        ))}
      </div>
    </main>
  );
}