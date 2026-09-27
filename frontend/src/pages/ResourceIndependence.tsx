import React, { useState } from 'react';
import {
  BarChart3, Zap, Droplets, Trash2, Trees, Sun, Leaf,
  TrendingUp, IndianRupee, Wind, Info
} from 'lucide-react';
import type { AnalysisResult, FullProjectInput, ResourceCircularityResult } from '../types/ecobuild';

// Local resource circularity fallback
function localResourceCircularity(
  energyIndependence: number, waterIndependence: number,
  wasteDiversion: number, greenCoverage: number, recommendedGreen: number,
  solarCoverage: number, co2Avoided: number, waterSaved: number, energyDemand: number
): ResourceCircularityResult {
  const energyScore = Math.min(100, energyIndependence);
  const waterScore = Math.min(100, waterIndependence);
  const wasteScore = Math.min(100, wasteDiversion);
  const greenScore = Math.min(100, (greenCoverage / Math.max(recommendedGreen, 1)) * 100);

  const total = energyScore * 0.30 + waterScore * 0.30 + wasteScore * 0.20 + greenScore * 0.20;
  const score = Math.min(100, Math.max(0, total));

  let grade = 'D', gradeLabel = 'Low Resource Circularity', gradeColor = '#ef4444';
  if (score >= 85) { grade = 'A+'; gradeLabel = 'Excellent Resource Circularity'; gradeColor = '#059669'; }
  else if (score >= 70) { grade = 'A'; gradeLabel = 'Very Good Resource Circularity'; gradeColor = '#10b981'; }
  else if (score >= 55) { grade = 'B'; gradeLabel = 'Good Resource Circularity'; gradeColor = '#84cc16'; }
  else if (score >= 40) { grade = 'C'; gradeLabel = 'Moderate Resource Circularity'; gradeColor = '#f59e0b'; }

  const electricitySavings = energyDemand * (energyIndependence / 100) * 8;
  const waterSavingsINR = (waterSaved / 1000) * 45;

  return {
    resource_circularity_score: Math.round(score * 10) / 10,
    grade, grade_label: gradeLabel, grade_color: gradeColor,
    breakdown: [
      { dimension: 'Energy Independence', weight_pct: 30, score: Math.round(energyScore * 10) / 10, contribution: Math.round(energyScore * 0.30 * 10) / 10, description: `${energyIndependence.toFixed(0)}% of demand covered by renewables`, color: '#f59e0b' },
      { dimension: 'Water Independence', weight_pct: 30, score: Math.round(waterScore * 10) / 10, contribution: Math.round(waterScore * 0.30 * 10) / 10, description: `${waterIndependence.toFixed(0)}% of demand from reuse/harvesting`, color: '#3b82f6' },
      { dimension: 'Waste Circularity', weight_pct: 20, score: Math.round(wasteScore * 10) / 10, contribution: Math.round(wasteScore * 0.20 * 10) / 10, description: `${wasteDiversion.toFixed(0)}% waste diverted from landfill`, color: '#84cc16' },
      { dimension: 'Green Coverage', weight_pct: 20, score: Math.round(greenScore * 10) / 10, contribution: Math.round(greenScore * 0.20 * 10) / 10, description: `${greenCoverage.toFixed(0)}% vs ${recommendedGreen.toFixed(0)}% recommended`, color: '#10b981' },
    ],
    energy_independence_pct: energyIndependence, water_independence_pct: waterIndependence,
    waste_diversion_pct: wasteDiversion, green_coverage_pct: greenCoverage,
    renewable_energy_coverage_pct: solarCoverage,
    grid_dependency_pct: Math.max(0, 100 - energyIndependence),
    estimated_co2_reduction_tons_yr: co2Avoided,
    electricity_savings_inr_yr: Math.round(electricitySavings),
    water_savings_inr_yr: Math.round(waterSavingsINR),
    total_annual_savings_inr: Math.round(electricitySavings + waterSavingsINR),
    methodology: {
      name: 'SustainaBuild Resource Circularity Score',
      weights: { 'Energy Independence': '30%', 'Water Independence': '30%', 'Waste Circularity': '20%', 'Green Coverage': '20%' }
    },
    disclaimer: 'Resource Circularity Score is an internal planning metric, not a government-certified rating.'
  };
}

// ── Circular Resource Flow Diagram ────────────────────────────────────────────
const FlowDiagram: React.FC<{ solarKwh: number; rainwaterL: number; greywaterL: number; compostKg: number }> = ({
  solarKwh, rainwaterL, greywaterL, compostKg
}) => (
  <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-5 text-white overflow-x-auto">
    <h3 className="text-sm font-bold mb-4 text-emerald-300 flex items-center gap-2">
      <Wind className="w-4 h-4" /> Circular Resource Flow
    </h3>
    <svg viewBox="0 0 640 280" className="w-full min-w-[400px]">
      {/* Flow 1: Solar → Electricity */}
      <g>
        <rect x="10" y="20" width="120" height="50" rx="10" fill="#fde68a" fillOpacity="0.9" />
        <text x="70" y="41" textAnchor="middle" fontSize="10" fill="#78350f" fontWeight="bold">☀️ Solar PV</text>
        <text x="70" y="56" textAnchor="middle" fontSize="9" fill="#92400e">{solarKwh > 0 ? `${(solarKwh / 1000).toFixed(1)} MWh/yr` : 'Not installed'}</text>
        <line x1="130" y1="45" x2="170" y2="45" stroke="#fde68a" strokeWidth="2.5" markerEnd="url(#ya)" />
        <rect x="172" y="20" width="110" height="50" rx="10" fill="#6366f1" fillOpacity="0.9" />
        <text x="227" y="41" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">⚡ Electricity</text>
        <text x="227" y="56" textAnchor="middle" fontSize="9" fill="#c7d2fe">Building Use</text>
        <text x="150" y="40" textAnchor="middle" fontSize="8" fill="#fde68a">→</text>
      </g>

      {/* Flow 2: Rain → Harvest → Reuse */}
      <g>
        <rect x="10" y="100" width="120" height="50" rx="10" fill="#7dd3fc" fillOpacity="0.9" />
        <text x="70" y="121" textAnchor="middle" fontSize="10" fill="#0c4a6e" fontWeight="bold">🌧️ Rainfall</text>
        <text x="70" y="136" textAnchor="middle" fontSize="9" fill="#0369a1">{rainwaterL > 0 ? `${(rainwaterL / 1000).toFixed(0)} kL/yr` : 'Calc needed'}</text>
        <line x1="130" y1="125" x2="170" y2="125" stroke="#7dd3fc" strokeWidth="2.5" />
        <rect x="172" y="100" width="110" height="50" rx="10" fill="#0ea5e9" fillOpacity="0.9" />
        <text x="227" y="121" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">💧 Harvesting</text>
        <text x="227" y="136" textAnchor="middle" fontSize="9" fill="#bae6fd">Tank Storage</text>
        <line x1="282" y1="125" x2="320" y2="125" stroke="#7dd3fc" strokeWidth="2.5" />
        <rect x="322" y="100" width="110" height="50" rx="10" fill="#0284c7" fillOpacity="0.9" />
        <text x="377" y="121" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">🪣 Water Reuse</text>
        <text x="377" y="136" textAnchor="middle" fontSize="9" fill="#bae6fd">Flush / Landscape</text>
      </g>

      {/* Flow 3: Wastewater → STP → Reuse */}
      <g>
        <rect x="172" y="175" width="120" height="50" rx="10" fill="#a78bfa" fillOpacity="0.9" />
        <text x="232" y="196" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">🏗️ Greywater</text>
        <text x="232" y="211" textAnchor="middle" fontSize="9" fill="#ede9fe">{greywaterL > 0 ? `${(greywaterL / 1000).toFixed(0)} kL/yr` : 'Not enabled'}</text>
        <line x1="292" y1="200" x2="320" y2="200" stroke="#a78bfa" strokeWidth="2.5" />
        <rect x="322" y="175" width="110" height="50" rx="10" fill="#7c3aed" fillOpacity="0.9" />
        <text x="377" y="196" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">♻️ Treatment</text>
        <text x="377" y="211" textAnchor="middle" fontSize="9" fill="#ede9fe">Recycled Water</text>
      </g>

      {/* Flow 4: Organic Waste → Compost → Landscape */}
      <g>
        <rect x="450" y="100" width="120" height="50" rx="10" fill="#4ade80" fillOpacity="0.9" />
        <text x="510" y="121" textAnchor="middle" fontSize="10" fill="#14532d" fontWeight="bold">🗑️ Organic Waste</text>
        <text x="510" y="136" textAnchor="middle" fontSize="9" fill="#166534">{compostKg > 0 ? `${compostKg.toFixed(0)} kg/yr` : 'Calc needed'}</text>
        <line x1="510" y1="150" x2="510" y2="170" stroke="#4ade80" strokeWidth="2.5" />
        <rect x="450" y="172" width="120" height="50" rx="10" fill="#16a34a" fillOpacity="0.9" />
        <text x="510" y="193" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">🌱 Compost</text>
        <text x="510" y="208" textAnchor="middle" fontSize="9" fill="#bbf7d0">→ Landscape Soil</text>
      </g>

      {/* Arrow marker */}
      <defs>
        <marker id="ya" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#fde68a" />
        </marker>
      </defs>

      <text x="320" y="272" textAnchor="middle" fontSize="8" fill="#6b7280" fontStyle="italic">
        Flow diagram updates with building inputs — Values are estimates
      </text>
    </svg>
    <p className="text-xs text-emerald-400 mt-2 text-center">Text summary: Solar → Electricity → Building | Rain → Tank → Flush/Landscape | Greywater → Treatment → Reuse | Organic Waste → Compost → Landscape</p>
  </div>
);

// ── Gauge Component ───────────────────────────────────────────────────────────
const Gauge: React.FC<{ value: number; label: string; unit?: string; color: string; icon: React.ReactNode }> = ({ value, label, unit = '%', color, icon }) => {
  const clampedVal = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * 36;
  const dash = (clampedVal / 100) * circumference;

  return (
    <div className="eco-card p-4 flex flex-col items-center text-center">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r="36" fill="none" stroke="#e2e8f0" strokeWidth="7" />
        <circle cx="45" cy="45" r="36" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round"
          transform="rotate(-90 45 45)" strokeDashoffset="0" />
        <text x="45" y="50" textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{Math.round(clampedVal)}</text>
      </svg>
      <div className="flex items-center gap-1 mt-2 mb-0.5">
        <span style={{ color }}>{icon}</span>
        <p className="text-xs font-bold text-slate-700">{label}</p>
      </div>
      <p className="text-[11px] text-slate-400">{unit}</p>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
interface ResourceIndependenceProps {
  analysis: AnalysisResult;
  input: FullProjectInput;
}

export const ResourceIndependence: React.FC<ResourceIndependenceProps> = ({ analysis, input }) => {
  const [greyEnabled, setGreyEnabled] = useState(input.water.greywater_reuse_enabled);
  const [stpEnabled, setStpEnabled] = useState(false);
  const [composting, setComposting] = useState(true);
  const [recycling, setRecycling] = useState(true);

  // Derive metrics from existing analysis
  const solarCoverage = analysis.solar.solar_coverage_pct;
  const co2Avoided = analysis.solar.annual_co2_avoided_tons;
  const energyIndependence = Math.min(100, solarCoverage + (stpEnabled ? 5 : 0));
  const waterReduction = analysis.water.fresh_water_reduction_pct;
  const waterIndependence = Math.min(100, waterReduction + (greyEnabled ? 15 : 0) + (stpEnabled ? 10 : 0));
  const wasteDiversion = (composting ? 40 : 0) + (recycling ? 35 : 0);
  const greenCoverage = analysis.green.green_coverage_pct;
  const recommendedGreen = analysis.green.recommended_green_pct;

  // Water saved
  const waterSavedL = analysis.water.rainwater_harvested_litres + analysis.water.greywater_reused_litres;

  // Waste (derived)
  const occupants = input.envelope.num_occupants;
  const organicKgYr = occupants * 0.22 * 365;
  const compostKgYr = composting ? organicKgYr * 0.30 : 0;

  const circularity = localResourceCircularity(
    energyIndependence, waterIndependence, wasteDiversion,
    greenCoverage, recommendedGreen, solarCoverage,
    co2Avoided, waterSavedL, analysis.energy.total_annual_kwh
  );

  const ToggleCard = ({ label, enabled, onChange, color }: { label: string; enabled: boolean; onChange: () => void; color: string }) => (
    <button onClick={onChange}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${enabled ? `border-transparent text-white` : 'border-slate-200 text-slate-500 bg-white'}`}
      style={{ backgroundColor: enabled ? color : undefined }}>
      <span>{enabled ? '●' : '○'}</span> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-900 flex items-center justify-center shadow-lg shrink-0">
          <BarChart3 className="w-6 h-6 text-teal-200" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">Resource Independence Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track energy, water, waste, and green circularity. Powered by EcoBuild AI engine.</p>
        </div>
      </div>

      {/* Scenario toggles */}
      <div className="eco-card p-4">
        <p className="text-xs font-bold text-slate-600 mb-3">Scenario Adjustments (What-If)</p>
        <div className="flex flex-wrap gap-2">
          <ToggleCard label="Greywater Recycling" enabled={greyEnabled} onChange={() => setGreyEnabled(!greyEnabled)} color="#3b82f6" />
          <ToggleCard label="STP Reuse" enabled={stpEnabled} onChange={() => setStpEnabled(!stpEnabled)} color="#7c3aed" />
          <ToggleCard label="Composting" enabled={composting} onChange={() => setComposting(!composting)} color="#16a34a" />
          <ToggleCard label="Waste Recycling" enabled={recycling} onChange={() => setRecycling(!recycling)} color="#84cc16" />
        </div>
      </div>

      {/* Resource Circularity Score */}
      <div className="eco-card p-6" style={{ background: `linear-gradient(135deg, ${circularity.grade_color}15, white)`, borderColor: `${circularity.grade_color}40` }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Resource Circularity Score</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-black" style={{ color: circularity.grade_color }}>{circularity.resource_circularity_score}</span>
              <div>
                <span className="text-2xl font-extrabold px-3 py-1 rounded-xl text-white font-['Outfit',sans-serif]" style={{ backgroundColor: circularity.grade_color }}>
                  Grade {circularity.grade}
                </span>
                <p className="text-xs text-slate-500 mt-1">{circularity.grade_label}</p>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 max-w-xs">
            <p className="font-bold text-slate-600 mb-1">Score Methodology (Transparent)</p>
            <div className="space-y-0.5">
              {circularity.breakdown.map(b => (
                <div key={b.dimension} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                  <span>{b.dimension}: <strong>{b.weight_pct}%</strong> weight → {b.contribution.toFixed(1)} pts</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] italic text-amber-700 bg-amber-50 p-1.5 rounded">{circularity.disclaimer}</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${circularity.resource_circularity_score}%`, backgroundColor: circularity.grade_color }} />
        </div>
      </div>

      {/* Independence Gauges */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3">Independence Indicators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Gauge value={energyIndependence} label="Energy Independence" color="#f59e0b" icon={<Zap className="w-3.5 h-3.5" />} />
          <Gauge value={waterIndependence} label="Water Independence" color="#3b82f6" icon={<Droplets className="w-3.5 h-3.5" />} />
          <Gauge value={solarCoverage} label="Renewable Energy" color="#f97316" icon={<Sun className="w-3.5 h-3.5" />} />
          <Gauge value={Math.min(100, (waterSavedL / Math.max(analysis.water.annual_demand_litres, 1)) * 100)} label="Water Reuse" color="#06b6d4" icon={<Leaf className="w-3.5 h-3.5" />} />
          <Gauge value={wasteDiversion} label="Waste Recovery" color="#84cc16" icon={<Trash2 className="w-3.5 h-3.5" />} />
          <Gauge value={greenCoverage} label="Green Coverage" color="#10b981" icon={<Trees className="w-3.5 h-3.5" />} />
        </div>
      </div>

      {/* Savings summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="eco-card p-4 border-l-4 border-amber-400">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-bold text-slate-600">Estimated Annual Savings</p>
          </div>
          <p className="text-2xl font-extrabold text-amber-700">₹{circularity.total_annual_savings_inr.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400">Electricity + Water savings combined</p>
        </div>
        <div className="eco-card p-4 border-l-4 border-emerald-400">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-bold text-slate-600">CO₂ Reduction</p>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{circularity.estimated_co2_reduction_tons_yr.toFixed(2)} t</p>
          <p className="text-xs text-slate-400">Tonnes of CO₂ avoided per year</p>
        </div>
        <div className="eco-card p-4 border-l-4 border-blue-400">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-bold text-slate-600">Grid Dependency</p>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{circularity.grid_dependency_pct.toFixed(0)}%</p>
          <p className="text-xs text-slate-400">Remaining grid electricity need</p>
        </div>
      </div>

      {/* Circular flow diagram */}
      <FlowDiagram
        solarKwh={analysis.solar.annual_generation_kwh}
        rainwaterL={analysis.water.rainwater_harvested_litres}
        greywaterL={greyEnabled ? analysis.water.greywater_generated_litres * 0.7 : 0}
        compostKg={compostKgYr}
      />

      {/* Dimension breakdown */}
      <div className="eco-card p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Resource Circularity Score Breakdown</h3>
        <div className="space-y-3">
          {circularity.breakdown.map(b => (
            <div key={b.dimension}>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="font-semibold text-slate-700">{b.dimension}</span>
                  <span className="text-slate-400">({b.weight_pct}% weight)</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold" style={{ color: b.color }}>{b.score.toFixed(0)}/100</span>
                  <span className="text-slate-400">→ {b.contribution.toFixed(1)} pts</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${b.score}%`, backgroundColor: b.color }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-500">
          <p className="font-bold text-slate-600 mb-1">Data Quality Note</p>
          <p>All metrics are engineering estimates based on the EcoBuild AI physics engine. Energy independence is derived from solar coverage. Water independence combines rainwater harvesting and greywater reuse. Waste diversion is estimated from national per-capita averages (CPHEEO). Annual savings use ₹8/kWh electricity and ₹45/kL water tariff assumptions. All values are for planning purposes only.</p>
        </div>
      </div>
    </div>
  );
};
