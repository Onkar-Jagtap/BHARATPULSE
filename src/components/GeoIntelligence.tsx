import React from 'react';
import { VoterRecord } from '@/src/lib/dataProcessor';
import { Globe, ArrowUpRight, TrendingUp, TrendingDown, Users, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatNumber } from '@/src/lib/utils';

interface GeoIntelligenceProps {
  data: VoterRecord[];
}

export function GeoIntelligence({ data }: GeoIntelligenceProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const startAction = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const regionalData = React.useMemo(() => {
    const states = new Map<string, { 
      count: number, 
      avgSatisfaction: number, 
      topParty: string,
      partyCounts: Record<string, number>
    }>();

    data.forEach(v => {
      const stats = states.get(v.state) || { count: 0, avgSatisfaction: 0, topParty: '', partyCounts: {} };
      stats.count++;
      stats.avgSatisfaction += v.satisfactionScore;
      stats.partyCounts[v.preferredParty] = (stats.partyCounts[v.preferredParty] || 0) + 1;
      states.set(v.state, stats);
    });

    return Array.from(states.entries()).map(([name, stats]) => {
      const partyEntries = Object.entries(stats.partyCounts);
      const topParty = partyEntries.length > 0 ? partyEntries.sort((a, b) => b[1] - a[1])[0][0] : 'Mixed';
      return {
        name,
        count: stats.count,
        avgSatisfaction: stats.avgSatisfaction / stats.count,
        topParty,
        volatility: (stats.partyCounts['Undecided'] || stats.partyCounts['Unknown'] || 0) / stats.count
      };
    }).sort((a,b) => b.count - a.count);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="text-accent-blue" size={24} />
            Regional Intelligence Mesh
          </h2>
          <p className="text-sm text-white/40">Macro-analysis of voter behavior across state boundaries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regionalData.map((state, idx) => (
          <motion.div 
            key={state.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 group transition-all hover:bg-white/[0.07]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-mono text-sm font-black text-accent-blue group-hover:scale-110 transition-transform">
                {state.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                <TrendingUp size={10} /> 3.2%
              </div>
            </div>

            <h3 className="text-lg font-black group-hover:text-accent-blue transition-colors">{state.name}</h3>
            
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-white/30">Dominant Party</p>
                  <p className="text-sm font-mono font-black text-white">{state.topParty}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] uppercase font-bold text-white/30">Satisfaction</p>
                  <p className="text-sm font-mono font-black text-accent-blue">{state.avgSatisfaction.toFixed(1)}/10</p>
                </div>
              </div>

              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent-blue shadow-[0_0_8px_#3b82f6]" 
                  style={{ width: `${state.avgSatisfaction * 10}%` }} 
                />
              </div>

              <div className="flex justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-white/20" />
                  <span className="text-[10px] font-mono text-white/40">{formatNumber(state.count)}k</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smile size={12} className="text-white/20" />
                  <span className="text-[10px] font-mono text-white/40">{Math.round(state.volatility * 100)}% Swing</span>
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-accent-blue" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cross-Regional Insights */}
      <div className="glass-card p-8 flex flex-col md:flex-row gap-12 items-center bg-gradient-to-r from-accent-blue/10 to-transparent">
        <div className="flex-1 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent-blue">Geo Strategy Notification</h4>
          <h3 className="text-2xl font-black leading-tight">Voter dissatisfaction is peaking in IT-hubs across Karnataka and Maharashtra.</h3>
          <p className="text-sm text-white/50 max-w-xl">
            Our analysis indicates a unified sentiment trend across urban centers. Recommend a cross-state digital campaign focusing on infra revitalization.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={startAction}
              disabled={isGenerating}
              className="px-6 py-2 bg-accent-blue text-black text-xs font-black uppercase rounded hover:bg-accent-blue/80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating && <TrendingUp size={14} className="animate-bounce" />}
              {isGenerating ? "Synthesizing Plan..." : "Generate Action Plan"}
            </button>
            <button className="px-6 py-2 border border-white/10 text-xs font-black uppercase rounded hover:bg-white/5 transition-colors">Compare Regions</button>
          </div>
        </div>
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center relative border border-white/5">
           <Globe size={80} className="text-accent-blue/40 animate-pulse" />
           <div className="absolute inset-0 border-2 border-accent-blue/20 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
