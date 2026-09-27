import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck, Database, Layers } from 'lucide-react';
import type { ConfidenceMetrics } from '../types/ecobuild';

interface AssumptionsPanelProps {
  confidence: ConfidenceMetrics;
}

export const AssumptionsPanel: React.FC<AssumptionsPanelProps> = ({ confidence }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="eco-card p-6 bg-slate-50/70 border-slate-200">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-emerald-950">Calculation Confidence & Data Quality</h3>
              <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
                Model Confidence: {confidence.model_confidence_pct}%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Confidence reflects input completeness and physics model applicability; it is not a guarantee of engineering simulation.
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-2">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6 pt-5 border-t border-slate-200/80">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              Data Source & Calculation Accuracy Hierarchy (Level 1–5)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(confidence.level_breakdown).map(([lvl, desc]) => (
                <div key={lvl} className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">{lvl}</span>
                  <span className="text-xs text-slate-600 leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Engineering Assumptions & Operational Limitations
            </h4>
            <ul className="space-y-2">
              {confidence.assumptions_and_limitations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60">
                  <Database className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
