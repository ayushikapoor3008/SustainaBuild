import React from 'react';
import { HelpCircle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  onWhyClick?: () => void;
  badge?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  trendType = 'positive',
  onWhyClick,
  badge
}) => {
  return (
    <div className="eco-card p-5 flex flex-col justify-between relative group overflow-hidden">
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
          {badge}
        </span>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-emerald-900 flex items-center justify-center border border-slate-200/60 shadow-xs">
            {icon}
          </div>

          {onWhyClick && (
            <button
              onClick={onWhyClick}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200/60 transition-colors"
              title="Click to view calculation formula & step-by-step audit"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Why?
            </button>
          )}
        </div>

        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold font-mono text-emerald-950 tracking-tight">{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold ${trendType === 'positive' ? 'text-emerald-600' : trendType === 'negative' ? 'text-amber-600' : 'text-slate-600'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
