/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  CalendarDays, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Globe, 
  Settings, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  BarChart3, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Menu,
  X,
  Send,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type Module = 'dashboard' | 'marketing' | 'social' | 'competitors' | 'reputation' | 'website' | 'operations' | 'strategy';

interface NavItem {
  id: Module;
  label: string;
  icon: React.ElementType;
}

// --- Components ---

const Sidebar = ({ activeModule, setActiveModule, isOpen, setIsOpen }: { 
  activeModule: Module, 
  setActiveModule: (m: Module) => void,
  isOpen: boolean,
  setIsOpen: (b: boolean) => void
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'marketing', label: 'Marketing & Ads', icon: Megaphone },
    { id: 'social', label: 'Social Planner', icon: CalendarDays },
    { id: 'competitors', label: 'Competitor Intel', icon: Search },
    { id: 'reputation', label: 'Reputation', icon: MessageSquare },
    { id: 'website', label: 'Web Advisory', icon: Globe },
    { id: 'operations', label: 'Operations', icon: Users },
    { id: 'strategy', label: 'Strategy', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed top-0 left-0 h-full bg-[#0A0A0A] border-r border-white/10 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">INDIGO AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/60">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeModule === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {activeModule === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Marcus Lounge</p>
              <p className="text-xs text-white/40">Owner Account</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ title, setIsSidebarOpen }: { title: string, setIsSidebarOpen: (b: boolean) => void }) => (
  <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
    <div className="flex items-center gap-4">
      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-white/60">
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-white/60">AI Engine Online</span>
      </div>
      <button className="p-2 text-white/60 hover:text-white transition-colors">
        <Settings size={20} />
      </button>
    </div>
  </header>
);

// --- Module Components ---

const DashboardOverview = () => {
  const stats = [
    { label: 'Total Bookings', value: '1,284', change: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Avg Sentiment', value: '4.8', change: '+0.3', icon: MessageSquare, color: 'text-indigo-500' },
    { label: 'Social Reach', value: '42.5k', change: '+18%', icon: BarChart3, color: 'text-violet-500' },
    { label: 'Staff Efficiency', value: '94%', change: '+2%', icon: Users, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} />
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/40 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Weekly Performance</h3>
            <select className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 65, 45, 90, 75, 55, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-indigo-600/20 group-hover:bg-indigo-600/40 rounded-t-lg transition-all relative overflow-hidden"
                >
                  <div className="absolute bottom-0 left-0 w-full bg-indigo-500 h-1/3 opacity-50" />
                </motion.div>
                <span className="text-[10px] text-white/40 uppercase font-bold">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[
              { type: 'negative', msg: 'New 2-star review on Google Business', time: '2h ago' },
              { type: 'warning', msg: 'Staff shortage for Friday DJ Night', time: '5h ago' },
              { type: 'success', msg: 'Instagram campaign reach exceeded target', time: '1d ago' },
              { type: 'info', msg: 'Competitor "SkyBar" launched new VIP package', time: '1d ago' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className={`mt-1 ${
                  alert.type === 'negative' ? 'text-rose-500' : 
                  alert.type === 'warning' ? 'text-amber-500' : 
                  alert.type === 'success' ? 'text-emerald-500' : 'text-indigo-500'
                }`}>
                  {alert.type === 'negative' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                </div>
                <div>
                  <p className="text-sm text-white/80 leading-tight">{alert.msg}</p>
                  <p className="text-[10px] text-white/40 mt-1 font-bold uppercase">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketingModule = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generateCopy = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 3 variations of professional, high-end hospitality marketing copy for INDIGO Lounge. 
        Context: ${prompt}. 
        Include: Catchy hook, body text, hashtags, and a call to action. 
        Format as a JSON array of strings.`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text || '[]');
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults(["Error generating copy. Please try again."]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Ad Generator</h3>
            <p className="text-sm text-white/40">Create premium campaign copy in seconds</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your event (e.g., 'Ladies Night this Friday with DJ Spark, free cocktails for ladies before 10 PM')..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:border-indigo-500/50 outline-none transition-all resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {['Instagram', 'Facebook', 'TikTok', 'WhatsApp', 'Email'].map(p => (
              <button key={p} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all">
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={generateCopy}
            disabled={isGenerating || !prompt}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Zap size={20} />
                Generate Campaign Copy
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest px-2">Generated Variations</h4>
            {results.map((res, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111111] border border-white/10 rounded-2xl p-6 relative group"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all">
                    <Plus size={16} />
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all">
                    <Send size={16} />
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                  {res}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OperationsModule = () => {
  const [view, setView] = useState<'roster' | 'staff'>('roster');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shifts = ['Morning (09:00 - 17:00)', 'Evening (17:00 - 01:00)', 'Late Night (21:00 - 05:00)'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setView('roster')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'roster' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-white/40 hover:text-white'}`}
          >
            Staff Roster
          </button>
          <button 
            onClick={() => setView('staff')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'staff' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-white/40 hover:text-white'}`}
          >
            Team Directory
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-all">
          <Plus size={18} />
          Add Shift
        </button>
      </div>

      {view === 'roster' ? (
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider bg-white/[0.02]">Shift / Day</th>
                  {days.map(day => (
                    <th key={day} className="p-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider bg-white/[0.02]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, i) => (
                  <tr key={shift} className="border-b border-white/5 last:border-0">
                    <td className="p-4 border-r border-white/5 bg-white/[0.01]">
                      <p className="text-sm font-bold text-white">{shift.split(' ')[0]}</p>
                      <p className="text-[10px] text-white/40 font-mono mt-1">{shift.split('(')[1].replace(')', '')}</p>
                    </td>
                    {days.map(day => (
                      <td key={day} className="p-4 group relative hover:bg-white/[0.02] transition-colors">
                        <div className="space-y-2">
                          {Math.random() > 0.3 ? (
                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                              <p className="text-xs font-bold text-indigo-400">Sarah J.</p>
                              <p className="text-[10px] text-indigo-400/60 uppercase">Waitress</p>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                              <AlertCircle size={12} className="text-rose-500" />
                              <span className="text-[10px] font-bold text-rose-500 uppercase">Understaffed</span>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Jenkins', role: 'Waitress', status: 'On Shift', avatar: 'SJ' },
            { name: 'Michael Chen', role: 'Head Cook', status: 'Off Duty', avatar: 'MC' },
            { name: 'Elena Rodriguez', role: 'Waitress', status: 'On Shift', avatar: 'ER' },
            { name: 'David Smith', role: 'Bartender', status: 'On Shift', avatar: 'DS' },
            { name: 'Jessica Wu', role: 'Hostess', status: 'Vacation', avatar: 'JW' },
          ].map((staff, i) => (
            <div key={i} className="bg-[#111111] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                {staff.avatar}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{staff.name}</h4>
                <p className="text-xs text-white/40">{staff.role}</p>
              </div>
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                staff.status === 'On Shift' ? 'bg-emerald-500/10 text-emerald-500' : 
                staff.status === 'Off Duty' ? 'bg-white/5 text-white/40' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {staff.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CompetitorModule = () => {
  const competitors = [
    { name: 'SkyBar Lounge', rating: 4.5, events: 'Jazz Night (Wed)', price: '$$$', status: 'High Threat' },
    { name: 'The Velvet Room', rating: 4.2, events: 'Techno Friday', price: '$$$$', status: 'Medium Threat' },
    { name: 'Neon Garden', rating: 3.9, events: 'Happy Hour Daily', price: '$$', status: 'Low Threat' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Market Share Analysis</h3>
            <div className="space-y-6">
              {competitors.map((comp, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">{comp.name}</span>
                    <span className="text-white/40">{85 - i * 15}% Visibility</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${85 - i * 15}%` }}
                      className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-white/20'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 text-xs font-bold text-white/40 uppercase">Competitor</th>
                  <th className="p-4 text-xs font-bold text-white/40 uppercase">Rating</th>
                  <th className="p-4 text-xs font-bold text-white/40 uppercase">Key Event</th>
                  <th className="p-4 text-xs font-bold text-white/40 uppercase">Threat Level</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 text-sm font-bold text-white">{comp.name}</td>
                    <td className="p-4 text-sm text-white/60">{comp.rating} / 5.0</td>
                    <td className="p-4 text-sm text-white/60">{comp.events}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        comp.status === 'High Threat' ? 'bg-rose-500/10 text-rose-500' : 
                        comp.status === 'Medium Threat' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20 flex flex-col justify-between">
          <div>
            <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Strategic Advice</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              "SkyBar Lounge" is gaining traction with their mid-week Jazz events. 
              INDIGO should consider a "Wine & Sax" Wednesday to capture the after-work professional crowd.
            </p>
          </div>
          <button className="mt-8 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
            Generate Full Report
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const moduleTitles: Record<Module, string> = {
    dashboard: 'Dashboard Overview',
    marketing: 'Marketing & Ad Generation',
    social: 'Social Content Planner',
    competitors: 'Competitor Intelligence',
    reputation: 'Reputation Monitoring',
    website: 'Website Advisory',
    operations: 'Staff & Operations',
    strategy: 'Strategic Business Advice',
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardOverview />;
      case 'marketing': return <MarketingModule />;
      case 'operations': return <OperationsModule />;
      case 'competitors': return <CompetitorModule />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-white/20">
          <Sparkles size={64} className="mb-4 opacity-20" />
          <h3 className="text-xl font-bold">Module Under Development</h3>
          <p className="text-sm">This feature is part of the Phase 2 roadmap.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          title={moduleTitles[activeModule]} 
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/20 font-medium tracking-widest uppercase">
            Powered by INDIGO AI Engine v1.0.4
          </p>
        </footer>
      </main>
    </div>
  );
}
