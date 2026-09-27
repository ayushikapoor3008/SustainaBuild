import React, { useState } from 'react';
import { Boxes, Flame, Layers, Award } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { FormulaModal } from '../components/FormulaModal';

interface CarbonAnalysisProps {
  analysis: AnalysisResult;
}

export const CarbonAnalysis: React.FC<CarbonAnalysisProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Materials & Carbon Footprint Analysis</h2>
            <span className="eco-pill bg-purple-100 text-purple-900 border border-purple-300 text-xs">
              LCA Embodied & Operational Carbon
            </span>
          </div>
          <p className="text-xs text-slate-500">Operational CO₂, embodied CO₂ of concrete, steel, brick, cement, glass, timber, and Material Sustainability Score /100.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Operational CO₂ (Annual)"
          value={analysis.carbon.operational_co2_annual_tons}
          unit="Tons CO₂/yr"
          subtitle="Grid Electricity CO₂"
          icon={<Flame className="w-5 h-5 text-red-600" />}
          onWhyClick={() => setSelectedFormulaKey('operational_carbon')}
        />

        <KpiCard
          title="Embodied CO₂ (Materials)"
          value={analysis.carbon.embodied_co2_total_tons}
          unit="Tons CO₂"
          subtitle="ICE LCA Database"
          icon={<Boxes className="w-5 h-5 text-purple-600" />}
          onWhyClick={() => setSelectedFormulaKey('embodied_carbon')}
        />

        <KpiCard
          title="30-Year Lifetime Carbon"
          value={analysis.carbon.total_lifetime_co2_30yr_tons}
          unit="Tons CO₂"
          subtitle={`${analysis.carbon.co2_per_sq_meter_kg} kg CO₂/m²`}
          icon={<Layers className="w-5 h-5 text-amber-600" />}
        />

        <KpiCard
          title="Material Sustainability Score"
          value={analysis.carbon.material_sustainability_score}
          unit="/100"
          subtitle="Recycled & Carbon Index"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title="Carbon Calculation Formula"
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
