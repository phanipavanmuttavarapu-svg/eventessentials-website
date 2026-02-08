"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * EVENT ESSENTIALS - FINAL CONSOLIDATED BRANDING
 * Features:
 * - Restored Budget Management (Total Edit + Expense List)
 * - Gold Taglines for Services
 * - Header Mini-Summary & Manual Save
 * - Mobile Responsive UI
 */

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(1000000);
  const [expenses, setExpenses] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [showInvitePreview, setShowInvitePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState("SAVE PLAN");

  // Real-Time Analytics
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const budgetRemaining = totalBudget - totalSpent;
  const progress = useMemo(() => tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0, [tasks]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("event_tasks") || "[]"));
    setEventDate(localStorage.getItem("event_date") || "");
    setTotalBudget(Number(localStorage.getItem("event_budget") || 1000000));
    setExpenses(JSON.parse(localStorage.getItem("event_expenses") || "[]"));
    setNotes(localStorage.getItem("event_notes") || "");
  }, []);

  useEffect(() => {
    localStorage.setItem("event_tasks", JSON.stringify(tasks));
    localStorage.setItem("event_budget", totalBudget.toString());
    localStorage.setItem("event_expenses", JSON.stringify(expenses));
    localStorage.setItem("event_notes", notes);
    
    if (eventDate) {
      localStorage.setItem("event_date", eventDate);
      const days = Math.ceil((new Date(eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(days >= 0 ? days : 0);
    }
  }, [tasks, totalBudget, expenses, eventDate, notes]);

  const downloadPDFPlan = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.text("Event Essentials Plan", 20, 20);
      doc.text(`Budget Remaining: Rs. ${budgetRemaining.toLocaleString()}`, 20, 30);
      doc.save("Event_Plan.pdf");
    } catch (e) {
      alert("PDF Module not found. Please run 'npm install jspdf'");
    }
  };

  const handleManualSave = () => {
    setSaveStatus("SAVING...");
    setTimeout(() => {
      setSaveStatus("SAVED! ✓");
      setTimeout(() => setSaveStatus("SAVE PLAN"), 2000);
    }, 800);
  };

  const services = [
    { title: "Stage Design", tagline: "Visualize custom stages", icon: "🏗️" },
    { title: "Invitation Maker", tagline: "Digital invitations", icon: "✉️" },
    { title: "Decor Ideas", tagline: "Explore inspiration", icon: "🎨" },
    { title: "Shopping", tagline: "Purchase essentials", icon: "🛍️" },
    { title: "Catering", tagline: "Book menu services", icon: "🍽️" },
    { title: "Photography", tagline: "Capture moments", icon: "📸" },
    { title: "Sangeet", tagline: "Music and dance", icon: "🎵" },
    { title: "Pooja", tagline: "Ceremony guidance", icon: "🙏" }
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-['Montserrat',sans-serif] text-[#1A2B3C] pb-10">
      
      {/* HEADER SECTION */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4">
          
          {/* Logo to the Left of Brand Name */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={55} height={55} className="w-10 h-10 md:w-14 md:h-14" />
            <div className="flex flex-col">
              <h1 className="leading-none flex items-baseline">
                <span className="text-[#C7337B] text-2xl md:text-4xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Event</span>
                <span className="text-[#1A73B5] text-xl md:text-2xl ml-1" style={{ fontFamily: "'Great Vibes', cursive" }}>Essentials</span>
              </h1>
              <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-[#1A2B3C]">Your Partner in Every Celebration</span>
            </div>
          </div>

          {/* Mini Summary */}
          <div className="hidden lg:flex items-center gap-6 px-6 border-l border-r border-gray-100">
            <div className="text-center">
              <p className="text-[7px] font-bold text-gray-500 uppercase">DAYS LEFT</p>
              <p className="text-lg font-black text-[#E8A835]">{daysRemaining ?? '0'}</p>
            </div>
            <div className="text-center min-w-[100px]">
              <p className="text-[7px] font-bold text-gray-500 uppercase">REMAINING</p>
              <p className={`text-lg font-black ${budgetRemaining < 0 ? 'text-red-500' : 'text-[#C7337B]'}`}>₹{budgetRemaining.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[7px] font-bold text-gray-500 uppercase">PROGRESS</p>
              <p className="text-lg font-black text-[#1A73B5]">{progress}%</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setShowInvitePreview(true)} className="text-[9px] font-bold uppercase text-[#1A2B3C] hover:text-[#C7337B] transition-colors">Preview Invite</button>
            <button onClick={downloadPDFPlan} className="hidden md:block px-4 py-2 border-2 border-[#1A73B5] text-[#1A73B5] text-[8px] font-bold rounded-full hover:bg-[#1A73B5] hover:text-white transition-all">DOWNLOAD PDF</button>
            <button onClick={handleManualSave} className="px-4 py-2 border-2 border-[#1A2B3C] text-[#1A2B3C] text-[8px] font-bold rounded-full uppercase hover:bg-[#1A2B3C] hover:text-white transition-all">{saveStatus}</button>
            <button className="px-5 py-2.5 bg-[#1A73B5] text-white text-[8px] font-black rounded-full uppercase shadow-md">SIGN UP</button>
          </div>
        </div>
      </nav>

      {/* SERVICE BUTTONS WITH GOLD TAGLINES */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-2xl text-3xl shadow-sm">{s.icon}</div>
              <div>
                <h3 className="font-bold text-[#1A2B3C] text-sm">{s.title}</h3>
                <p className="text-[11px] text-[#E8A835] font-semibold">{s.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN WORKSPACE GRID */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Task Management */}
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#1A2B3C] mb-6">TASK MANAGEMENT</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(newTaskText) { setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]); setNewTaskText(""); } }} className="flex gap-4 mb-8">
            <input type="text" placeholder="ADD EVENT MILESTONE..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#1A73B5]/20" />
            <button className="bg-[#1A73B5] text-white px-8 rounded-2xl font-black shadow-lg hover:bg-[#1A2B3C] transition-colors">+</button>
          </form>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={task.completed} onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} className="w-5 h-5 accent-[#1A73B5] mr-4 cursor-pointer" />
                <span className={`text-[12px] font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-[#1A2B3C]'}`}>{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financials & Journal */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Budget Control Restoration */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#C7337B] font-black uppercase tracking-widest text-[10px]">FINANCIALS</h3>
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${budgetRemaining < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                ₹{budgetRemaining.toLocaleString()} Left
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">TOTAL BUDGET</p>
                <div className="flex items-center text-[#1A73B5] font-black text-xl">
                  <span className="mr-2 opacity-30">₹</span>
                  <input type="number" value={totalBudget || ""} onChange={(e) => setTotalBudget(Number(e.target.value))} className="bg-transparent w-full outline-none" />
                </div>
              </div>

              <div className="flex gap-2">
                <input type="text" placeholder="EXPENSE NAME" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none" />
                <input type="number" placeholder="₹" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-20 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none" />
                <button onClick={() => { if(newExpenseName && newExpenseAmount) { setExpenses([...expenses, { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }]); setNewExpenseName(""); setNewExpenseAmount(""); }}} className="bg-[#E8A835] text-white px-4 rounded-xl font-bold active:scale-90 transition-transform">+</button>
              </div>

              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                {expenses.map(exp => (
                  <div key={exp.id} className="flex justify-between items-center p-3 bg-[#FDFDFD] border border-gray-50 rounded-xl text-[10px] font-bold">
                    <span className="text-gray-500 uppercase">{exp.name}</span>
                    <span className="text-[#C7337B]">₹{exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#1A2B3C] p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="font-bold uppercase tracking-[0.4em] text-[10px] text-[#E8A835] mb-4">CREATIVE JOURNAL</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="DRAFT THEMES & IDEAS..." className="w-full h-40 bg-transparent border-none outline-none resize-none text-[12px] leading-loose placeholder:text-white/10 italic" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 py-12 bg-white border-t border-gray-100 text-center">
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em]">© 2026 EVENT ESSENTIALS • ALL RIGHTS RESERVED</p>
      </footer>

      {/* PREVIEW MODAL */}
      {showInvitePreview && (
        <div className="fixed inset-0 bg-[#1A2B3C]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] p-12 text-center max-w-sm shadow-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Digital Suite Preview</h4>
            <div className="border-4 border-dashed border-gray-100 p-8 mb-8 rounded-[2rem] bg-gray-50">
              <p className="text-5xl font-serif text-[#C7337B]" style={{ fontFamily: "'Great Vibes', cursive" }}>The Wedding</p>
              <p className="text-sm mt-4 text-[#1A73B5] font-bold uppercase tracking-widest">{eventDate || "DATE NOT SET"}</p>
            </div>
            <button onClick={() => setShowInvitePreview(false)} className="w-full py-4 bg-[#1A2B3C] text-white rounded-full font-bold text-[10px] uppercase tracking-widest">CLOSE PREVIEW</button>
          </div>
        </div>
      )}
    </main>
  );
}