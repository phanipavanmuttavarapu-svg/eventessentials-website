"use client";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        EventEssentials
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        Your partner in every celebration — decor designing,
        event shopping, catering & ritual planning.
      </p>

      {/* Primary Navigation */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        <a href="/decor" className="px-4 py-2 border rounded-full">
          Decor
        </a>
        <a href="/shopping" className="px-4 py-2 border rounded-full">
          Event Shopping
        </a>
        <a href="/catering" className="px-4 py-2 border rounded-full">
          Catering
        </a>
        <a href="/pooja" className="px-4 py-2 border rounded-full">
          Pooja
        </a>
      </div>

      {/* ✅ Decor Designer CTA (NEW – does not affect flow) */}
      <a
        href="/decor/designer"
        className="mb-10 px-6 py-3 rounded-full bg-black text-white hover:opacity-90 transition"
      >
        Open Decor Stage Designer
      </a>

      {/* Secondary Navigation */}
      <div className="flex gap-6 text-sm text-gray-500">
        <a href="/about" className="hover:underline">
          About
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </div>
    </main>
  );
}
