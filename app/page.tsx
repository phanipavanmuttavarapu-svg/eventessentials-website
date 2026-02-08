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
  const [showInvitePreview, setShowInvitePreview] = useState(false);
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

    const fetchProjects = async () => {
        try {
          const db: any = await new Promise((res, rej) => {
            const req = indexedDB.open(STAGE_DB);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
          });
          const tx: any = db.transaction(STAGE_STORE, "readonly");
          const req: any = tx.objectStore(STAGE_STORE).getAll();
          req.onsuccess = () => {
            const sorted = (req.result || []).sort((a: any, b: any) => (b?.timestamp || 0) - (a?.timestamp || 0)).slice(0, 3);
            setRecentProjects(sorted);
          };
        } catch (err) { console.log("No projects"); }
      };
      fetchProjects();
      getAllFavorites().then(favs => setFavorites(favs.slice(0, 6)));
  }, []);

  // Save Data & Timer Logic
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

  // Handlers
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
    setNewTaskText("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearAllTasks = () => {
    if (window.confirm("Clear all tasks?")) setTasks([]);
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;
    setExpenses([...expenses, { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const clearAllExpenses = () => {
    if (window.confirm("Clear all expenses?")) setExpenses([]);
  };

  const exportToText = () => {
    const content = `EVENT PLAN: ${eventDate}\nRemaining Budget: ₹${remainingBudget}\nTasks: ${progress}%\n\nNotes:\n${notes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `EventPlan.txt`;
    link.click();
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
      {/* Header Nav */}
      <div className="flex justify-end items-center gap-6 px-8 py-6">
        <button onClick={() => setShowInvitePreview(true)} className="text-sm font-bold text-[#2E86C1] hover:underline">Preview Invite</button>
        <button onClick={exportToText} className="text-sm font-bold text-[#D4AC0D] hover:underline">Download Plan</button>
        <button onClick={() => setShowRecent(!showRecent)} className="text-sm font-bold text-gray-500 hover:text-[#1A5276]">Recent Designs</button>
        <button onClick={() => setShowSignup(true)} className="px-6 py-2 bg-[#1A5276] text-white text-sm font-bold rounded-full shadow-md">Sign Up</button>
      </div>

      {/* Branding */}
      <section className="flex flex-col items-center text-center px-4 pt-4 pb-12">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-4" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
          <span className="text-[#E91E63]">Event</span>
          <span className="text-[#1A5276]">Essentials</span>
          <span className="text-[#D4AC0D] text-3xl md:text-4xl ml-1">.CO.IN</span>
        </h1>
        <p className="text-[#2E86C1] text-xl font-medium italic">Your Partner in every Celebration</p>
      </section>

      {/* Stats */}
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

      {/* Services */}
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

      {/* Main Tools */}
      <section className="px-6 py-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Budget Tracker</h2>
              <button onClick={clearAllExpenses} className="text-xs font-bold text-red-500">Clear All</button>
            </div>
            <input type="number" placeholder="Total Budget" value={totalBudget || ""} onChange={(e) => setTotalBudget(Number(e.target.value))} className="w-full mb-4 p-4 bg-white rounded-2xl outline-none shadow-sm font-bold text-[#1A5276]"/>
            <form onSubmit={addExpense} className="flex gap-2 mb-4">
              <input type="text" placeholder="Item" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 p-3 rounded-xl outline-none shadow-sm"/>
              <input type="number" placeholder="Amt" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-20 p-3 rounded-xl outline-none shadow-sm"/>
              <button type="submit" className="bg-[#1A5276] text-white px-4 rounded-xl font-bold">+</button>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between bg-white p-3 rounded-xl text-sm border border-gray-100 shadow-sm">
                  <span className="text-gray-600 font-medium">{exp.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#E91E63]">₹{exp.amount}</span>
                    <button onClick={() => removeExpense(exp.id)} className="text-gray-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#D4AC0D]/10 p-8 rounded-[2.5rem] border border-[#D4AC0D]/20">
            <h2 className="text-2xl font-bold text-[#D4AC0D] mb-4">Notes & Ideas</h2>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Venue details, vendor contacts..." className="w-full h-48 p-4 bg-white/50 rounded-2xl outline-none resize-none font-medium text-gray-700"/>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Checklist</h2>
            <div className="flex items-center gap-4">
               <button onClick={clearAllTasks} className="text-xs font-bold text-red-500">Clear All</button>
               <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="text-xs font-bold text-[#2E86C1] bg-gray-50 p-2 rounded-lg outline-none"/>
            </div>
          </div>
          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <input type="text" placeholder="Add task..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"/>
            <button type="submit" className="bg-[#E91E63] text-white px-6 rounded-2xl font-bold">+</button>
          </form>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer group hover:bg-white border border-transparent hover:border-gray-100">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-md border-2 mr-4 ${task.completed ? 'bg-[#1A5276] border-[#1A5276]' : 'border-gray-200'}`}>
                    {task.completed && <span className="text-white text-[10px] flex justify-center mt-0.5">✓</span>}
                  </div>
                  <span className={`font-medium ${task.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{task.text}</span>
                </div>
                <button onClick={(e) => removeTask(task.id, e)} className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100">✕</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invitation Preview Modal */}
      {showInvitePreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[3rem] max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-[#E91E63] p-12 text-center text-white relative">
              <button onClick={() => setShowInvitePreview(false)} className="absolute top-6 right-8 text-white/50 hover:text-white">✕</button>
              <h4 className="text-sm font-bold uppercase tracking-[0.3em] mb-4">You are Invited to</h4>
              <p className="text-4xl font-serif italic mb-2">Our Special Celebration</p>
              <div className="h-px w-24 bg-white/30 mx-auto my-6"></div>
              <p className="text-xl font-light">{eventDate || "A Beautiful Day"}</p>
            </div>
            <div className="p-12 text-center space-y-6">
               <p className="text-gray-500 leading-relaxed font-medium">Join us as we celebrate love and life. Your presence would make our event truly complete.</p>
               <div className="pt-6">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Venue</p>
                 <p className="text-[#1A5276] font-bold text-lg">Grand Ballroom, Regency Palace</p>
               </div>
               <button onClick={() => setShowInvitePreview(false)} className="w-full py-4 bg-[#1A5276] text-white rounded-2xl font-bold shadow-lg mt-8 hover:bg-[#E91E63] transition-colors">RSVP Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full animate-in zoom-in-95">
            <button onClick={() => setShowSignup(false)} className="float-right text-gray-400">✕</button>
            <h2 className="text-3xl font-black mb-2 text-[#E91E63]">Join Us!</h2>
            <p className="text-gray-500 mb-8 font-medium">Create your account to save your designs.</p>
            <form className="space-y-4">
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A5276]/20" required />
              <button type="button" onClick={() => setShowSignup(false)} className="w-full py-4 bg-[#1A5276] text-white rounded-2xl font-bold">Get Started</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}