import React from 'react';
import { cn } from '@/src/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: 'purple' | 'blue' | 'pink' | 'cyan';
}

export function KPICard({ label, value, icon: Icon, trend, trendLabel, variant = 'purple' }: KPICardProps) {
  const colorMap = {
    purple: 'text-neon-purple shadow-neon-purple/20',
    blue: 'text-accent-blue shadow-accent-blue/20',
    pink: 'text-neon-pink shadow-neon-pink/20',
    cyan: 'text-accent-cyan shadow-accent-cyan/20',
  };

  const glowMap = {
    purple: 'bg-neon-purple/10',
    blue: 'bg-accent-blue/10',
    pink: 'bg-neon-pink/10',
    cyan: 'bg-accent-cyan/10',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card p-6 relative group"
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full -mr-16 -mt-16 opacity-10 transition-opacity group-hover:opacity-20", glowMap[variant])} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", glowMap[variant])}>
          <Icon className={cn("w-5 h-5", colorMap[variant])} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
            trend >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tabular-nums tracking-tight">
          {value}
        </h3>
        {trendLabel && (
          <p className="text-[10px] text-white/30 mt-2 font-medium">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
