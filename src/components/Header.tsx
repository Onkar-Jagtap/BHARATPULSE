import React from 'react';
import { Bell, Search, User, Zap, Globe, Terminal, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function Header() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-[40]">
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-4 py-1 pr-8 border-r border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em]">Quantum Clock</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neon-purple shadow-neon-purple/20">
              <Clock size={12} className="animate-pulse" />
              {time.toLocaleTimeString()} <span className="text-[10px] text-white/20">IST</span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-neon-purple transition-colors" size={14} />
          <input 
            placeholder="Query Constituency Node..."
            className="bg-white/5 border border-white/10 rounded-lg py-2 pl-11 pr-4 text-xs w-72 focus:outline-none focus:border-neon-purple/40 focus:ring-1 focus:ring-neon-purple/20 transition-all font-mono"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-neon-purple/5 border border-neon-purple/10 rounded-full">
           <Terminal size={12} className="text-neon-purple" />
           <span className="text-[10px] font-mono font-bold text-neon-purple uppercase tracking-widest">Protocol v2.4.0 Active</span>
        </div>

        <div className="flex gap-2">
          <HeaderAction icon={Globe} label="News Hub" />
          <HeaderAction icon={Bell} label="Alert Notifications" count={5} />
        </div>
        
        <div className="h-10 w-[1px] bg-white/5 mx-2" />
        
        <button className="flex items-center gap-3 group px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
          <div className="text-right">
            <p className="text-xs font-black text-white group-hover:text-neon-purple transition-colors">Strat-Alpha Core</p>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Lead Tactician</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
             <User size={18} className="text-white/40" />
          </div>
        </button>
      </div>
    </header>
  );
}

function HeaderAction({ icon: Icon, label, count }: { icon: any, label: string, count?: number }) {
  return (
    <button className="relative p-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
      <Icon size={18} className="group-hover:scale-110 transition-transform" />
      {count && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-pink rounded-full shadow-[0_0_8px_#ec4899]" />
      )}
      <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0d1117] border border-white/10 rounded-md text-[10px] font-black uppercase tracking-widest invisible group-hover:visible whitespace-nowrap shadow-2xl z-50">
        {label}
      </div>
    </button>
  );
}
