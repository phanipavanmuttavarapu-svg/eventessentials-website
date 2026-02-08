"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TEMPLATES = [
  { id: 1, name: "Royal Wedding", color: "bg-amber-50", border: "border-amber-200", text: "text-amber-900" },
  { id: 2, name: "Modern Minimal", color: "bg-white", border: "border-gray-200", text: "text-gray-800" },
  { id: 3, name: "Floral Celebration", color: "bg-pink-50", border: "border-pink-200", text: "text-pink-900" },
];

export default function InvitationMaker() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [activeTab, setActiveTab] = useState("design"); // 'design' or 'guests'
  const [details, setDetails] = useState({
    title: "Wedding Invitation",
    names: "Bride Groom & Bride",
    date: "Date & Time",
    venue: "Venue Address",
    message: "Message or Quote goes here"
  });

  const [guests, setGuests] = useState([
    { id: 1, name: "Amit Sharma", email: "amit@example.com", status: "Confirmed" },
    { id: 2, name: "Sneha Kapoor", email: "sneha@example.com", status: "Pending" },
  ]);

  const [newGuest, setNewGuest] = useState({ name: "", email: "" });

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const addGuest = () => {
    if (newGuest.name && newGuest.email) {
      setGuests([...guests, { id: Date.now(), ...newGuest, status: "Pending" }]);
      setNewGuest({ name: "", email: "" });
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans relative">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
        <Link href="/" className="text-sm font-bold text-gray-500 hover:text-[#2B63E1] transition-colors flex items-center gap-2">
          <span>←</span> Back to Dashboard
        </Link>
        <div className="flex bg-gray-100 p-1 rounded-full">
          <button 
            onClick={() => setActiveTab("design")}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'design' ? 'bg-white text-[#2B63E1] shadow-sm' : 'text-gray-500'}`}
          >
            Design
          </button>
          <button 
            onClick={() => setActiveTab("guests")}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'guests' ? 'bg-white text-[#2B63E1] shadow-sm' : 'text-gray-500'}`}
          >
            Guest List
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {activeTab === "design" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Editor Side */}
            <section className="space-y-8">
              <div>
                <h1 className="text-4xl font-black text-[#2B63E1] mb-2">Invitation Maker</h1>
                <p className="text-gray-500 font-medium">Customize your digital card details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Theme</label>
                  <div className="flex gap-3 mt-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-bold border-2 transition-all ${
                          selectedTemplate.id === t.id ? "border-[#2B63E1] text-[#2B63E1] bg-blue-50" : "border-gray-50 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <input name="title" value={details.title} onChange={handleDetailsChange} placeholder="Event Title" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#2B63E1]/10 font-medium" />
                  <input name="names" value={details.names} onChange={handleDetailsChange} placeholder="Names" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#2B63E1]/10 font-medium" />
                  <input name="date" value={details.date} onChange={handleDetailsChange} placeholder="Date & Time" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#2B63E1]/10 font-medium" />
                  <input name="venue" value={details.venue} onChange={handleDetailsChange} placeholder="Venue" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#2B63E1]/10 font-medium" />
                  <textarea name="message" value={details.message} onChange={handleDetailsChange} placeholder="Message" rows={3} className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#2B63E1]/10 font-medium" />
                </div>

                <button className="w-full py-5 bg-[#2B63E1] text-white rounded-2xl font-bold shadow-xl hover:scale-[1.01] transition-all">
                  Generate & Download PNG
                </button>
              </div>
            </section>

            {/* Preview Side */}
            <section className="bg-gray-50 rounded-[3rem] p-12 flex items-center justify-center border border-gray-100">
               <div className={`w-full max-w-sm aspect-[3/4.5] p-10 rounded-2xl shadow-2xl border-[12px] ${selectedTemplate.border} ${selectedTemplate.color} flex flex-col items-center text-center relative`}>
                  <div className="w-12 h-12 mb-8 opacity-20"><Image src="/logo.png" alt="logo" width={48} height={48} /></div>
                  <h3 className={`text-xs font-bold uppercase tracking-[0.3em] mb-6 ${selectedTemplate.text}`}>{details.title}</h3>
                  <p className={`text-4xl font-serif mb-8 ${selectedTemplate.text}`}>{details.names}</p>
                  <div className="space-y-2 mb-10">
                    <p className={`text-sm font-bold ${selectedTemplate.text}`}>{details.date}</p>
                    <p className={`text-xs font-medium opacity-70 ${selectedTemplate.text}`}>{details.venue}</p>
                  </div>
                  <p className={`text-[10px] leading-relaxed italic ${selectedTemplate.text} opacity-60 px-4`}>"{details.message}"</p>
               </div>
            </section>
          </div>
        ) : (
          /* Guest List Manager UI */
          <section className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-[#2B63E1] mb-2">Guest List Manager</h1>
              <p className="text-gray-500 font-medium">Keep track of your invitees and RSVPs</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
              <div className="flex gap-4">
                <input 
                  type="text" placeholder="Guest Name" 
                  className="flex-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-medium"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                />
                <input 
                  type="email" placeholder="Email Address" 
                  className="flex-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-medium"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                />
                <button onClick={addGuest} className="px-8 py-4 bg-[#2B63E1] text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
                  Add Guest
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {guests.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-50 shadow-sm">
                  <div>
                    <p className="font-bold text-gray-800">{guest.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{guest.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      guest.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {guest.status}
                    </span>
                    <button className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}