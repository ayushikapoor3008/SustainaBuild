import React, { useState } from 'react';
import {
  Zap, Droplets, Sun, Lightbulb, ArrowRight, Sparkles,
  Scale, Building, BarChart3, Leaf, Trees
} from 'lucide-react';
import type { AnalysisResult, FullProjectInput } from '../types/ecobuild';
import { EcoScoreGauge } from '../components/EcoScoreGauge';
import { KpiCard } from '../components/KpiCard';
import { BuildingVisualizer } from '../components/BuildingVisualizer';
import { SiteMap } from '../components/SiteMap';
import { FormulaModal } from '../components/FormulaModal';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

interface DashboardProps {
  analysis: AnalysisResult;
  input: FullProjectInput;
  onNavigate: (tab: string) => void;
  onRunDemoMode: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analysis,
  input,
  onNavigate,
  onRunDemoMode
}) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);
  const [formulaTitle, setFormulaTitle] = useState<string>('');

  const openFormula = (key: string, title: string) => {
    setSelectedFormulaKey(key);
    setFormulaTitle(title);
  };

  const monthlyData = (analysis.energy.monthly_energy_kwh || []).map((energyVal, idx) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx],
    Energy: energyVal,
    Solar: analysis.solar.monthly_generation_kwh?.[idx] || 0,
    WaterDemand: Math.round(analysis.water.monthly_water_demand_litres?.[idx] / 1000) || 0,
    Rainwater: Math.round(analysis.water.monthly_rainwater_litres?.[idx] / 1000) || 0,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="eco-card p-6 md:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="eco-pill bg-emerald-800/90 text-emerald-300 border border-emerald-700/80 text-xs font-semibold">
                Active Project: {analysis.project_name} ({analysis.city})
              </span>
              <span className="eco-pill bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                Physics Confidence: {analysis.confidence.model_confidence_pct}%
              </span>
              <span className="eco-pill bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-xs font-semibold">
                SustainaBuild AI
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-['Outfit',sans-serif]">
              Design Better. Build Greener. Manage Resources Smarter.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Analyse sustainable architecture, renewable energy, water circularity, greenery, and preliminary location-based compliance considerations in one integrated platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('new-analysis')}
              className="eco-btn-primary bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 text-xs shadow-lg flex items-center gap-1.5"
            >
              Analyze Building
            </button>
            <button
              onClick={() => onNavigate('multistorey')}
              className="eco-btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5"
            >
              Multi-Storey CAD
            </button>
            <button
              onClick={onRunDemoMode}
              className="eco-btn-secondary bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40 px-3.5 py-2.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Try Demo
            </button>
          </div>
        </div>
      </div>

      {/* Top Metric Cards & Eco Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="eco-card p-4 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-emerald-50/40">
          <EcoScoreGauge score={analysis.eco_scores.overall_eco_score} label="Overall Eco Score" size={170} />
          <div className="w-full mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 text-center text-[11px] font-semibold text-slate-600">
            <div>
              <span className="block text-emerald-900 font-mono font-bold">{analysis.eco_scores.energy_score}</span>
              <span className="text-[10px] text-slate-400">Energy</span>
            </div>
            <div>
              <span className="block text-emerald-900 font-mono font-bold">{analysis.eco_scores.water_score}</span>
              <span className="text-[10px] text-slate-400">Water</span>
            </div>
            <div>
              <span className="block text-emerald-900 font-mono font-bold">{analysis.eco_scores.solar_score}</span>
              <span className="text-[10px] text-slate-400">Solar</span>
            </div>
          </div>
        </div>

        <KpiCard
          title="Annual Energy Consumption"
          value={analysis.energy.total_annual_kwh.toLocaleString()}
          unit="kWh/yr"
          subtitle={`EUI: ${analysis.energy.energy_use_intensity_eui} kWh/m²/yr`}
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          trend="Calculated"
          trendType="neutral"
          onWhyClick={() => openFormula('energy_use_intensity', 'Annual Energy & EUI Calculation')}
        />

        <KpiCard
          title="Solar Generation Potential"
          value={analysis.solar.annual_generation_kwh.toLocaleString()}
          unit="kWh/yr"
          subtitle={`Solar Coverage: ${analysis.solar.solar_coverage_pct}%`}
          icon={<Sun className="w-5 h-5 text-yellow-600" />}
          trend={`${analysis.solar.panel_count} Panels`}
          trendType="positive"
          onWhyClick={() => openFormula('solar_generation', 'Solar Generation Formula')}
        />

        <KpiCard
          title="Annual Water Demand"
          value={analysis.water.annual_demand_litres.toLocaleString()}
          unit="Litres/yr"
          subtitle={`Fresh Water Reduction: ${analysis.water.fresh_water_reduction_pct}%`}
          icon={<Droplets className="w-5 h-5 text-blue-600" />}
          trend={`${Math.round(analysis.water.rainwater_harvested_litres).toLocaleString()} L Harvested`}
          trendType="positive"
          onWhyClick={() => openFormula('rainwater_harvesting', 'Rainwater Catchment Formula')}
        />
      </div>

      {/* Sustainability Intelligence Hub — Key Modules Overview */}
      <div className="eco-card p-6 bg-gradient-to-b from-white to-emerald-50/20 border border-emerald-900/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-emerald-950 flex items-center gap-2 font-['Outfit',sans-serif]">
              <Leaf className="w-5 h-5 text-emerald-600" />
              SustainaBuild Core Modules &amp; Resource Hub
            </h3>
            <p className="text-xs text-slate-500">Physics-based decision support, multi-storey CAD massing, and preliminary statutory checks.</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
            6 Integrated Engines
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: Renewable Resources */}
          <div
            onClick={() => onNavigate('solar-analysis')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {analysis.solar.solar_coverage_pct}% Solar Yield
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Renewable Resources &amp; Solar PV
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Rooftop PV generation ({analysis.solar.annual_generation_kwh.toLocaleString()} kWh/yr), battery backup sizing, and grid independence estimates.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Explore Solar &amp; Battery</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: Water Circularity */}
          <div
            onClick={() => onNavigate('water-analysis')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                {analysis.water.fresh_water_reduction_pct}% Fresh Saved
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Water Circularity &amp; Rainwater
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Rooftop catchment mass balance, greywater dual-plumbing reuse, and preliminary STP sizing.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Explore Water Engine</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Green Coverage */}
          <div
            onClick={() => onNavigate('green-analysis')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Trees className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {analysis.green.green_coverage_pct}% vs {analysis.green.recommended_green_pct}% Rec
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Green Coverage &amp; Landscape
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Canopy shading, green roof recommendations ({analysis.green.green_roof_recommendation_m2} m²), and heat-island microclimate mitigation.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Explore Green Cover</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 4: Multi-Storey CAD Planner */}
          <div
            onClick={() => onNavigate('multistorey')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                CAD 2D / 3D
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Multi-Storey Architectural Planner
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Floor-by-floor layout, setbacks, parking, RWH tanks, lift cores, and conceptual 3D massing.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Open Floor Planner</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 5: Legal & Preliminary Compliance */}
          <div
            onClick={() => onNavigate('compliance')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                PASS / WARN Check
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Preliminary Statutory Compliance
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Verified checks against DDA, NOIDA, GMDA, BMC, BBMP building bye-laws for FAR, setbacks, and height.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Check Compliance</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 6: Resource Independence */}
          <div
            onClick={() => onNavigate('resource-independence')}
            className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Circularity Flow
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
              Resource Independence &amp; Circularity
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2">
              Complete mass flow of energy, water, organic waste composting, and CO₂ offset circularity score.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>View Resource Flow</span> <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CAD Building Visualization & Site Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-emerald-950">2D/3D Architectural CAD View</h3>
            <button
              onClick={() => onNavigate('simulator')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 flex items-center gap-1"
            >
              Modify in Simulator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <BuildingVisualizer input={input} height={340} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-emerald-950">Site & Microclimate Intelligence</h3>
            <button
              onClick={() => onNavigate('site-climate')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-950 flex items-center gap-1"
            >
              Explore Climate Data <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SiteMap project={input.project} climateZone={analysis.city} />
        </div>
      </div>

      {/* Performance Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Energy Load vs Solar Generation</h3>
              <p className="text-xs text-slate-500">Comparison of electrical demand (kWh) and rooftop solar yield</p>
            </div>
            <span className="eco-pill bg-amber-50 text-amber-900 border border-amber-200 text-xs">
              ⚡ kWh/Month
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="Energy" fill="#1b3b2b" name="Building Load (kWh)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Solar" fill="#f59e0b" name="Solar Generation (kWh)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Water Mass Balance</h3>
              <p className="text-xs text-slate-500">Monthly water demand vs rooftop rainwater yield (kL)</p>
            </div>
            <span className="eco-pill bg-blue-50 text-blue-900 border border-blue-200 text-xs">
              💧 kilolitres (kL)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="WaterDemand" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} name="Water Demand (kL)" />
                <Area type="monotone" dataKey="Rainwater" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="Rainwater Harvested (kL)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Recommendations Section */}
      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-base text-emerald-950">Improve Your Design</h3>
            </div>
            <p className="text-xs text-slate-500">Top calculation-derived recommendations based on identified thermal & water efficiency gaps.</p>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="eco-btn-secondary text-xs px-3.5 py-1.5"
          >
            View All Recommendations
          </button>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.slice(0, 5).map((rec, idx) => (
            <div key={rec.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-100/80 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{rec.title}</h4>
                  <span className={`eco-pill text-[10px] ${rec.impact === 'High' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-200 text-slate-800'}`}>
                    Impact: {rec.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7">{rec.why}</p>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0 pl-7 md:pl-0">
                <div className="text-right">
                  <span className="block text-slate-400 font-medium">Est. Cost:</span>
                  <span className="font-bold font-mono text-slate-800">₹{(rec.estimated_cost_inr / 1000).toFixed(0)}k</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-400 font-medium">Payback:</span>
                  <span className="font-bold font-mono text-emerald-800">{rec.payback_years} yrs</span>
                </div>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="eco-btn-primary text-xs px-3 py-1.5"
                >
                  Test Option
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title={formulaTitle}
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
