"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [eventName, setEventName] = useState("My Special Event");
  const [eventDate, setEventDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [totalBudget, setTotalBudget] = useState<number>(1000000);
  const [expenses, setExpenses] = useState<{ id: number; name: string; amount: number }[]>([]);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [showInvitePreview, setShowInvitePreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState("SAVE PLAN");
  const [isMounted, setIsMounted] = useState(false);

  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const budgetRemaining = totalBudget - totalSpent;
  const progress = useMemo(() => tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0, [tasks]);

  useEffect(() => {
    setIsMounted(true);
    setTasks(JSON.parse(localStorage.getItem("event_tasks") || "[]"));
    setEventName(localStorage.getItem("event_name") || "My Event");
    setEventDate(localStorage.getItem("event_date") || "");
    setTotalBudget(Number(localStorage.getItem("event_budget") || 1000000));
    setExpenses(JSON.parse(localStorage.getItem("event_expenses") || "[]"));
    setNotes(localStorage.getItem("event_notes") || "");
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("event_tasks", JSON.stringify(tasks));
    localStorage.setItem("event_name", eventName);
    localStorage.setItem("event_budget", totalBudget.toString());
    localStorage.setItem("event_expenses", JSON.stringify(expenses));
    localStorage.setItem("event_notes", notes);
    
    if (eventDate) {
      localStorage.setItem("event_date", eventDate);
      const days = Math.ceil((new Date(eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setDaysRemaining(days >= 0 ? days : 0);
    }
  }, [tasks, totalBudget, expenses, eventDate, notes, eventName, isMounted]);

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const downloadPDFPlan = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const logoUrl = "/logo.png";

      try {
        doc.saveGraphicsState();
        const gState = new (doc as any).GState({ opacity: 0.1 });
        doc.setGState(gState);
        doc.addImage(logoUrl, 'PNG', 55, 100, 100, 100);
        doc.restoreGraphicsState();
      } catch (imgError) {
        console.warn("Logo not found for watermark, skipping image step.");
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(26, 43, 60);
      doc.text(eventName, 20, 30);

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 38);

      doc.setFontSize(14);
      doc.setTextColor(199, 51, 123);
      doc.text(`Budget Remaining: Rs. ${budgetRemaining.toLocaleString('en-IN')}`, 20, 55);

      doc.setTextColor(26, 43, 60);
      doc.text("Task Summary:", 20, 75);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      tasks.slice(0, 20).forEach((task, index) => {
        const status = task.completed ? "[X]" : "[ ]";
        doc.text(`${status} ${task.text}`, 25, 85 + (index * 7));
      });

      doc.save(`${eventName.replace(/\s+/g, '_')}_Plan.pdf`);
    } catch (e) {
      alert("Please ensure 'jspdf' is installed via npm install jspdf");
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
    { title: "Stage Design", tagline: "Visualize custom stages", icon: "🏗️", href: "/decor/designer" },
    { title: "Invitation Maker", tagline: "Digital invitations", icon: "✉️", href: "/invitation" },
    { title: "Decor Ideas", tagline: "Explore inspiration", icon: "🎨", href: "/decor" },
    { title: "Shopping", tagline: "Purchase essentials", icon: "🛍️", href: "/event-shopping" },
    { title: "Catering", tagline: "Book menu services", icon: "🍽️", href: "/catering" },
    { title: "Photography", tagline: "Capture moments", icon: "📸", href: "/photography" },
    { title: "Sangeet", tagline: "Music and dance", icon: "🎵", href: "/sangeet" },
    { title: "Pooja", tagline: "Ceremony guidance", icon: "🙏", href: "/pooja" }
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-['Montserrat',sans-serif] text-[#1A2B3C] pb-10">
      
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4">
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

          <div className="hidden lg:flex flex-col items-center">
            {/* EDITABLE EVENT NAME ABOVE STATS */}
            <div className="mb-1 group relative cursor-pointer" onClick={() => setIsEditingName(true)}>
                {isEditingName ? (
                    <input 
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                        autoFocus
                        className="text-[10px] font-black uppercase tracking-widest text-[#1A2B3C] border-b border-[#1A73B5] outline-none text-center bg-transparent"
                    />
                ) : (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A2B3C] flex items-center gap-2">
                        {eventName} <span className="opacity-0 group-hover:opacity-100 text-[12px] transition-opacity">✎</span>
                    </p>
                )}
            </div>

            <div className="flex items-center gap-6 px-6 border-t border-gray-50 pt-1">
                {/* UPDATABLE DAYS LEFT SECTION */}
                <div className="text-center group relative cursor-pointer min-w-[80px]" onClick={() => setIsEditingDate(true)}>
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    DAYS LEFT <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
                </p>
                {isEditingDate ? (
                    <input 
                    type="date" 
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    onBlur={() => setIsEditingDate(false)}
                    autoFocus
                    className="text-[10px] font-black text-[#E8A835] border-none outline-none bg-gray-50 rounded px-1"
                    />
                ) : (
                    <p className="text-lg font-black text-[#E8A835]">{daysRemaining ?? '0'}</p>
                )}
                </div>

                <div className="text-center min-w-[100px]">
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">REMAINING</p>
                <p className={`text-lg font-black ${budgetRemaining < 0 ? 'text-red-500' : 'text-[#C7337B]'}`}>
                    ₹{isMounted ? budgetRemaining.toLocaleString('en-IN') : "10,00,000"}
                </p>
                </div>
                <div className="text-center">
                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">PROGRESS</p>
                <p className="text-lg font-black text-[#1A73B5]">{progress}%</p>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setShowInvitePreview(true)} className="text-[9px] font-bold uppercase text-[#1A2B3C] hover:text-[#C7337B]">Preview Invite</button>
            <button onClick={downloadPDFPlan} className="hidden md:block px-4 py-2 border-2 border-[#1A73B5] text-[#1A73B5] text-[8px] font-bold rounded-full hover:bg-[#1A73B5] hover:text-white transition-all">DOWNLOAD PDF</button>
            <button onClick={handleManualSave} className="px-4 py-2 border-2 border-[#1A2B3C] text-[#1A2B3C] text-[8px] font-bold rounded-full uppercase hover:bg-[#1A2B3C] hover:text-white transition-all">{saveStatus}</button>
            <button className="px-5 py-2.5 bg-[#1A73B5] text-white text-[8px] font-black rounded-full uppercase shadow-md">SIGN UP</button>
          </div>
        </div>
      </nav>

      {/* SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Link 
              key={s.title} 
              href={s.href}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all text-left"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-2xl text-3xl shadow-sm">{s.icon}</div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[#1A2B3C] text-sm">{s.title}</h3>
                <p className="text-[11px] text-[#E8A835] font-semibold">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WORKSPACE AREA */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TASK MANAGEMENT */}
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] text-[#1A2B3C]">TASK MANAGEMENT</h2>
            <div className="text-[9px] font-bold text-gray-300">REPORT: {tasks.filter(t => !t.completed).length} PENDING</div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if(newTaskText) { setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]); setNewTaskText(""); } }} className="flex gap-4 mb-8">
            <input type="text" placeholder="ADD EVENT MILESTONE..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#1A73B5]/20" />
            <button type="submit" className="bg-[#1A73B5] text-white px-8 rounded-2xl font-black shadow-lg hover:bg-[#1A2B3C] transition-colors">+</button>
          </form>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <input type="checkbox" checked={task.completed} onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} className="w-5 h-5 accent-[#1A73B5] mr-4 cursor-pointer" />
                  <span className={`text-[12px] font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-[#1A2B3C]'}`}>{task.text}</span>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all text-lg leading-none"
                  title="Delete Task"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIALS & JOURNAL */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#C7337B] font-black uppercase tracking-widest text-[10px]">FINANCIALS</h3>
              <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${budgetRemaining < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                ₹{isMounted ? budgetRemaining.toLocaleString('en-IN') : "10,00,000"} Left
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-1 tracking-widest">TOTAL BUDGET</p>
                <div className="flex items-center text-[#1A73B5] font-black text-xl">
                  <span className="mr-2 opacity-30">₹</span>
                  <input type="number" value={totalBudget || ""} onChange={(e) => setTotalBudget(Number(e.target.value))} className="bg-transparent w-full outline-none" />
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="NAME" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none" />
                <input type="number" placeholder="₹" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-20 p-3 bg-gray-50 rounded-xl text-[10px] font-bold outline-none" />
                <button onClick={() => { if(newExpenseName && newExpenseAmount) { setExpenses([...expenses, { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }]); setNewExpenseName(""); setNewExpenseAmount(""); }}} className="bg-[#E8A835] text-white px-4 rounded-xl font-bold active:scale-95 transition-transform">+</button>
              </div>
              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                {expenses.map(exp => (
                  <div key={exp.id} className="group flex justify-between items-center p-3 bg-[#FDFDFD] border border-gray-50 rounded-xl text-[10px] font-bold">
                    <span className="text-gray-500 uppercase">{exp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#C7337B]">₹{exp.amount.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => deleteExpense(exp.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      >
                        &times;
                      </button>
                    </div>
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

      <footer className="mt-20 py-12 bg-white border-t border-gray-100 text-center">
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em] tracking-widest">© 2026 EVENT ESSENTIALS • ALL RIGHTS RESERVED</p>
      </footer>

      {/* PREVIEW MODAL */}
      {showInvitePreview && (
        <div className="fixed inset-0 bg-[#1A2B3C]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[3rem] p-12 text-center max-w-sm shadow-2xl">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Digital Suite Preview</h4>
            <div className="border-4 border-dashed border-gray-100 p-8 mb-8 rounded-[2rem] bg-gray-50">
              <p className="text-5xl font-serif text-[#C7337B]" style={{ fontFamily: "'Great Vibes', cursive" }}>{eventName}</p>
              <p className="text-sm mt-4 text-[#1A73B5] font-bold uppercase tracking-widest">{eventDate || "DATE NOT SET"}</p>
            </div>
            <button onClick={() => setShowInvitePreview(false)} className="w-full py-4 bg-[#1A2B3C] text-white rounded-full font-bold text-[10px] uppercase tracking-widest">CLOSE PREVIEW</button>
          </div>
        </div>
      )}
    </main>
  );
}