import React, { useState } from 'react';
import { Zap, Layers, Flame } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { FormulaModal } from '../components/FormulaModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface EnergyAnalysisProps {
  analysis: AnalysisResult;
}

export const EnergyAnalysis: React.FC<EnergyAnalysisProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);
  const [formulaTitle, setFormulaTitle] = useState<string>('');

  const openFormula = (key: string, title: string) => {
    setSelectedFormulaKey(key);
    setFormulaTitle(title);
  };

  const heatData = [
    { name: 'Walls (Q_wall)', value: analysis.energy.heat_gain_breakdown.q_wall_kw, fill: '#3b82f6' },
    { name: 'Roof (Q_roof)', value: analysis.energy.heat_gain_breakdown.q_roof_kw, fill: '#ef4444' },
    { name: 'Win Cond (Q_win)', value: analysis.energy.heat_gain_breakdown.q_window_conduction_kw, fill: '#f59e0b' },
    { name: 'Win Solar (Q_sol)', value: analysis.energy.heat_gain_breakdown.q_window_solar_kw, fill: '#eab308' },
    { name: 'People (Q_people)', value: analysis.energy.heat_gain_breakdown.q_people_kw, fill: '#10b981' },
    { name: 'Lighting & Equip', value: analysis.energy.heat_gain_breakdown.q_lighting_kw + analysis.energy.heat_gain_breakdown.q_equipment_kw, fill: '#8b5cf6' },
    { name: 'Infiltration (ACH)', value: analysis.energy.heat_gain_breakdown.q_infiltration_kw, fill: '#64748b' }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Building Energy Analysis</h2>
            <span className="eco-pill bg-amber-100 text-amber-900 border border-amber-300 text-xs">
              Thermodynamic Heat Load Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Decomposition of internal & solar heat gains, HVAC cooling load, lighting energy, and Energy Use Intensity (EUI).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Building Electricity"
          value={analysis.energy.total_annual_kwh.toLocaleString()}
          unit="kWh/yr"
          subtitle="Lighting + HVAC + Appliances"
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          onWhyClick={() => openFormula('hvac_cooling_energy', 'HVAC Cooling Energy Formula')}
        />

        <KpiCard
          title="Energy Use Intensity (EUI)"
          value={analysis.energy.energy_use_intensity_eui}
          unit="kWh/m²/yr"
          subtitle="Building Benchmark"
          icon={<Layers className="w-5 h-5 text-emerald-600" />}
          onWhyClick={() => openFormula('energy_use_intensity', 'EUI Formula')}
        />

        <KpiCard
          title="Peak Thermal Cooling Load"
          value={analysis.energy.heat_gain_breakdown.q_total_kw}
          unit="kW peak"
          subtitle="Q_total = ∑ Q_gains"
          icon={<Flame className="w-5 h-5 text-red-600" />}
          onWhyClick={() => openFormula('hvac_cooling_energy', 'Peak Cooling Load Q_total')}
        />

        <KpiCard
          title="Lighting Electricity"
          value={analysis.energy.lighting_annual_kwh.toLocaleString()}
          unit="kWh/yr"
          subtitle={`Daylight Adjusted`}
          icon={<Zap className="w-5 h-5 text-yellow-600" />}
          onWhyClick={() => openFormula('lighting_energy', 'Lighting Energy Formula')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="eco-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Peak Thermal Heat Gain Decomposition (kW)</h3>
              <p className="text-xs text-slate-500">Breakdown of wall, roof, window, solar, occupant & infiltration loads</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" name="Peak Load (kW)" radius={[4, 4, 0, 0]}>
                  {heatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="eco-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Thermal Heat Gain Audit Table</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-50 font-mono">
              <span>Wall Conduction (Q_wall):</span>
              <span className="font-bold">{analysis.energy.heat_gain_breakdown.q_wall_kw} kW</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 font-mono">
              <span>Roof Conduction (Q_roof):</span>
              <span className="font-bold">{analysis.energy.heat_gain_breakdown.q_roof_kw} kW</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 font-mono">
              <span>Window Solar Heat Gain (Q_solar):</span>
              <span className="font-bold text-amber-600">{analysis.energy.heat_gain_breakdown.q_window_solar_kw} kW</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 font-mono">
              <span>Occupant Heat (Q_people):</span>
              <span className="font-bold">{analysis.energy.heat_gain_breakdown.q_people_kw} kW</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-50 font-mono">
              <span>Infiltration Airflow (Q_infil):</span>
              <span className="font-bold">{analysis.energy.heat_gain_breakdown.q_infiltration_kw} kW</span>
            </div>
            <div className="flex justify-between p-2.5 rounded bg-emerald-950 text-emerald-100 font-mono font-bold text-sm mt-3">
              <span>Total Cooling Load Q_total:</span>
              <span>{analysis.energy.heat_gain_breakdown.q_total_kw} kW</span>
            </div>
          </div>
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
