import React, { useState } from 'react';
import { Wind, Sun, Layers } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { BioInspiredCards } from '../components/BioInspiredCards';
import { FormulaModal } from '../components/FormulaModal';

interface PassiveDesignProps {
  analysis: AnalysisResult;
}

export const PassiveDesign: React.FC<PassiveDesignProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Passive Cooling & Bio-Inspired Architecture</h2>
            <span className="eco-pill bg-teal-100 text-teal-900 border border-teal-300 text-xs">
              Natural Airflow & Shading
            </span>
          </div>
          <p className="text-xs text-slate-500">Air changes per hour (ACH) orifice calculation, orientation benefits, and Biomimicry architecture principles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Passive Cooling Score"
          value={analysis.passive.passive_cooling_score}
          unit="/100"
          subtitle="Overall Passive Performance"
          icon={<Wind className="w-5 h-5 text-teal-600" />}
        />

        <KpiCard
          title="Natural Ventilation ACH"
          value={analysis.passive.estimated_ach}
          unit="ACH"
          subtitle={analysis.passive.natural_ventilation_suitability}
          icon={<Wind className="w-5 h-5 text-blue-600" />}
          onWhyClick={() => setSelectedFormulaKey('natural_ventilation_ach')}
        />

        <KpiCard
          title="Cooling Demand Reduction"
          value={analysis.passive.total_cooling_reduction_pct}
          unit="%"
          subtitle="Max Cap 45% Safety Limit"
          icon={<Sun className="w-5 h-5 text-amber-600" />}
        />

        <KpiCard
          title="Orientation Benefit"
          value={analysis.passive.orientation_benefit_pct}
          unit="%"
          subtitle="Solar Alignment"
          icon={<Layers className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      <BioInspiredCards />

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title="Natural Ventilation ACH Formula"
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
