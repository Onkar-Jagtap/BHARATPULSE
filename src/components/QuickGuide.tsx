import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Database, 
  Target, 
  MapPin, 
  ShieldAlert, 
  Cpu, 
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';

interface QuickGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickGuide({ isOpen, onClose }: QuickGuideProps) {
  const steps = [
    {
      icon: Database,
      title: "Data Ingestion",
      description: "Upload your constituency survey results (CSV/XLSX) in the Survey Hub. The AI immediately cleans and structures the data for analysis.",
      color: "text-blue-400"
    },
    {
      icon: Target,
      title: "AI Strategy",
      description: "Generate deep strategic insights using Gemini AI. Get recommendations on issues, demographic targeting, and sentiment remediation.",
      color: "text-neon-purple"
    },
    {
      icon: MapPin,
      title: "Geo Intelligence",
      description: "Visualize voter concentration and volatility across regions. Identify your strongholds and high-drift zones instantly.",
      color: "text-accent-blue"
    },
    {
      icon: ShieldAlert,
      title: "Risk Analysis",
      description: "Our drift sensors detect constituencies with high undecided voter counts, allowing you to prioritize outreach efforts.",
      color: "text-neon-pink"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-accent-blue to-neon-pink" />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neon-purple/20 rounded-lg">
                    <Cpu className="text-neon-purple" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Quick Operations Guide</h2>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all group"
                  >
                    <div className={cn("mb-4 flex items-center justify-between", step.color)}>
                      <step.icon size={24} />
                      <div className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white/20">MODULE {idx + 1}</div>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase mb-2 tracking-wide group-hover:text-neon-purple transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/20 uppercase">Core Capacity</span>
                      <span className="text-xs font-bold text-white">100K Records/Session</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/20 uppercase">Intelligence Level</span>
                      <span className="text-xs font-bold text-neon-purple">Strategic Alpha</span>
                   </div>
                </div>
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 bg-neon-purple text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Initialize System
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
