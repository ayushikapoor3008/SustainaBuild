import React from 'react';
import { X, HelpCircle, CheckCircle, Info } from 'lucide-react';
import type { CalculationDetail } from '../types/ecobuild';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  detail?: CalculationDetail;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose, title, detail }) => {
  if (!isOpen || !detail) return null;

  const getLevelBadgeColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 2: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 3: return 'bg-amber-100 text-amber-800 border-amber-200';
      case 4: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-950/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-950">{title}</h3>
              <p className="text-xs text-slate-500">Transparent Calculation & Physics Audit Trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-medium text-slate-600">Calculation Accuracy Level:</span>
            <span className={`eco-pill border ${getLevelBadgeColor(detail.confidence_level)}`}>
              <CheckCircle className="w-3.5 h-3.5" />
              {detail.level_name}
            </span>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
              Engineering Formula
            </label>
            <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 font-mono text-sm overflow-x-auto shadow-inner">
              {detail.formula}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                User Inputs & Location Data
              </label>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                {Object.entries(detail.inputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{k}:</span>
                    <span className="text-slate-900 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Derived Coefficients & Values
              </label>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                {Object.entries(detail.values).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">{k}:</span>
                    <span className="text-emerald-800 font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
              Step-by-Step Calculation
            </label>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs font-mono text-emerald-950">
              {detail.calculation_steps}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-900 text-white rounded-xl">
            <span className="text-sm font-medium">Calculated Output:</span>
            <span className="text-xl font-bold font-mono text-emerald-200">{detail.result_str}</span>
          </div>

          {detail.assumptions && detail.assumptions.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                <Info className="w-4 h-4 text-amber-700" />
                Assumptions & Engineering Standards
              </div>
              <ul className="text-xs text-amber-800 space-y-1 pl-4 list-disc">
                {detail.assumptions.map((asm, i) => (
                  <li key={i}>{asm}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="eco-btn-secondary text-xs px-4 py-2"
          >
            Close Formula Explainer
          </button>
        </div>
      </div>
    </div>
  );
};
