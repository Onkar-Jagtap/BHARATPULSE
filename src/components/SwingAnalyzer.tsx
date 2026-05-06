import React from 'react';
import { VoterRecord } from '@/src/lib/dataProcessor';
import { ShieldAlert, Zap, Users, Target, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatPercent } from '@/src/lib/utils';

interface SwingAnalyzerProps {
  data: VoterRecord[];
}

export function SwingAnalyzer({ data }: SwingAnalyzerProps) {
  const swingData = React.useMemo(() => {
    const constituencyMap = new Map<string, { total: number, undecided: number, state: string }>();
    
    data.forEach(v => {
      const stats = constituencyMap.get(v.constituency) || { total: 0, undecided: 0, state: v.state };
      stats.total++;
      if (v.preferredParty === 'Undecided' || v.preferredParty === 'Unknown') {
        stats.undecided++;
      }
      constituencyMap.set(v.constituency, stats);
    });

    return Array.from(constituencyMap.entries())
      .map(([name, stats]) => ({
        name,
        state: stats.state,
        total: stats.total,
        undecided: stats.undecided,
        percent: stats.undecided / stats.total,
        volatility: (stats.undecided / stats.total) * 100
      }))
      .sort((a, b) => b.volatility - a.volatility);
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="text-neon-pink" size={24} />
            Swing Vulnerability Analysis
          </h2>
          <p className="text-sm text-white/40">Identifying critical undecided blocks and volatile constituencies</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Active Monitoring</span>
          <p className="text-xs font-mono text-neon-pink">Real-time Drift Detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Ranking */}
        <div className="lg:col-span-2 glass-card">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Risk Priority Matrix</h3>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
            </div>
          </div>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-bold text-white/40">
                  <th className="px-6 py-4">Constituency</th>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4">Volatility</th>
                  <th className="px-6 py-4">Opportunity</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {swingData.slice(0, 10).map((item, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.name} 
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-neon-pink transition-colors">{item.name}</p>
                      <p className="text-[10px] uppercase text-white/30">{item.total} Surveyed</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-mono text-white/60 font-bold">{item.state}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-white/5 rounded-full w-24 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.volatility}%` }}
                            className={cn(
                              "h-full rounded-full",
                              item.volatility > 40 ? "bg-red-500" : item.volatility > 25 ? "bg-orange-500" : "bg-yellow-500"
                            )} 
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-white/80">{item.volatility.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] uppercase font-black px-2 py-1 rounded inline-block",
                        item.volatility > 30 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                      )}>
                        {item.volatility > 30 ? 'High Drift' : 'Stable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArrowRight size={14} className="text-white/20 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-neon-pink/10 to-transparent">
            <h3 className="text-xs font-black uppercase tracking-widest text-neon-pink mb-4">Strategic Pulse</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-neon-purple" />
                  <span className="text-xs font-bold">Swing Velocity</span>
                </div>
                <span className="text-xs font-mono text-neon-purple">+12.4%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-accent-blue" />
                  <span className="text-xs font-bold">Uncommitted Reach</span>
                </div>
                <span className="text-xs font-mono text-accent-blue">2.8k</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-neon-pink/20">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-neon-pink" />
                  <span className="text-xs font-bold">Focus Districts</span>
                </div>
                <span className="text-xs font-mono text-neon-pink">12</span>
              </div>
            </div>
            <p className="text-[10px] text-white/30 mt-6 leading-relaxed uppercase tracking-tighter">
              Constituencies with {`>30%`} undecided voters are classified as "High Drift". Targeted digital remediation recommended.
            </p>
          </div>

          <div className="glass-card p-6 border-l-2 border-l-orange-500">
            <h4 className="text-xs font-bold uppercase text-orange-500 mb-2">Campaign Directive</h4>
            <p className="text-xs text-white/60 leading-relaxed italic">
              "Focus 60% of ground resources on the top 5 volatility zones. These areas exhibit the highest fragmentation and could be decided by small voter shifts."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
