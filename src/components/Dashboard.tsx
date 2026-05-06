import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { VoterRecord } from '@/src/lib/dataProcessor';

interface DashboardProps {
  data: VoterRecord[];
}

export function Dashboard({ data }: DashboardProps) {
  // Aggregate Party Preferences
  const partyData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(v => {
      counts[v.preferredParty] = (counts[v.preferredParty] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // Sentiment Distribution
  const sentimentData = React.useMemo(() => {
    const counts: Record<string, number> = { Positive: 0, Negative: 0, Neutral: 0 };
    data.forEach(v => counts[v.sentiment]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Issue Impact
  const issueData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(v => {
      counts[v.mainIssue] = (counts[v.mainIssue] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }, [data]);

  const COLORS = {
    BJP: '#F27D26',
    INC: '#06b6d4',
    AAP: '#d946ef',
    Undecided: '#4b5563',
    others: '#9333ea',
    Positive: '#22c55e',
    Negative: '#ef4444',
    Neutral: '#3b82f6'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Party Popularity */}
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white/60">Party Preference Density</h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={partyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" fontSize={10} stroke="#ffffff40" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} stroke="#ffffff40" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {partyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.others} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white/60">Voter Sentiment Pulse</h4>
          <div className="flex-1 w-full flex items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {sentimentData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }} />
                  <span className="text-[10px] text-white/60 uppercase font-bold">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Issues */}
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white/60">Critical Voter Concerns</h4>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={issueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={10} stroke="#ffffff60" width={80} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#9333ea" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Large Trend Area */}
      <div className="glass-card p-6 h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/60">Constituency Volatility Timeline</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-purple shadow-[0_0_8px_#d946ef]" />
              <span className="text-[10px] uppercase text-white/40">Engagement Index</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-blue shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] uppercase text-white/40">Satisfaction Mean</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data.slice(0, 20).map((v, i) => ({ 
            name: `Day ${i}`, 
            val: v.satisfactionScore,
            eng: Math.floor(Math.random() * 100) 
          }))}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
            <Area type="monotone" dataKey="eng" stroke="#d946ef" fillOpacity={1} fill="url(#colorEng)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
