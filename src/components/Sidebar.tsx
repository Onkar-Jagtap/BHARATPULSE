import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Map, 
  FileUp, 
  ShieldAlert, 
  Settings, 
  Target,
  MoreVertical,
  Zap,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGuide: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onOpenGuide }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'War Room', icon: BarChart3 },
    { id: 'maps', label: 'Geo Intel', icon: Map },
    { id: 'data', label: 'Survey Hub', icon: FileUp },
    { id: 'strategy', label: 'AI Strategy', icon: Target },
    { id: 'swing', label: 'Swing Analyzer', icon: ShieldAlert },
  ];

  return (
    <div className="w-64 h-screen bg-[#0d1117] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)] border border-white/20">
            <Zap size={18} className="text-white fill-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            BHARATPULSE<span className="text-neon-purple italic"> AI</span>
          </h1>
        </div>
        <p className="text-[8px] uppercase tracking-[0.4em] font-black text-white/20 ml-1">BharatPulse Strategist</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/5 text-white" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-neon-purple rounded-r-full shadow-[0_0_8px_#d946ef]" 
                />
              )}
              <Icon size={18} className={cn("transition-transform duration-500", isActive ? "text-neon-purple scale-110" : "group-hover:scale-110")} />
              <span className={cn("font-bold text-xs uppercase tracking-widest transition-all", isActive ? "opacity-100 translate-x-0" : "opacity-70 group-hover:opacity-100 group-hover:translate-x-1")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={onOpenGuide}
          className="w-full mb-4 group p-4 border border-dashed border-white/10 rounded-xl hover:border-neon-purple/40 hover:bg-neon-purple/5 transition-all text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={14} className="text-neon-purple" />
            <span className="text-[10px] font-black uppercase text-white/60 group-hover:text-white">Quick Guide</span>
          </div>
          <p className="text-[9px] text-white/20 leading-tight">Master the platform protocol in 60s.</p>
        </button>

        <div className="bg-[#161b22] rounded-xl p-5 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-[10px] uppercase font-black text-white/40">Sync Status</span>
            </div>
            <span className="text-[10px] font-mono text-neon-purple">98.2%</span>
          </div>
          
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-neon-purple w-[98%] shadow-[0_0_10px_#d946ef]" />
          </div>

          <button className="w-full flex items-center justify-between group">
             <div className="flex items-center gap-2 text-white/30 group-hover:text-white transition-colors">
                <Settings size={14} />
                <span className="text-[10px] uppercase font-black tracking-widest">Configuration</span>
             </div>
             <MoreVertical size={14} className="text-white/20" />
          </button>
        </div>
      </div>
    </div>
  );
}
