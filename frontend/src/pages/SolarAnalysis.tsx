import React, { useState } from 'react';
import { Sun, Zap, ShieldCheck, Trees } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { FormulaModal } from '../components/FormulaModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SolarAnalysisProps {
  analysis: AnalysisResult;
}

export const SolarAnalysis: React.FC<SolarAnalysisProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);

  const monthlySolar = (analysis.solar.monthly_generation_kwh || []).map((gen, idx) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx],
    Generation: Math.round(gen)
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Solar Photovoltaic (PV) Potential</h2>
            <span className="eco-pill bg-yellow-100 text-yellow-900 border border-yellow-300 text-xs">
              PV System Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Panel count, installed kWp, peak sun hours, annual clean generation, and grid offset.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Installed Capacity"
          value={analysis.solar.installed_capacity_kwp}
          unit="kWp"
          subtitle={`${analysis.solar.panel_count} Panels (400W)`}
          icon={<Sun className="w-5 h-5 text-yellow-600" />}
          onWhyClick={() => setSelectedFormulaKey('solar_generation')}
        />

        <KpiCard
          title="Annual Clean Generation"
          value={analysis.solar.annual_generation_kwh.toLocaleString()}
          unit="kWh/yr"
          subtitle={`PSH: ${analysis.solar.peak_sun_hours_avg} hrs/day`}
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          onWhyClick={() => setSelectedFormulaKey('solar_generation')}
        />

        <KpiCard
          title="Solar Coverage Ratio"
          value={analysis.solar.solar_coverage_pct}
          unit="%"
          subtitle="Building Electricity Offset"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />

        <KpiCard
          title="Annual CO₂ Avoided"
          value={analysis.solar.annual_co2_avoided_tons}
          unit="Tons CO₂/yr"
          subtitle="Grid Carbon Offset"
          icon={<Trees className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Monthly Solar Generation Yield (kWh)</h3>
            <p className="text-xs text-slate-500">Seasonal solar PV generation profile</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySolar} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="Generation" fill="#f59e0b" name="Solar Yield (kWh)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title="Solar PV Generation Formula"
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
