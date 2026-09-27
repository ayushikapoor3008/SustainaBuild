import React from 'react';
import { Sun, CloudRain, Thermometer, ShieldAlert } from 'lucide-react';
import type { AnalysisResult, FullProjectInput } from '../types/ecobuild';
import { SiteMap } from '../components/SiteMap';

interface SiteClimateProps {
  analysis: AnalysisResult;
  input: FullProjectInput;
}

export const SiteClimate: React.FC<SiteClimateProps> = ({ analysis, input }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">Site & Climate Intelligence</h2>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
              {analysis.city} Baseline
            </span>
          </div>
          <p className="text-xs text-slate-500">Location microclimate parameters, degree days, solar irradiation, and wind conditions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SiteMap project={input.project} climateZone={analysis.city} />
        </div>

        <div className="eco-card p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Regional Climate Metrics</h3>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <Sun className="w-4 h-4 text-amber-600" />
                Solar Irradiation:
              </span>
              <span className="font-mono font-bold text-slate-900">{analysis.solar.peak_sun_hours_avg} kWh/m²/day</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <Thermometer className="w-4 h-4 text-red-600" />
                Cooling Degree Days (CDD):
              </span>
              <span className="font-mono font-bold text-slate-900">2,850 CDD</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <CloudRain className="w-4 h-4 text-blue-600" />
                Annual Rainfall:
              </span>
              <span className="font-mono font-bold text-slate-900">790 mm</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 font-medium text-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Water Stress Indicator:
              </span>
              <span className="eco-pill bg-red-100 text-red-900 border border-red-200 text-[11px]">
                Extremely High
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
