import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AnalysisResult } from '../types/ecobuild';

interface RecommendationsProps {
  analysis: AnalysisResult;
  onNavigate: (tab: string) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ analysis, onNavigate }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Calculation-Driven AI Recommendations</h2>
            <span className="eco-pill bg-amber-100 text-amber-900 border border-amber-300 text-xs">
              Rule-Based Scoring
            </span>
          </div>
          <p className="text-xs text-slate-500">Every recommendation is mapped directly to calculated thermal, water, or solar weaknesses.</p>
        </div>
      </div>

      <div className="space-y-4">
        {analysis.recommendations.map((rec, idx) => (
          <div key={rec.id} className="eco-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-950 text-white font-mono text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{rec.title}</h3>
                <span className="eco-pill bg-slate-100 text-slate-700 text-xs">
                  Category: {rec.category}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pl-8">
                <strong className="text-slate-900 font-semibold">WHY:</strong> {rec.why}
              </p>

              <div className="flex flex-wrap items-center gap-3 pl-8 text-xs font-medium text-slate-600">
                <span className={`eco-pill ${rec.impact === 'High' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-slate-100 text-slate-700'}`}>
                  Impact: {rec.impact}
                </span>
                <span className="eco-pill bg-slate-100 text-slate-700">Cost: {rec.cost}</span>
                <span className="eco-pill bg-amber-100 text-amber-900 border border-amber-300">Confidence: {rec.confidence_pct}%</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-right shrink-0 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-slate-200">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Est. Implementation Cost</span>
                <span className="text-lg font-extrabold font-mono text-slate-900">₹{rec.estimated_cost_inr.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Payback Period</span>
                <span className="text-sm font-bold font-mono text-emerald-700">{rec.payback_years} Years</span>
              </div>
              <button
                onClick={() => onNavigate('simulator')}
                className="eco-btn-primary text-xs px-3.5 py-1.5 mt-2 flex items-center gap-1"
              >
                <span>Test in Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
