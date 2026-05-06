import React from 'react';
import { Upload, FileType, CheckCircle2, AlertCircle, Trash2, Database, Play } from 'lucide-react';
import { VoterRecord, ProcessingStats, processSurveyData } from '@/src/lib/dataProcessor';
import { generateDemoData } from '@/src/lib/demoData';
import { cn, formatNumber } from '@/src/lib/utils';
import Papa from 'papaparse';

interface SurveyCenterProps {
  onDataUpdate: (result: { data: VoterRecord[], stats: ProcessingStats }) => void;
  stats: ProcessingStats | null;
  currentData: VoterRecord[];
}

export function SurveyCenter({ onDataUpdate, stats, currentData }: SurveyCenterProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processed = processSurveyData(results.data);
          if (processed.data.length === 0) {
            alert("Analysis failed: No valid records found. Please ensure your CSV contains 'state' and 'constituency' columns.");
            return;
          }
          onDataUpdate(processed);
        }
      });
    } else {
      alert("Please upload a valid CSV file (CSV/JSON).");
    }
  };

  const loadDemo = () => {
    const rawDemo = generateDemoData(1200);
    const processed = processSurveyData(rawDemo);
    onDataUpdate(processed);
  };

  const purgeData = () => {
    onDataUpdate({ data: [], stats: { total: 0, cleaned: 0, invalid: 0, duplicates: 0, qualityScore: 0 } });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <label 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Logic for drop */ }}
            className={cn(
              "glass-card border-dashed border-2 flex flex-col items-center justify-center p-12 cursor-pointer transition-all duration-300",
              isDragging ? "border-neon-purple bg-neon-purple/5" : "border-white/10 hover:border-white/20"
            )}
          >
            <input type="file" className="hidden" onChange={handleFileUpload} accept=".csv" />
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-white/40" />
            </div>
            <h3 className="text-lg font-bold text-white">Upload Survey Dataset</h3>
            <p className="text-sm text-white/40 mt-1 max-w-xs text-center">Drag and drop or click to browse CSV files. No data? <button onClick={(e) => { e.preventDefault(); loadDemo(); }} className="text-neon-purple font-bold hover:underline">Load demo dataset</button></p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40">
                <FileType size={12} /> CSV Supported
              </div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-white/40">
                <Database size={12} /> JSON Supported
              </div>
            </div>
          </label>
        </div>

        {/* Processing Stats */}
        <div className="glass-card p-6">
          <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white/60">Ingestion Audit</h4>
          {stats ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">Valid Records</p>
                    <p className="text-xl font-bold font-mono">{formatNumber(currentData.length)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-green-400">Success</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Data Quality Score</span>
                  <span className="font-mono text-neon-purple">{stats.qualityScore.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-purple" style={{ width: `${stats.qualityScore}%` }} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase font-bold">
                  <span className="text-white/30">Auto-Cleaned Rows</span>
                  <span className="text-accent-blue">{stats.cleaned}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase font-bold">
                  <span className="text-white/30">Invalid Skipped</span>
                  <span className="text-red-400">{stats.invalid}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase font-bold">
                  <span className="text-white/30">Deduplicated</span>
                  <span className="text-neon-pink">{stats.duplicates}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-40 py-12">
              <AlertCircle className="mb-4" size={32} />
              <p className="text-xs uppercase font-bold text-center">No dataset<br/>active</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="glass-card">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/60">Live Data Stream (Top 50)</h4>
          <div className="flex gap-4">
            <button 
              onClick={loadDemo}
              className="text-[10px] uppercase font-bold text-neon-purple hover:bg-neon-purple/10 px-3 py-1.5 rounded transition-colors flex items-center gap-2"
            >
              <Play size={12} /> Load Demo
            </button>
            <button 
              onClick={purgeData}
              className="text-[10px] uppercase font-bold text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded transition-colors flex items-center gap-2"
            >
              <Trash2 size={12} /> Purge Buffer
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-bold text-white/40">
                <th className="px-6 py-4">State/Constituency</th>
                <th className="px-6 py-4">Demo</th>
                <th className="px-6 py-4">Preferred Party</th>
                <th className="px-6 py-4">Primary Issue</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 transition-opacity">
              {currentData.slice(0, 50).map(v => (
                <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">{v.constituency}</p>
                    <p className="text-[10px] text-white/40 uppercase">{v.state}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-[11px] text-white/60">
                      <span>{v.age} / {v.gender}</span>
                      <span className="text-[10px] text-white/30">{v.occupation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[11px] font-bold px-2 py-1 rounded inline-block",
                      v.preferredParty === 'BJP' && "bg-orange-500/10 text-orange-400",
                      v.preferredParty === 'INC' && "bg-blue-500/10 text-blue-400",
                      v.preferredParty === 'AAP' && "bg-pink-500/10 text-pink-400",
                      v.preferredParty === 'Undecided' && "bg-white/10 text-white/60"
                    )}>
                      {v.preferredParty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] text-white/60">{v.mainIssue}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full w-12 overflow-hidden">
                        <div className="h-full bg-accent-cyan" style={{ width: `${v.satisfactionScore * 10}%` }} />
                      </div>
                      <span className="text-[11px] font-mono">{v.satisfactionScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] uppercase font-bold",
                      v.sentiment === 'Positive' && "text-green-400",
                      v.sentiment === 'Negative' && "text-red-400",
                      v.sentiment === 'Neutral' && "text-blue-400"
                    )}>
                      {v.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentData.length === 0 && (
            <div className="p-12 text-center text-white/20 uppercase font-bold text-xs">
              Waiting for data ingestion...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
