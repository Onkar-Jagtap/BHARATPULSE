import React from 'react';
import { 
  Users, 
  MapPin, 
  Smile, 
  Zap, 
  TrendingUp, 
  AlertCircle,
  Database,
  Target,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KPICard } from './components/KPICard';
import { Dashboard } from './components/Dashboard';
import { SurveyCenter } from './components/SurveyCenter';
import { StrategyHub } from './components/StrategyHub';
import { ChatAssistant } from './components/ChatAssistant';
import { SwingAnalyzer } from './components/SwingAnalyzer';
import { GeoIntelligence } from './components/GeoIntelligence';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateDemoData } from './lib/demoData';
import { VoterRecord, ProcessingStats, processSurveyData } from './lib/dataProcessor';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('data');
  const [data, setData] = React.useState<VoterRecord[]>([]);
  const [stats, setStats] = React.useState<ProcessingStats | null>(null);

  // Data starts empty to respect user's own ingestion workflow.
  React.useEffect(() => {
    // We intentionally leave data empty on boot.
  }, []);

  const handleDataUpdate = (result: { data: VoterRecord[], stats: ProcessingStats }) => {
    setData(result.data);
    setStats(result.stats);
    setActiveTab('dashboard'); 
  };

  // Derived KPIs
  const totalConstituencies = React.useMemo(() => new Set(data.map(v => v.constituency)).size, [data]);
  const avgSatisfaction = React.useMemo(() => {
    if (data.length === 0) return 0;
    return (data.reduce((a, b) => a + b.satisfactionScore, 0) / data.length).toFixed(1);
  }, [data]);
  const undecidedCount = React.useMemo(() => data.filter(v => v.preferredParty === 'Undecided' || v.preferredParty === 'Unknown').length, [data]);
  const undecidedPercent = React.useMemo(() => data.length > 0 ? ((undecidedCount / data.length) * 100).toFixed(1) : "0", [data, undecidedCount]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#010409] text-slate-300 overflow-x-hidden selection:bg-neon-purple/30">
        {/* Structural Scanline Effect */}
        <div className="fixed inset-0 z-0 pointer-events-none scanline opacity-30" />
        
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="pl-64 min-h-screen relative z-10 flex flex-col">
          <Header />

          <div className="flex-1 p-8 pt-6 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Top KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard 
                label="Analyzed Voters" 
                value={data.length} 
                icon={Users} 
                trend={12.5} 
                variant="purple"
              />
              <KPICard 
                label="Active Districts" 
                value={totalConstituencies} 
                icon={MapPin} 
                variant="blue"
              />
              <KPICard 
                label="Satisfaction" 
                value={`${avgSatisfaction}/10`} 
                icon={Smile} 
                variant="cyan"
              />
              <KPICard 
                label="Volatility" 
                value={`${undecidedPercent}%`} 
                icon={Zap} 
                variant="pink"
              />
            </div>

            {/* Main Content Area */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {activeTab === 'dashboard' && (
                    data.length > 0 ? <Dashboard data={data} /> : (
                      <div className="flex flex-col items-center justify-center py-24 glass-card border-dashed border-white/10">
                        <Database size={48} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Neural Link Offline</h2>
                        <p className="text-sm text-white/20 mt-2">Upload survey data in the Survey Hub to activate analytics</p>
                      </div>
                    )
                  )}
                  {activeTab === 'data' && <SurveyCenter onDataUpdate={handleDataUpdate} stats={stats} currentData={data} />}
                  {activeTab === 'strategy' && (
                    data.length > 0 ? <StrategyHub data={data} /> : (
                      <div className="flex flex-col items-center justify-center py-24 glass-card border-dashed border-white/10">
                        <Target size={48} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Strategy Core Locked</h2>
                        <p className="text-sm text-white/20 mt-2">AI requires voter data context to generate strategic directives</p>
                      </div>
                    )
                  )}
                  {activeTab === 'swing' && (
                    data.length > 0 ? <SwingAnalyzer data={data} /> : (
                      <div className="flex flex-col items-center justify-center py-24 glass-card border-dashed border-white/10">
                        <ShieldAlert size={48} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Drift Sensors Offline</h2>
                        <p className="text-sm text-white/20 mt-2">Volatility analysis requires active dataset</p>
                      </div>
                    )
                  )}
                  {activeTab === 'maps' && (
                    data.length > 0 ? <GeoIntelligence data={data} /> : (
                      <div className="flex flex-col items-center justify-center py-24 glass-card border-dashed border-white/10">
                        <MapPin size={48} className="mb-4 text-white/20" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Geo Mesh Inactive</h2>
                        <p className="text-sm text-white/20 mt-2">Regional intelligence expects a multi-constituency dataset</p>
                      </div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <footer className="p-8 border-t border-white/5 text-center">
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/10">BharatPulse AI Intelligence Unit © 2026</p>
          </footer>
        </main>

        <ChatAssistant data={data} />
      </div>
    </ErrorBoundary>
  );
}
