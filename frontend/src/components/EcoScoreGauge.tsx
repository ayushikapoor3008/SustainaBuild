import React from 'react';

interface EcoScoreGaugeProps {
  score: number;
  label?: string;
  size?: number;
}

export const EcoScoreGauge: React.FC<EcoScoreGaugeProps> = ({ score, label = "Overall Eco Score", size = 180 }) => {
  // Clamped score 0 to 100
  const cleanScore = Math.min(Math.max(score, 0), 100);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (cleanScore / 100) * circumference;

  let colorClass = '#22c55e'; // Green
  let statusText = 'Excellent';
  if (cleanScore < 50) {
    colorClass = '#ef4444'; // Red
    statusText = 'Needs Improvement';
  } else if (cleanScore < 70) {
    colorClass = '#f59e0b'; // Amber
    statusText = 'Moderate Sustainability';
  } else if (cleanScore < 85) {
    colorClass = '#10b981'; // Emerald
    statusText = 'High Sustainability';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 10} className="overflow-visible">
          {/* Background Half Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        {/* Center Score Value */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-4xl font-extrabold font-mono text-emerald-950 tracking-tight">
            {cleanScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-1 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">{label}</div>
        <span className="eco-pill text-xs font-semibold" style={{ backgroundColor: `${colorClass}20`, color: colorClass, borderColor: `${colorClass}40` }}>
          ● {statusText}
        </span>
      </div>
    </div>
  );
};
