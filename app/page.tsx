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
    setEventName(localStorage.getItem("event_name") || "My Special Event");
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
        console.warn("Logo not found.");
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
      alert("Please ensure 'jspdf' is installed.");
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
    <main className="min-h-screen bg-[#FAFBFF] font-['Montserrat',sans-serif] text-[#1A2B3C] pb-20 selection:bg-[#C7337B]/10 selection:text-[#C7337B]">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#fdf2f8,_transparent_50%),radial-gradient(circle_at_bottom_left,_#eff6ff,_transparent_50%)]" />

      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50 px-4 py-3 md:px-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
                <Image src="/logo.png" alt="Logo" width={55} height={55} className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110" />
                <div className="absolute -inset-1 bg-[#C7337B]/10 rounded-full blur group-hover:bg-[#C7337B]/20 transition-all"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="leading-none flex items-baseline">
                <span className="text-[#C7337B] text-2xl md:text-3xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Event</span>
                <span className="text-[#1A73B5] text-xl md:text-2xl ml-1" style={{ fontFamily: "'Great Vibes', cursive" }}>Essentials</span>
              </h1>
              <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400">Your Partner in Every Celebration</span>
            </div>
          </div>

          <div className="flex flex-col items-center w-full lg:w-auto">
            <div className="mb-1 group relative cursor-pointer" onClick={() => setIsEditingName(true)}>
                {isEditingName ? (
                    <input 
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                        autoFocus
                        className="text-[10px] font-black uppercase tracking-widest text-[#C7337B] border-b-2 border-[#C7337B] outline-none text-center bg-transparent px-2"
                    />
                ) : (
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#1A2B3C] flex items-center gap-2 hover:text-[#C7337B] transition-colors">
                        {eventName} <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-300">✎</span>
                    </p>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-8 px-2 md:px-8 border-t border-gray-100 pt-1">
                <div className="text-center group relative cursor-pointer min-w-[70px]" onClick={() => setIsEditingDate(true)}>
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">DAYS LEFT</p>
                    {isEditingDate ? (
                        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} onBlur={() => setIsEditingDate(false)} autoFocus className="text-[10px] font-black text-[#E8A835] bg-gray-50 rounded" />
                    ) : (
                        <p className="text-lg md:text-xl font-black text-[#E8A835] tracking-tighter transition-transform group-hover:scale-110">{daysRemaining ?? '0'}</p>
                    )}
                </div>

                <div className="text-center min-w-[90px] md:min-w-[100px]">
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">REMAINING</p>
                    <p className={`text-xl font-black tracking-tighter ${budgetRemaining < 0 ? 'text-red-500' : 'text-[#C7337B]'}`}>
                        ₹{isMounted ? budgetRemaining.toLocaleString('en-IN') : "10,00,000"}
                    </p>
                </div>
                
                <div className="text-center">
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">PROGRESS</p>
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-black text-[#1A73B5] tracking-tighter">{progress}%</p>
                        <div className="w-12 h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                            <div className="h-full bg-[#1A73B5] transition-all duration-700" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setShowInvitePreview(true)} className="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#C7337B] transition-colors">Preview</button>
            <button onClick={downloadPDFPlan} className="hidden md:block px-5 py-2 border-2 border-[#1A73B5]/20 text-[#1A73B5] text-[8px] font-bold rounded-full hover:border-[#1A73B5] hover:bg-[#1A73B5] hover:text-white transition-all duration-300">PDF</button>
            <button onClick={handleManualSave} className="px-5 py-2 border-2 border-[#1A2B3C] text-[#1A2B3C] text-[8px] font-bold rounded-full uppercase hover:bg-[#1A2B3C] hover:text-white transition-all duration-300 shadow-sm">{saveStatus}</button>
            <button className="px-6 py-2.5 bg-[#1A73B5] text-white text-[8px] font-black rounded-full uppercase shadow-[0_10px_20px_-5px_rgba(26,115,181,0.3)] hover:translate-y-[-2px] hover:shadow-[0_15px_25px_-5px_rgba(26,115,181,0.4)] transition-all">SIGN UP</button>
          </div>
        </div>
      </nav>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <Link key={s.title} href={s.href} className="group bg-white/60 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-start gap-4 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-[#1A2B3C] text-sm tracking-tight">{s.title}</h3>
                <p className="text-[10px] text-[#E8A835] font-bold uppercase tracking-wider mt-0.5">{s.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* TASKS */}
        <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-10">
            <div>
                <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-[#1A2B3C]">Task Management</h2>
                <div className="h-1 w-10 bg-[#C7337B] mt-2 rounded-full"></div>
            </div>
            <div className="px-4 py-1.5 bg-gray-50 rounded-full text-[9px] font-bold text-gray-400 tracking-widest">{tasks.filter(t => !t.completed).length} MILESTONES REMAINING</div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); if(newTaskText) { setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]); setNewTaskText(""); } }} className="flex gap-4 mb-10">
            <input type="text" placeholder="Add a new event milestone..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="flex-1 px-8 py-5 bg-gray-50/50 rounded-2xl text-[13px] font-semibold outline-none border border-transparent focus:border-[#1A73B5]/30 focus:bg-white transition-all" />
            <button type="submit" className="bg-[#1A2B3C] text-white px-10 rounded-2xl font-black shadow-lg hover:bg-[#C7337B] transition-all active:scale-95">+</button>
          </form>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-5 rounded-[1.5rem] border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all">
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={task.completed} onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))} className="w-6 h-6 rounded-lg accent-[#1A73B5] cursor-pointer" />
                  </div>
                  <span className={`text-[13px] font-bold transition-all ${task.completed ? 'text-gray-300 line-through' : 'text-[#1A2B3C]'}`}>{task.text}</span>
                </div>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-400 transition-all text-xl">&times;</button>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[#C7337B] font-black uppercase tracking-widest text-[11px]">Financials</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${budgetRemaining < 0 ? 'bg-red-50 text-red-500' : 'bg-[#C7337B]/10 text-[#C7337B]'}`}>
                ₹{isMounted ? budgetRemaining.toLocaleString('en-IN') : "10,00,000"}
              </span>
            </div>
            
            <div className="space-y-5">
              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100/50">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Total Capital</p>
                <div className="flex items-center text-[#1A73B5] font-black text-2xl">
                  <span className="mr-2 opacity-20">₹</span>
                  <input type="number" value={totalBudget || ""} onChange={(e) => setTotalBudget(Number(e.target.value))} className="bg-transparent w-full outline-none tracking-tighter" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <input type="text" placeholder="EXPENSE" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} className="flex-1 p-4 bg-gray-50 rounded-2xl text-[10px] font-bold outline-none focus:bg-white border border-transparent focus:border-gray-200" />
                <input type="number" placeholder="₹" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} className="w-24 p-4 bg-gray-50 rounded-2xl text-[10px] font-bold outline-none focus:bg-white border border-transparent focus:border-gray-200" />
                <button onClick={() => { if(newExpenseName && newExpenseAmount) { setExpenses([...expenses, { id: Date.now(), name: newExpenseName, amount: Number(newExpenseAmount) }]); setNewExpenseName(""); setNewExpenseAmount(""); }}} className="bg-[#E8A835] text-white px-5 rounded-2xl font-bold hover:shadow-lg transition-all">+</button>
              </div>

              <div className="max-h-[200px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {expenses.map(exp => (
                  <div key={exp.id} className="group flex justify-between items-center p-4 bg-[#FAFBFF] rounded-2xl text-[10px] font-bold border border-transparent hover:border-gray-100 transition-all">
                    <span className="text-gray-500">{exp.name.toUpperCase()}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#C7337B]">₹{exp.amount.toLocaleString('en-IN')}</span>
                      <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500">&times;</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#1A2B3C] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <h3 className="font-bold uppercase tracking-[0.5em] text-[10px] text-[#E8A835] mb-6 relative z-10">Creative Journal</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Draft themes, colors, and vibes..." className="w-full h-48 bg-transparent border-none outline-none resize-none text-[13px] leading-relaxed placeholder:text-white/20 italic font-medium relative z-10" />
          </div>
        </div>
      </section>

      <footer className="mt-32 py-16 text-center">
        <div className="max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.4em]">© 2026 EVENT ESSENTIALS • ALL RIGHTS RESERVED</p>
      </footer>

      {/* MODAL */}
      {showInvitePreview && (
        <div className="fixed inset-0 bg-[#1A2B3C]/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[4rem] p-12 text-center max-w-sm shadow-2xl scale-in-center">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-8">Digital Suite</h4>
            <div className="border-[1px] border-gray-100 p-10 mb-10 rounded-[3rem] bg-[#FAFBFF] shadow-inner">
              <p className="text-6xl font-serif text-[#C7337B] mb-6" style={{ fontFamily: "'Great Vibes', cursive" }}>{eventName}</p>
              <div className="h-[2px] w-12 bg-[#E8A835] mx-auto mb-6"></div>
              <p className="text-xs text-[#1A73B5] font-black uppercase tracking-[0.2em]">{eventDate || "DATE NOT SET"}</p>
            </div>
            <button onClick={() => setShowInvitePreview(false)} className="w-full py-5 bg-[#1A2B3C] text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#C7337B] transition-colors shadow-lg">CLOSE</button>
          </div>
        </div>
      )}
    </main>
  );
}