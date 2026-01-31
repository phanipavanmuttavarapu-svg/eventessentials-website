import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-6 py-20 flex flex-col items-center text-center">
      <title>About Us</title>
      <Link href="/">
        <Image src="/logo.png" alt="Home" width={120} height={120} className="mb-10 cursor-pointer" />
      </Link>
      <h1 className="text-5xl font-black text-[#2B5797] mb-8">About EventEssentials</h1>

      <div className="max-w-3xl bg-white p-10 rounded-3xl shadow-xl border border-blue-100">
        <p className="text-gray-600 leading-relaxed text-lg text-left">
          EventEssentials is a technology-driven platform built to simplify
          event planning and stage designing for all kinds of celebrations.
          <br /><br />
          From decor visualization and event shopping to catering and ritual
          arrangements, we help users plan events with clarity, creativity
          and confidence.
          <br /><br />
          Our goal is to make event design accessible, visual and customizable
          — <strong>before you spend a single rupee.</strong>
        </p>
      </div>
    </main>
  );
}