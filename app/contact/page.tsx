import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 py-20 flex flex-col items-center text-center">
      <title>Contact Us</title>
      <Link href="/">
        <Image src="/logo.png" alt="Home" width={100} height={100} className="mb-10 cursor-pointer" />
      </Link>
      <h1 className="text-4xl font-black text-[#2B5797] mb-8">Get In Touch</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
           <span className="text-blue-600 text-3xl mb-4">📧</span>
           <h3 className="font-bold text-xl mb-2 text-gray-800">Email Us</h3>
           <p className="text-gray-600">info@eventessentials.co.in</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
           <span className="text-green-600 text-3xl mb-4">📞</span>
           <h3 className="font-bold text-xl mb-2 text-gray-800">Call Us</h3>
           <p className="text-gray-600">+91 96662 65166</p>
        </div>
      </div>
    </main>
  );
}