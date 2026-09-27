import React from 'react';
import type { FullProjectInput, WhatIfOptions } from '../types/ecobuild';

interface BuildingVisualizerProps {
  input: FullProjectInput;
  whatIfOptions?: WhatIfOptions;
  height?: number;
}

export const BuildingVisualizer: React.FC<BuildingVisualizerProps> = ({ input, whatIfOptions, height = 320 }) => {
  const isSolarOn = whatIfOptions?.solar_panels || input.solar.available_solar_area_m2 > 0;
  const isGreenRoofOn = whatIfOptions?.green_roof || input.green.green_roof_enabled || input.envelope.roof_type === 'Green Roof / Vegetated';
  const isReflectiveRoofOn = whatIfOptions?.reflective_roof || input.envelope.roof_type === 'Cool Roof White (High Albedo)';
  const isShadingOn = whatIfOptions?.external_shading || input.envelope.shading_device !== 'None';
  const isRainwaterOn = whatIfOptions?.rainwater_harvesting || input.water.rainwater_harvesting_enabled;
  const isLowEOn = whatIfOptions?.low_e_glass || input.envelope.glass_type.includes('Low-E');
  
  const baseTrees = input.green.existing_trees_count + input.green.proposed_trees_count;
  const extraTrees = whatIfOptions?.plant_trees ? 4 : 0;
  const totalTrees = Math.min(baseTrees + extraTrees, 8);

  const numFloors = Math.min(Math.max(input.site.num_floors, 1), 4);
  const floorHeightPx = 45;
  const bldgWidthPx = 180;
  const bldgHeightPx = numFloors * floorHeightPx;
  
  const svgWidth = 500;
  const svgHeight = height;
  const groundY = svgHeight - 50;
  const bldgX = (svgWidth - bldgWidthPx) / 2;
  const bldgY = groundY - bldgHeightPx;

  return (
    <div className="relative w-full bg-slate-900/90 rounded-2xl p-4 border border-emerald-900/50 shadow-inner overflow-hidden flex flex-col items-center">
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-xs font-mono font-medium text-emerald-300 uppercase tracking-wider">
          Interactive Architectural CAD View ({numFloors} Floors)
        </span>
      </div>

      <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full drop-shadow-lg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLowEOn ? '#38bdf8' : '#94a3b8'} stopOpacity="0.8" />
            <stop offset="100%" stopColor={isLowEOn ? '#0284c7' : '#64748b'} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <rect width={svgWidth} height={svgHeight} fill="url(#skyGrad)" rx="12" />

        <circle cx={420} cy={60} r={28} fill="#fef08a" opacity="0.85" />
        <circle cx={420} cy={60} r={36} fill="#fde047" opacity="0.3" className="animate-pulse" />

        <line x1={390} y1={75} x2={bldgX + bldgWidthPx - 20} y2={bldgY - 10} stroke="#fde047" strokeDasharray="4 4" opacity="0.4" strokeWidth="1.5" />
        <line x1={400} y1={85} x2={bldgX + 50} y2={bldgY - 10} stroke="#fde047" strokeDasharray="4 4" opacity="0.3" strokeWidth="1.5" />

        <rect x="0" y={groundY} width={svgWidth} height={50} fill="#14532d" opacity="0.9" />
        <line x1="0" y1={groundY} x2={svgWidth} y2={groundY} stroke="#22c55e" strokeWidth="3" />

        <rect
          x={bldgX}
          y={bldgY}
          width={bldgWidthPx}
          height={bldgHeightPx}
          fill="url(#wallGrad)"
          stroke="#475569"
          strokeWidth="2"
          rx="2"
        />

        {Array.from({ length: numFloors }).map((_, fIndex) => {
          const floorY = bldgY + fIndex * floorHeightPx;
          return (
            <g key={fIndex}>
              {fIndex > 0 && (
                <line x1={bldgX} y1={floorY} x2={bldgX + bldgWidthPx} y2={floorY} stroke="#94a3b8" strokeWidth="2.5" />
              )}

              {[0, 1, 2].map((wIndex) => {
                const winW = 32;
                const winH = 24;
                const winX = bldgX + 22 + wIndex * 52;
                const winY = floorY + 10;
                return (
                  <g key={wIndex}>
                    <rect
                      x={winX}
                      y={winY}
                      width={winW}
                      height={winH}
                      fill="url(#glassGrad)"
                      stroke="#334155"
                      strokeWidth="1.5"
                      rx="2"
                    />
                    <line x1={winX + 4} y1={winY + 4} x2={winX + winW - 10} y2={winY + winH - 4} stroke="#ffffff" opacity="0.4" strokeWidth="1.5" />

                    {isShadingOn && (
                      <g>
                        <rect x={winX - 4} y={winY - 4} width={winW + 8} height={4} fill="#0f172a" rx="1" />
                        <line x1={winX - 2} y1={winY} x2={winX + winW + 2} y2={winY + 5} stroke="#d97706" strokeWidth="2" />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        <rect x={bldgX + bldgWidthPx / 2 - 14} y={groundY - 32} width={28} height={32} fill="#334155" rx="1" stroke="#0f172a" strokeWidth="1.5" />

        {isGreenRoofOn ? (
          <g>
            <rect x={bldgX - 4} y={bldgY - 10} width={bldgWidthPx + 8} height={10} fill="#15803d" rx="2" />
            <path d={`M ${bldgX} ${bldgY - 10} Q ${bldgX + 30} ${bldgY - 16} ${bldgX + 60} ${bldgY - 10} T ${bldgX + 120} ${bldgY - 10} T ${bldgX + bldgWidthPx} ${bldgY - 10}`} fill="none" stroke="#22c55e" strokeWidth="3" />
          </g>
        ) : isReflectiveRoofOn ? (
          <rect x={bldgX - 4} y={bldgY - 8} width={bldgWidthPx + 8} height={8} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" rx="1" />
        ) : (
          <rect x={bldgX - 2} y={bldgY - 6} width={bldgWidthPx + 4} height={6} fill="#64748b" rx="1" />
        )}

        {isSolarOn && (
          <g>
            {[0, 1, 2, 3].map((panelIdx) => (
              <polygon
                key={panelIdx}
                points={`${bldgX + 15 + panelIdx * 38},${bldgY - 16} ${bldgX + 45 + panelIdx * 38},${bldgY - 16} ${bldgX + 40 + panelIdx * 38},${bldgY - 4} ${bldgX + 10 + panelIdx * 38},${bldgY - 4}`}
                fill="#1e3a8a"
                stroke="#60a5fa"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {isRainwaterOn && (
          <g>
            <rect x={bldgX + bldgWidthPx + 10} y={groundY - 45} width={34} height={45} fill="#0284c7" rx="4" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1={bldgX + bldgWidthPx - 5} y1={bldgY + 10} x2={bldgX + bldgWidthPx + 20} y2={groundY - 45} stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3 3" />
            <text x={bldgX + bldgWidthPx + 27} y={groundY - 20} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">H₂O</text>
          </g>
        )}

        {Array.from({ length: totalTrees }).map((_, tIdx) => {
          const isLeft = tIdx % 2 === 0;
          const offset = Math.floor(tIdx / 2) * 32;
          const treeX = isLeft ? bldgX - 35 - offset : bldgX + bldgWidthPx + 45 + offset;
          if (treeX < 20 || treeX > svgWidth - 20) return null;
          return (
            <g key={tIdx}>
              <rect x={treeX - 3} y={groundY - 35} width={6} height={35} fill="#78350f" rx="1" />
              <circle cx={treeX} cy={groundY - 45} r={18} fill="#166534" opacity="0.9" />
              <circle cx={treeX - 6} cy={groundY - 50} r={14} fill="#22c55e" opacity="0.8" />
              <circle cx={treeX + 6} cy={groundY - 48} r={12} fill="#15803d" opacity="0.85" />
            </g>
          );
        })}
      </svg>

      <div className="w-full mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
        <span className={`px-2 py-0.5 rounded border ${isSolarOn ? 'bg-blue-900/60 border-blue-400 text-blue-200' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
          ☀️ Solar PV: {isSolarOn ? 'Active' : 'Off'}
        </span>
        <span className={`px-2 py-0.5 rounded border ${isGreenRoofOn ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
          🌿 Green Roof: {isGreenRoofOn ? 'Active' : 'Off'}
        </span>
        <span className={`px-2 py-0.5 rounded border ${isShadingOn ? 'bg-amber-900/60 border-amber-400 text-amber-200' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
          🕶️ External Shading: {isShadingOn ? 'Active' : 'Off'}
        </span>
        <span className={`px-2 py-0.5 rounded border ${isRainwaterOn ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200' : 'bg-slate-800/40 border-slate-700 text-slate-500'}`}>
          🌧️ Rainwater Tank: {isRainwaterOn ? 'Active' : 'Off'}
        </span>
        <span className="px-2 py-0.5 rounded border bg-slate-800/60 border-slate-700 text-slate-300">
          🌳 Trees: {totalTrees}
        </span>
      </div>
    </div>
  );
};
