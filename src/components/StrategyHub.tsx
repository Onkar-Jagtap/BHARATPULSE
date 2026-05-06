import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Flag, 
  AlertTriangle, 
  RefreshCcw,
  Microscope,
  Zap
} from 'lucide-react';
import { VoterRecord } from '@/src/lib/dataProcessor';
import { generateConstituencyInsights, PoliticalInsight } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface StrategyHubProps {
  data: VoterRecord[];
}

export function StrategyHub({ data }: StrategyHubProps) {
  const [insights, setInsights] = React.useState<PoliticalInsight[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activePlan, setActivePlan] = React.useState<number | null>(null);

  const startAction = (id: number) => {
    setActivePlan(id);
    setTimeout(() => setActivePlan(null), 3000);
  };

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a textual summary for the AI
      const stateCounts = data.reduce((acc: any, v) => {
        acc[v.state] = (acc[v.state] || 0) + 1;
        return acc;
      }, {});
      
      const summary = `Analyzing ${data.length} voters. 
        States involved: ${Object.keys(stateCounts).join(', ') || 'None'}.
        Average satisfaction score is ${data.length > 0 ? (data.reduce((a, b) => a + b.satisfactionScore, 0) / data.length).toFixed(1) : 'Unknown'}.`;
      
      const res = await generateConstituencyInsights(summary);
      setInsights(res);
    } catch (err) {
      console.error(err);
      setError("Strategic core failed to respond. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (data.length > 0 && insights.length === 0) {
      getInsights();
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-neon-purple" size={24} />
            AI Strategy Intelligence
          </h2>
          <p className="text-sm text-white/40">Data-driven campaign recommendations generated via Gemini 1.5</p>
        </div>
        <button 
          onClick={getInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Recalculate Strategy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {error ? (
            <div className="lg:col-span-2 glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 border-red-500/20 bg-red-500/5">
              <AlertTriangle className="text-red-500" size={48} />
              <h3 className="text-lg font-bold">Strategic Link Interrupted</h3>
              <p className="text-sm text-white/40 max-w-md">{error}</p>
              <button 
                onClick={getInsights}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Retry Intelligence Sync
              </button>
            </div>
          ) : loading ? (
             [1,2,3,4].map(i => (
              <div key={i} className="glass-card p-6 h-48 animate-pulse bg-white/5" />
             ))
          ) : (
            insights.map((insight, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 relative overflow-hidden group"
              >
                <div className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  insight.impact === 'high' ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : 
                  insight.impact === 'medium' ? "bg-neon-purple shadow-[0_0_10px_#d946ef]" : "bg-accent-blue"
                )} />
                
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                    insight.category === 'strategy' ? "bg-neon-purple/20 text-neon-purple" : "bg-white/10 text-white/60"
                  )}>
                    {insight.category}
                  </div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Impact: {insight.impact}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-neon-purple transition-colors">{insight.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{insight.description}</p>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
                  <button 
                    onClick={() => startAction(idx * 10)}
                    disabled={activePlan === idx * 10}
                    className="text-[10px] font-bold uppercase text-white/40 hover:text-white flex items-center gap-1.5 transition-colors disabled:text-neon-purple"
                  >
                    {activePlan === idx * 10 ? <RefreshCcw size={12} className="animate-spin" /> : <Flag size={12} />}
                    {activePlan === idx * 10 ? "Routing..." : "Target Region"}
                  </button>
                  <button 
                    onClick={() => startAction(idx * 10 + 1)}
                    disabled={activePlan === idx * 10 + 1}
                    className="text-[10px] font-bold uppercase text-white/40 hover:text-white flex items-center gap-1.5 transition-colors disabled:text-accent-blue"
                  >
                    {activePlan === idx * 10 + 1 ? <RefreshCcw size={12} className="animate-spin" /> : <Microscope size={12} />}
                    {activePlan === idx * 10 + 1 ? "Querying..." : "View Dataset"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Strategy Action Items */}
      <div className="glass-card p-8">
        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Zap className="text-neon-yellow" size={20} />
          Campaign Action Protocol
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/60">
              <Lightbulb size={18} className="text-neon-yellow" />
              <span className="text-xs uppercase font-bold tracking-wider">Manifesto Focus</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 flex-shrink-0" />
                Highlight IT Skill Development in Urban Pune
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-yellow mt-1.5 flex-shrink-0" />
                Commit to direct agricultural subsidies in Vidarbha
              </li>
            </ul>
          </div>

          <div className="space-y-4 font-sans font-medium">
            <div className="flex items-center gap-3 text-white/60">
              <AlertTriangle size={18} className="text-red-400" />
              <span className="text-xs uppercase font-bold tracking-wider">Risk Mitigation</span>
            </div>
            <ul className="space-y-3 text-lg font-bold">
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                Counter dissatisfaction in health services sector
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                Address concerns of first-time women voters
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/60">
              <RefreshCcw size={18} className="text-accent-blue" />
              <span className="text-xs uppercase font-bold tracking-wider">Social Outreach</span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
                Targeted IT hub digital campaigns for mid-income
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
                Community radio sessions in remote agricultural belts
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
