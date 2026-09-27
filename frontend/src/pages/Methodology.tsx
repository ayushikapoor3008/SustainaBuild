import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-800" />
          <h2 className="text-2xl font-extrabold text-emerald-950 font-['Outfit',sans-serif]">Calculation Engine Methodology &amp; Physics Equations</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          SustainaBuild AI relies on a transparent mathematical calculation engine derived from standard building thermodynamics, IS 1391 rating guidelines, NBC 2016 water standards, and published ICE life cycle carbon coefficients. Powered by EcoBuild Intelligence.
        </p>
      </div>

      {/* Accuracy Level Hierarchy */}
      <div className="eco-card p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b pb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          Data Quality &amp; Calculation Accuracy Hierarchy (Level 1–5)
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
            <strong className="text-blue-900 block font-bold">LEVEL 1: User-Provided Actual Measurements</strong>
            <p className="text-blue-800">Building geometry, floor area, occupant count, appliance list, and specific location coordinates.</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <strong className="text-emerald-900 block font-bold">LEVEL 2: Verified Location Datasets</strong>
            <p className="text-emerald-800">35+ city climate &amp; NCR regional database (monthly temperatures, rainfall, solar irradiation PSH, CDD), NBC water benchmarks, CEA grid emission factors.</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
            <strong className="text-amber-900 block font-bold">LEVEL 3: Engineering Physics Equations</strong>
            <p className="text-amber-800">Conduction heat gains (Q_wall, Q_roof, Q_win), Orifice fluid airflow equation (ACH), PV system yield equation, Rainwater catchment mass balance.</p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
            <strong className="text-purple-900 block font-bold">LEVEL 4: Published Material Coefficients</strong>
            <p className="text-purple-800">ICE (Inventory of Carbon & Energy v3.0) material embodied carbon factors, glazing U-values & SHGC.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
            <strong className="text-slate-900 block font-bold">LEVEL 5: Reasonable Assumptions</strong>
            <p className="text-slate-800">AC usage hours, average cooling load factor (0.55), 30-year lifecycle horizon.</p>
          </div>
        </div>
      </div>

      {/* Core Engineering Formulas */}
      <div className="eco-card p-6 space-y-6">
        <h3 className="font-bold text-base text-slate-900 border-b pb-2">Core Engineering Formulas</h3>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">// 1. Wall & Roof Conduction Heat Gain</span>
            <div>Q_wall = U_wall × Wall_Area × (T_outdoor - T_indoor)</div>
            <div>Q_roof = U_roof × Roof_Area × (T_outdoor - T_indoor)</div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">// 2. Window Solar Heat Gain & Air Infiltration</span>
            <div>Q_solar = SHGC × (1 - Shading_Factor) × Solar_Irradiation × Window_Area</div>
            <div>Q_infil = ρ_air × Cp_air × ACH × Volume_building × ΔT / 3600</div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">// 3. Solar PV Generation Equation</span>
            <div>E_solar = Installed_Capacity_kWp × Peak_Sun_Hours × 365 × Performance_Ratio × (1 - Shading)</div>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-1">
            <span className="text-amber-400 font-bold block">// 4. Rainwater Harvesting Catchment Equation</span>
            <div>Rainwater_Harvested (Litres) = Annual_Rainfall (m) × Catchment_Area (m²) × Runoff_Coeff × 1000</div>
          </div>
        </div>
      </div>
    </div>
  );
};
