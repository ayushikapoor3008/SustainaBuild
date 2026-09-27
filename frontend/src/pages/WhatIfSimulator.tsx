import React, { useState, useEffect } from 'react';
import { Sliders, IndianRupee, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { FullProjectInput, WhatIfOptions, AnalysisResult } from '../types/ecobuild';
import { simulateWhatIf } from '../services/api';
import { BuildingVisualizer } from '../components/BuildingVisualizer';

interface WhatIfSimulatorProps {
  input: FullProjectInput;
  baselineAnalysis: AnalysisResult;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ input, baselineAnalysis }) => {
  const [options, setOptions] = useState<WhatIfOptions>({
    solar_panels: false,
    battery_storage: false,
    green_roof: false,
    plant_trees: false,
    vertical_garden: false,
    permeable_paving: false,
    external_shading: false,
    natural_ventilation: false,
    reflective_roof: false,
    led_lighting: false,
    rainwater_harvesting: false,
    greywater_reuse: false,
    stp_reuse: false,
    composting: false,
    low_e_glass: false,
    roof_insulation: false,
    wall_insulation: false,
    increase_green_area: false,
    change_orientation: false
  });

  const [simResult, setSimResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleItems: { key: keyof WhatIfOptions; label: string; icon: string; costEst: string; category: string }[] = [
    { key: 'solar_panels', label: 'Rooftop Solar PV System', icon: '☀️', costEst: '₹1.80 L', category: 'Renewables' },
    { key: 'battery_storage', label: '10 kWh LiFePO4 Battery Storage', icon: '🔋', costEst: '₹90 k', category: 'Renewables' },
    { key: 'green_roof', label: 'Green Vegetated Roof', icon: '🌿', costEst: '₹75 k', category: 'Greenery' },
    { key: 'plant_trees', label: 'Plant Urban Canopy Trees (+6)', icon: '🌳', costEst: '₹9 k', category: 'Greenery' },
    { key: 'vertical_garden', label: 'Living Vertical Green Wall (30m²)', icon: '🌱', costEst: '₹35 k', category: 'Greenery' },
    { key: 'permeable_paving', label: 'Permeable Eco-Paving (+30%)', icon: '🧱', costEst: '₹18 k', category: 'Greenery' },
    { key: 'external_shading', label: 'External Shading & Louvers', icon: '🕶️', costEst: '₹25 k', category: 'Envelope' },
    { key: 'natural_ventilation', label: 'Enable Cross Ventilation', icon: '🍃', costEst: '₹0', category: 'Passive' },
    { key: 'reflective_roof', label: 'High-Albedo Cool Roof Coating', icon: '🎨', costEst: '₹15 k', category: 'Envelope' },
    { key: 'led_lighting', label: 'Smart High-Efficiency LED (3 W/m²)', icon: '💡', costEst: '₹12 k', category: 'Energy' },
    { key: 'rainwater_harvesting', label: 'Rainwater Catchment & 8,000L Tank', icon: '🌧️', costEst: '₹45 k', category: 'Water' },
    { key: 'greywater_reuse', label: 'On-Site Greywater Recycling', icon: '♻️', costEst: '₹65 k', category: 'Water' },
    { key: 'stp_reuse', label: 'Tertiary STP Recycled Water Loop', icon: '🚰', costEst: '₹85 k', category: 'Water' },
    { key: 'composting', label: 'On-Site Organic Composting Unit', icon: '🍂', costEst: '₹10 k', category: 'Waste' },
    { key: 'low_e_glass', label: 'High-Perf Low-E Double Glazing', icon: '🪟', costEst: '₹55 k', category: 'Envelope' },
    { key: 'roof_insulation', label: '10cm XPS Roof Thermal Insulation', icon: '🧱', costEst: '₹30 k', category: 'Envelope' },
    { key: 'wall_insulation', label: 'AAC Wall Cavity Insulation', icon: '🏛️', costEst: '₹40 k', category: 'Envelope' },
    { key: 'increase_green_area', label: 'Expand Lawn & Garden (+40m²)', icon: '🌱', costEst: '₹20 k', category: 'Greenery' },
    { key: 'change_orientation', label: 'North-South Optimal Azimuth (0°)', icon: '🧭', costEst: '₹0', category: 'Passive' },
  ];

  const handleToggle = (key: keyof WhatIfOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    simulateWhatIf(input, options).then(res => {
      if (isMounted) {
        setSimResult(res);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [input, options]);

  const simResultAnalysis: AnalysisResult = simResult?.simulated || baselineAnalysis;
  const deltas = simResult?.deltas || {
    eco_score_delta: 0,
    energy_saved_kwh: 0,
    water_saved_litres: 0,
    solar_generated_kwh: 0,
    co2_reduced_tons: 0,
    green_coverage_delta: 0,
    annual_monetary_savings_inr: 0,
    additional_investment_inr: 0,
    payback_years: 0
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">What-If Architecture Simulator</h2>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
              Live Dynamic Recalculation Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Toggle design interventions to instantly see before-vs-after performance deltas and simple financial payback.</p>
        </div>

        <button
          onClick={() => setOptions({
            solar_panels: false, battery_storage: false, green_roof: false, plant_trees: false,
            vertical_garden: false, permeable_paving: false, external_shading: false,
            natural_ventilation: false, reflective_roof: false, led_lighting: false,
            rainwater_harvesting: false, greywater_reuse: false, stp_reuse: false, composting: false,
            low_e_glass: false, roof_insulation: false, wall_insulation: false,
            increase_green_area: false, change_orientation: false
          })}
          className="eco-btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All Toggles
        </button>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 13 Interactive Toggles */}
        <div className="eco-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" />
              Sustainability Interventions (13)
            </h3>
            <span className="text-[11px] font-mono font-bold text-emerald-800">
              {Object.values(options).filter(Boolean).length} Active
            </span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {toggleItems.map((item) => {
              const active = options[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all text-xs font-semibold ${
                    active
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm'
                      : 'bg-slate-50/70 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <span className="block leading-tight">{item.label}</span>
                      <span className={`text-[10px] font-normal ${active ? 'text-emerald-200' : 'text-slate-500'}`}>
                        Est. Cost: {item.costEst}
                      </span>
                    </div>
                  </div>

                  {active ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Building Visualization & BEFORE vs AFTER Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dynamic Building Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Interactive CAD Visualizer (Updates in Real-Time)</span>
              {isLoading && <span className="text-emerald-600 animate-pulse">Recalculating Physics Model...</span>}
            </div>
            <BuildingVisualizer input={input} whatIfOptions={options} height={280} />
          </div>

          {/* BEFORE vs AFTER Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BASELINE (BEFORE) */}
            <div className="eco-card p-5 bg-slate-50/60 border-slate-200">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  BEFORE (Baseline Design)
                </span>
                <span className="eco-pill bg-slate-200 text-slate-800 text-[10px]">Baseline</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Overall Eco Score:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{baselineAnalysis.eco_scores.overall_eco_score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Annual Energy (kWh):</span>
                  <span className="font-mono font-bold text-slate-900">{baselineAnalysis.energy.total_annual_kwh.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Annual Water Demand:</span>
                  <span className="font-mono font-bold text-slate-900">{baselineAnalysis.water.annual_demand_litres.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Solar Generation:</span>
                  <span className="font-mono font-bold text-slate-900">{baselineAnalysis.solar.annual_generation_kwh.toLocaleString()} kWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Annual CO₂ Emissions:</span>
                  <span className="font-mono font-bold text-slate-900">{baselineAnalysis.carbon.operational_co2_annual_tons} Tons</span>
                </div>
              </div>
            </div>

            {/* SIMULATED (AFTER) */}
            <div className="eco-card p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white border-emerald-700 shadow-lg">
              <div className="flex items-center justify-between mb-3 border-b border-emerald-800/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  AFTER (With Selected Options)
                </span>
                <span className="eco-pill bg-emerald-500 text-emerald-950 font-bold text-[10px]">Simulated</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Overall Eco Score:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-200 text-base">
                    <span>{simResultAnalysis.eco_scores.overall_eco_score}</span>
                    {deltas.eco_score_delta > 0 && (
                      <span className="text-[11px] text-emerald-400 font-normal">(+{deltas.eco_score_delta})</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Annual Energy (kWh):</span>
                  <span className="font-mono font-bold text-emerald-200">{simResultAnalysis.energy.total_annual_kwh.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Annual Water Demand:</span>
                  <span className="font-mono font-bold text-emerald-200">{simResultAnalysis.water.annual_demand_litres.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Solar Generation:</span>
                  <span className="font-mono font-bold text-amber-300">{simResultAnalysis.solar.annual_generation_kwh.toLocaleString()} kWh</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Annual CO₂ Emissions:</span>
                  <span className="font-mono font-bold text-emerald-200">{simResultAnalysis.carbon.operational_co2_annual_tons} Tons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Payback Timeline Bar */}
          <div className="eco-card p-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50 border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-700" />
              Financial & Payback Period Calculation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Additional Investment</span>
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  ₹{(deltas.additional_investment_inr / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Est. Annual Monetary Savings</span>
                <span className="text-xl font-extrabold font-mono text-emerald-700">
                  ₹{(deltas.annual_monetary_savings_inr / 1000).toFixed(1)}k / yr
                </span>
              </div>

              <div className="p-3 bg-emerald-950 text-white rounded-xl border border-emerald-800">
                <span className="text-[11px] font-semibold text-emerald-300 block uppercase">Simple Payback Period</span>
                <span className="text-xl font-extrabold font-mono text-emerald-200">
                  {deltas.payback_years > 0 ? `${deltas.payback_years} Years` : 'Immediate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
