import React, { useState } from 'react';
import { Droplets, CloudRain, Recycle } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { FormulaModal } from '../components/FormulaModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WaterAnalysisProps {
  analysis: AnalysisResult;
}

export const WaterAnalysis: React.FC<WaterAnalysisProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);

  const openFormula = (key: string) => {
    setSelectedFormulaKey(key);
  };

  const monthlyWater = (analysis.water.monthly_water_demand_litres || []).map((demand, idx) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx],
    Demand: Math.round(demand),
    Rainwater: Math.round(analysis.water.monthly_rainwater_litres?.[idx] || 0)
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Water Demand & Rainwater Harvesting</h2>
            <span className="eco-pill bg-blue-100 text-blue-900 border border-blue-300 text-xs">
              Mass Balance Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Occupant daily demand, low-flow fixture savings, greywater yield, and rooftop rainwater catchment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Daily Water Demand"
          value={analysis.water.daily_demand_litres.toLocaleString()}
          unit="L/day"
          subtitle={`${analysis.water.annual_demand_litres.toLocaleString()} Litres/yr`}
          icon={<Droplets className="w-5 h-5 text-blue-600" />}
          onWhyClick={() => openFormula('water_demand')}
        />

        <KpiCard
          title="Rainwater Harvested"
          value={Math.round(analysis.water.rainwater_harvested_litres).toLocaleString()}
          unit="L/yr"
          subtitle={`Roof Catchment`}
          icon={<CloudRain className="w-5 h-5 text-cyan-600" />}
          onWhyClick={() => openFormula('rainwater_harvesting')}
        />

        <KpiCard
          title="Greywater Generated"
          value={Math.round(analysis.water.greywater_generated_litres).toLocaleString()}
          unit="L/yr"
          subtitle={`Reused: ${Math.round(analysis.water.greywater_reused_litres).toLocaleString()} L`}
          icon={<Recycle className="w-5 h-5 text-teal-600" />}
        />

        <KpiCard
          title="Fresh Water Reduction"
          value={analysis.water.fresh_water_reduction_pct}
          unit="%"
          subtitle="Conservation Overall"
          icon={<Droplets className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      <div className="eco-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Monthly Water Demand vs Rainwater Harvest (Litres)</h3>
            <p className="text-xs text-slate-500">Monthly mass balance showing seasonal monsoon storage potential</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyWater} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Demand" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} name="Water Demand (L)" />
              <Area type="monotone" dataKey="Rainwater" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="Rainwater Harvested (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title="Water Calculation Formula"
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
