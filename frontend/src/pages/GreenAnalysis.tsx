import React, { useState } from 'react';
import { Trees, ShieldAlert, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';
import { KpiCard } from '../components/KpiCard';
import { FormulaModal } from '../components/FormulaModal';

interface GreenAnalysisProps {
  analysis: AnalysisResult;
}

export const GreenAnalysis: React.FC<GreenAnalysisProps> = ({ analysis }) => {
  const [selectedFormulaKey, setSelectedFormulaKey] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Green Infrastructure & Urban Heat Risk</h2>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
              Canopy & Heat Island Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Green coverage %, tree canopy, green roof recommendations, and urban heat island risk indicator.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Green Coverage Ratio"
          value={analysis.green.green_coverage_pct}
          unit="%"
          subtitle={`Recommended: ${analysis.green.recommended_green_pct}%`}
          icon={<Trees className="w-5 h-5 text-emerald-600" />}
          onWhyClick={() => setSelectedFormulaKey('green_coverage')}
        />

        <KpiCard
          title="Microclimate Heat Risk"
          value={analysis.green.microclimate_heat_risk}
          subtitle="Urban Heat Island Risk"
          icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
        />

        <KpiCard
          title="Tree Recommendation"
          value={analysis.green.tree_recommendation_count}
          unit="Trees"
          subtitle="12 m² Canopy/Tree"
          icon={<Trees className="w-5 h-5 text-emerald-600" />}
        />

        <KpiCard
          title="Heat Reduction Score"
          value={analysis.green.potential_heat_reduction_score}
          unit="/100"
          subtitle="Microclimate Cooling"
          icon={<Sparkles className="w-5 h-5 text-teal-600" />}
        />
      </div>

      {selectedFormulaKey && (
        <FormulaModal
          isOpen={!!selectedFormulaKey}
          onClose={() => setSelectedFormulaKey(null)}
          title="Green Coverage Ratio Formula"
          detail={analysis.calculations_explained[selectedFormulaKey]}
        />
      )}
    </div>
  );
};
