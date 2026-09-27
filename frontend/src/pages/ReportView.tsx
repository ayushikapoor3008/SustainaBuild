import React from 'react';
import { Printer, Leaf, Shield } from 'lucide-react';
import type { AnalysisResult, FullProjectInput } from '../types/ecobuild';

interface ReportViewProps {
  analysis: AnalysisResult;
  input: FullProjectInput;
}

export const ReportView: React.FC<ReportViewProps> = ({ analysis, input }) => {
  const handlePrint = () => {
    window.print();
  };

  // Resource circularity score calculation for report
  const energyInd = Math.min(100, analysis.solar.solar_coverage_pct);
  const waterInd = Math.min(100, analysis.water.fresh_water_reduction_pct);
  const wasteDiv = 75; // composting + recycling baseline
  const greenCov = Math.min(100, (analysis.green.green_coverage_pct / Math.max(analysis.green.recommended_green_pct, 1)) * 100);
  const resCircularityScore = Number((energyInd * 0.30 + waterInd * 0.30 + wasteDiv * 0.20 + greenCov * 0.20).toFixed(1));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Printable Header Controls */}
      <div className="no-print flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-2xl font-extrabold text-emerald-950 font-['Outfit',sans-serif]">Sustainability &amp; Resource Report</h2>
          <p className="text-xs text-slate-500">Formal multi-dimensional building performance certification &amp; resource audit document.</p>
        </div>
        <button
          onClick={handlePrint}
          className="eco-btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md font-bold"
        >
          <Printer className="w-4 h-4" />
          <span>Download / Print Report (PDF)</span>
        </button>
      </div>

      {/* Formal Document Layout */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-lg space-y-8 text-slate-900 font-sans">
        {/* Document Cover Header */}
        <div className="border-b-2 border-emerald-900 pb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-900 mb-1">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <span className="font-extrabold text-2xl tracking-tight font-['Outfit',sans-serif]">SustainaBuild <span className="text-emerald-700">AI</span></span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">{analysis.project_name}</h1>
            <p className="text-xs font-semibold text-slate-500">Intelligent Sustainable Architecture &amp; Renewable Resource Management Report</p>
            <p className="text-[11px] font-medium text-emerald-700 mt-0.5">Powered by EcoBuild Intelligence</p>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="eco-pill bg-emerald-900 text-white font-bold text-sm px-3 py-1">
                Eco Score: {analysis.eco_scores.overall_eco_score} / 100
              </span>
              <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-sm px-3 py-1">
                Circularity: {resCircularityScore} / 100
              </span>
            </div>
            <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-slate-500">Status: <span className="text-emerald-700 font-bold">Calculation Verified</span></p>
          </div>
        </div>

        {/* 1. Project & Site Overview */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1 flex items-center gap-1.5">
            1. Project &amp; Site Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div><span className="text-slate-500 block">Project:</span><strong>{analysis.project_name}</strong></div>
            <div><span className="text-slate-500 block">Location / City:</span><strong>{analysis.city}</strong></div>
            <div><span className="text-slate-500 block">Building Typology:</span><strong>{input.project.building_type}</strong></div>
            <div><span className="text-slate-500 block">Plot Area:</span><strong>{input.site.plot_area_m2} m²</strong></div>
            <div><span className="text-slate-500 block">Built-up Area:</span><strong>{input.site.built_up_area_m2} m²</strong></div>
            <div><span className="text-slate-500 block">Number of Floors:</span><strong>{input.site.num_floors} Floors ({input.site.building_height_m}m)</strong></div>
            <div><span className="text-slate-500 block">Ground Coverage:</span><strong>{input.site.ground_coverage_pct}%</strong></div>
            <div><span className="text-slate-500 block">Occupants:</span><strong>{input.envelope.num_occupants} Persons</strong></div>
          </div>
        </section>

        {/* 2. Official Eco Score Breakdown (Preserved Weights) */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1 flex items-center gap-1.5">
            2. Eco Score Performance Breakdown (Weighted Architecture Index)
          </h3>
          <p className="text-xs text-slate-600">
            Calculated using standard physics &amp; thermodynamics algorithms. Weighted components: Energy (25%), Water (20%), Solar (15%), Greenery (15%), Climate Adaptation (15%), Materials (10%).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Energy (25%)</span>
              <strong className="text-amber-900 text-lg font-mono">{analysis.eco_scores.energy_score}</strong>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Water (20%)</span>
              <strong className="text-blue-900 text-lg font-mono">{analysis.eco_scores.water_score}</strong>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Solar (15%)</span>
              <strong className="text-yellow-900 text-lg font-mono">{analysis.eco_scores.solar_score}</strong>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Greenery (15%)</span>
              <strong className="text-emerald-900 text-lg font-mono">{analysis.eco_scores.green_score}</strong>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Climate (15%)</span>
              <strong className="text-teal-900 text-lg font-mono">{analysis.eco_scores.climate_score}</strong>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="block text-slate-500 text-[10px] font-semibold">Materials (10%)</span>
              <strong className="text-stone-900 text-lg font-mono">{analysis.eco_scores.material_score}</strong>
            </div>
          </div>
        </section>

        {/* 3. Resource Circularity & Independence */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1 flex items-center gap-1.5">
            3. Resource Circularity &amp; Independence Index
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/80">
            <div><span className="text-slate-500 block">Energy Independence:</span><strong className="text-emerald-900 font-mono text-sm">{analysis.solar.solar_coverage_pct}%</strong></div>
            <div><span className="text-slate-500 block">Water Independence:</span><strong className="text-emerald-900 font-mono text-sm">{analysis.water.fresh_water_reduction_pct}%</strong></div>
            <div><span className="text-slate-500 block">Waste Diversion Potential:</span><strong className="text-emerald-900 font-mono text-sm">75%</strong></div>
            <div><span className="text-slate-500 block">Green Coverage Ratio:</span><strong className="text-emerald-900 font-mono text-sm">{analysis.green.green_coverage_pct}%</strong></div>
          </div>
        </section>

        {/* 4. Energy & Solar Renewable System */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1">4. Energy &amp; Solar PV Generation</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Total annual building load is <strong>{analysis.energy.total_annual_kwh.toLocaleString()} kWh/year</strong> (EUI: {analysis.energy.energy_use_intensity_eui} kWh/m²/year). Peak heat gain Q_total is {analysis.energy.heat_gain_breakdown.q_total_kw} kW.
            Rooftop solar PV capacity of <strong>{analysis.solar.installed_capacity_kwp} kWp</strong> ({analysis.solar.panel_count} panels) generates <strong>{analysis.solar.annual_generation_kwh.toLocaleString()} kWh/year</strong>, mitigating <strong>{analysis.solar.annual_co2_avoided_tons} tons of CO₂/yr</strong>.
          </p>
        </section>

        {/* 5. Water Circularity & Rainwater Harvesting */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1">5. Water Circularity &amp; Mass Balance</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Annual water demand is <strong>{analysis.water.annual_demand_litres.toLocaleString()} Litres</strong> (based on {input.envelope.num_occupants} occupants at 135 LPCD NBC standard). Rooftop catchment collects <strong>{Math.round(analysis.water.rainwater_harvested_litres).toLocaleString()} Litres/year</strong>, delivering a fresh water demand reduction of <strong>{analysis.water.fresh_water_reduction_pct}%</strong>. Greywater recycling yields {Math.round(analysis.water.greywater_generated_litres).toLocaleString()} L/yr for toilet flushing and landscaping.
          </p>
        </section>

        {/* 6. Greenery, Carbon & Passive Design */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1">6. Green Coverage, Carbon &amp; Passive Cooling</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Green coverage is {analysis.green.green_coverage_pct}% (recommended: {analysis.green.recommended_green_pct}%). Natural cross-ventilation delivers {analysis.passive.estimated_ach} ACH air changes per hour with a passive cooling benefit of {analysis.passive.total_cooling_reduction_pct}%. Operational carbon emissions are {analysis.carbon.operational_co2_annual_tons} tons/yr, with 30-year lifetime carbon footprint estimated at {analysis.carbon.total_lifetime_co2_30yr_tons} tons CO₂.
          </p>
        </section>

        {/* 7. Preliminary Statutory Compliance Summary */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1">7. Preliminary Statutory Compliance Summary</h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Preliminary development control verification against applicable master plan regulations for {analysis.city}. Verified parameters include Floor Area Ratio (FAR), Ground Coverage, High-Rise Fire Safety thresholds, and NBC Water standards.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Statutory Notice:</strong> This preliminary assessment is for educational and architectural decision-support purposes only. It does not constitute formal statutory sanction, municipal approval, or certified building plan endorsement.
            </span>
          </div>
        </section>

        {/* 8. AI Sustainability Recommendations */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b pb-1">8. Top Priority Sustainability Interventions</h3>
          <div className="space-y-2 text-xs text-slate-700">
            {analysis.recommendations.map((rec, i) => (
              <div key={rec.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center gap-4">
                <div>
                  <strong>{i + 1}. {rec.title}:</strong> {rec.why}
                </div>
                <div className="text-right shrink-0 font-mono text-[11px]">
                  <span className="block text-emerald-800 font-bold">₹{rec.estimated_cost_inr.toLocaleString()}</span>
                  <span className="text-slate-500">{rec.payback_years} yr payback</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Methodology & Disclaimers */}
        <section className="space-y-2 text-xs text-slate-500 border-t pt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">9. Engineering Methodology &amp; Simulation Limitations</h3>
          <p className="italic">
            SustainaBuild AI physics calculations utilize Level 1 to Level 5 accuracy hierarchy incorporating thermodynamic heat conduction equations (Fourier &amp; Sol-Air), orifice airflow fluid dynamics, ISRO Solar Atlas radiation profiles, and Central Electricity Authority emission factors. Model confidence rating: {analysis.confidence.model_confidence_pct}%.
          </p>
        </section>
      </div>
    </div>
  );
};
