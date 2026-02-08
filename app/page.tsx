"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllFavorites } from "@/components/Favorites";

const STAGE_DB = "StageDesignerDB_V2";
const STAGE_STORE = "ProjectGallery";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  
  // State Management
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const [notes, setNotes] = useState("");

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  // Load Data
  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("event_tasks") || "[]"));
    setEventDate(localStorage.getItem("event_date") || "");
    setTotalBudget(Number(localStorage.getItem("event_budget") || 0));
    setExpenses(JSON.parse(localStorage.getItem("event_expenses") || "[]"));
    setNotes(localStorage.getItem("event_notes") || "");
  }, []);

  // Save Data
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

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
    setNewTaskText("");
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;
    setExpenses([...expenses, { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const services = [
    { title: "Stage Design", desc: "Visualize custom stages", icon: "🏗️", href: "/decor/designer" },
    { title: "Invitation Maker", desc: "Digital invitations", icon: "✉️", href: "/invitations" },
    { title: "Decor Ideas", desc: "Explore inspiration", icon: "🎨", href: "/decor" },
    { title: "Shopping", desc: "Purchase essentials", icon: "🛍️", href: "/event-shopping" },
    { title: "Catering", desc: "Book menu services", icon: "🍽️", href: "/catering" },
    { title: "Photography", desc: "Capture moments", icon: "📸", href: "/photography" },
    { title: "Sangeet", desc: "Music and dance", icon: "🎵", href: "/sangeet" },
    { title: "Pooja", desc: "Ceremony guidance", icon: "🙏", href: "/pooja" }
  ];

  return (
    <main className="min-h-screen bg-white font-sans relative pb-20">
      {/* Header */}
      <div className="flex justify-end items-center gap-6 px-8 py-6">
        <button onClick={() => setShowRecent(!showRecent)} className="text-sm font-bold text-gray-500 hover:text-[#1A5276]">
          {showRecent ? "Hide Recent" : "Recent Designs"}
        </button>
        <button onClick={() => setShowSignup(true)} className="px-6 py-2 bg-[#1A5276] text-white text-sm font-bold rounded-full shadow-md">
          Sign Up
        </button>
      </div>

      {/* Hero Branding */}
      <section className="flex flex-col items-center text-center px-4 pt-4 pb-12">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
          <span className="text-[#E91E63]">Event</span>
          <span className="text-[#1A5276]">Essentials</span>
          <span className="text-[#D4AC0D] text-3xl md:text-4xl ml-1">.CO.IN</span>
        </h1>
        <p className="text-[#2E86C1] text-xl font-medium italic">Plan Your Perfect Event in One Place</p>
      </section>

      {/* Stats Dashboard */}
      <section className="px-6 py-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Days Left</p>
          <p className="text-5xl font-black text-[#D4AC0D] mt-2">{daysRemaining ?? "--"}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Budget Remaining</p>
          <p className="text-4xl font-black text-[#E91E63] mt-2">₹{remainingBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Plan Progress</p>
          <p className="text-5xl font-black text-[#1A5276] mt-2">{progress}%</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">All Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-3xl">{service.icon}</span>
              <h3 className="font-bold text-lg mt-4 text-gray-800">{service.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{service.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Planning Tools Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Budget & Notes */}
        <div className="space-y-12">
          {/* Budget Tracker */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Tracker</h2>
            <input 
              type="number" placeholder="Total Budget" value={totalBudget || ""} onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full mb-4 p-4 bg-white rounded-2xl border-none font-bold text-gray-700 outline-none shadow-sm"
            />
            <form onSubmit={addExpense} className="flex gap-2 mb-4">
              <input type="text" placeholder="Item" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 p-3 rounded-xl border-none text-sm outline-none shadow-sm"/>
              <input type="number" placeholder="Amt" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-20 p-3 rounded-xl border-none text-sm outline-none shadow-sm"/>
              <button type="submit" className="bg-[#1A5276] text-white px-4 rounded-xl font-bold">+</button>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between bg-white p-3 rounded-xl text-sm border border-gray-100">
                  <span className="text-gray-600">{exp.name}</span>
                  <span className="font-bold text-[#E91E63]">₹{exp.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-[#D4AC0D]/10 p-8 rounded-[2.5rem] border border-[#D4AC0D]/20">
            <h2 className="text-2xl font-bold text-[#D4AC0D] mb-4">Notes & Ideas</h2>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down venue addresses, vendor phone numbers, or color themes here..."
              className="w-full h-48 p-4 bg-white/50 rounded-2xl border-none outline-none text-gray-700 placeholder:text-gray-400 resize-none font-medium"
            />
          </div>
        </div>

        {/* Right Column: Checklist */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Checklist</h2>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="text-xs font-bold text-[#2E86C1] bg-gray-50 p-2 rounded-lg outline-none"/>
          </div>
          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input type="text" placeholder="Add task..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"/>
            <button type="submit" className="bg-[#E91E63] text-white px-6 rounded-2xl font-bold">+</button>
          </form>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-md border-2 mr-4 ${task.completed ? 'bg-[#1A5276] border-[#1A5276]' : 'border-gray-200'}`}>
                    {task.completed && <span className="text-white text-[10px] flex justify-center mt-0.5">✓</span>}
                  </div>
                  <span className={`font-medium ${task.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{task.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12 text-center">
        <button onClick={() => setShowSignup(true)} className="px-12 py-5 bg-gradient-to-r from-[#1A5276] via-[#E91E63] to-[#D4AC0D] text-white font-bold rounded-full text-lg shadow-xl hover:scale-[1.03] transition-all">
          Secure My Event Plans
        </button>
      </section>
    </main>
  );
}