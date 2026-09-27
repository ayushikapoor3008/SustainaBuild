import React, { useState, useCallback } from 'react';
import {
  Scale, CheckCircle, AlertTriangle, XCircle, ExternalLink,
  Building, MapPin, ChevronDown, RefreshCw, Info, Leaf, Shield
} from 'lucide-react';
import type { ComplianceReport, ComplianceResultItem, ComplianceStatus } from '../types/ecobuild';

const API_BASE = 'http://localhost:8001/api';

// ── City & Building data ──────────────────────────────────────────────────────
const CITIES_EXTENDED = [
  "Delhi", "New Delhi", "Noida", "Greater Noida", "Ghaziabad", "Gurugram", "Faridabad",
  "Bahadurgarh", "Sonipat", "Panipat", "Rohtak", "Manesar", "Delhi NCR",
  "Mumbai", "Pune", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
  "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
  "Bhopal", "Indore", "Bhubaneswar", "Nagpur", "Dehradun", "Shimla",
  "Amritsar", "Patna", "Ranchi", "Guwahati"
];

const BUILDING_TYPES_EXTENDED = [
  "Residential", "Individual Residential", "Villa", "Apartment",
  "Multi-Storey Residential", "Group Housing", "Commercial", "Office",
  "Educational", "Institutional", "Mixed-use", "Public Building", "Sustainable Community"
];

// ── Status badge component ────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
  if (status === 'PASS') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
      <CheckCircle className="w-3.5 h-3.5" /> PASS
    </span>
  );
  if (status === 'WARNING') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
      <AlertTriangle className="w-3.5 h-3.5" /> WARNING
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
      <XCircle className="w-3.5 h-3.5" /> NOT VERIFIED
    </span>
  );
};

const VerifBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'VERIFIED') return <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">✅ VERIFIED</span>;
  if (status === 'REQUIRES_CONFIRMATION') return <span className="text-amber-700 text-[10px] font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">⚠️ REQUIRES CONFIRMATION</span>;
  return <span className="text-slate-600 text-[10px] font-bold bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">❌ NOT VERIFIED</span>;
};

// ── Helper: local compliance calculation (fallback when backend is unavailable) ─
function runLocalCompliance(
  location: string, buildingType: string, plotArea: number, builtUp: number,
  floors: number, height: number, roadWidth: number, greenPct: number, groundCov: number
): ComplianceReport {
  const far = plotArea > 0 ? +(builtUp / plotArea).toFixed(2) : 0;
  const results: ComplianceResultItem[] = [];

  // FAR check
  const farAllowed = location === 'Delhi' ? 3.5 : location === 'Mumbai' || location === 'Bengaluru' ? 2.25 : 2.0;
  const farVerif = location === 'Delhi' ? 'VERIFIED' : 'REQUIRES_CONFIRMATION';
  results.push({
    regulation_id: 'LOCAL-FAR-001',
    regulation_name: 'Floor Area Ratio (FAR)',
    category: 'FAR / FSI',
    authority: location === 'Noida' ? 'NOIDA Authority' : location === 'Delhi' ? 'DDA' : 'Relevant Authority',
    required_value: farAllowed,
    required_label: `${farAllowed} (max)`,
    proposed_value: far,
    proposed_label: `${far} (Proposed)`,
    difference: +(farAllowed - far).toFixed(2),
    unit: 'ratio',
    status: far <= farAllowed ? (farVerif === 'VERIFIED' ? 'PASS' : 'WARNING') : 'WARNING',
    conditions: 'FAR depends on plot size, road width, and zone. Verify with local authority.',
    exceptions: 'Corner plots and premium sectors may have different FAR.',
    official_source_name: 'Local Development Authority Building Regulations',
    official_source_url: '#',
    last_verified_date: '2024-01-01',
    verification_status: farVerif as any,
    confidence: farVerif === 'VERIFIED' ? 'HIGH' : 'MEDIUM',
    notes: `FAR of ${farAllowed} is commonly cited for ${location}. Must be verified with local authority.`
  });

  // Ground Coverage Check
  const maxGroundCovPct = buildingType === 'Commercial' ? 50 : 40;
  results.push({
    regulation_id: 'LOCAL-GC-001',
    regulation_name: 'Maximum Ground Coverage',
    category: 'Ground Coverage',
    authority: location === 'Noida' ? 'NOIDA Authority' : 'Local Development Authority',
    required_value: maxGroundCovPct,
    required_label: `${maxGroundCovPct}% (maximum permitted)`,
    proposed_value: groundCov,
    proposed_label: `${groundCov}% (proposed ground coverage)`,
    difference: +(maxGroundCovPct - groundCov).toFixed(1),
    unit: 'percent of plot area',
    status: groundCov <= maxGroundCovPct ? 'PASS' : 'WARNING',
    conditions: 'Ground coverage varies with plot category, road width, and local zoning bye-laws.',
    exceptions: 'Industrial and special IT zones may permit higher ground coverage.',
    official_source_name: 'Local Building Bye-Laws & Master Plan',
    official_source_url: '#',
    last_verified_date: '2024-01-01',
    verification_status: 'REQUIRES_CONFIRMATION',
    confidence: 'MEDIUM',
    notes: 'Verify with local authority master plan specifications.'
  });

  // Height / High-rise
  results.push({
    regulation_id: 'NBC-FIRE-001',
    regulation_name: 'Fire Safety — High-Rise Classification (>15m)',
    category: 'Fire Safety',
    authority: 'Bureau of Indian Standards — NBC 2016',
    required_value: 15,
    required_label: '15 m (high-rise threshold)',
    proposed_value: height,
    proposed_label: `${height} m ${height > 15 ? '— HIGH-RISE: Fire NOC Required' : '— Not High-Rise'}`,
    unit: 'metres',
    status: height > 15 ? 'WARNING' : 'PASS',
    conditions: 'Buildings >15m classified as High-Rise. Mandatory Fire NOC before occupancy.',
    exceptions: 'Industrial buildings may have different thresholds.',
    official_source_name: 'National Building Code of India 2016 — Part 4',
    official_source_url: 'https://bis.gov.in',
    last_verified_date: '2024-01-01',
    verification_status: 'VERIFIED',
    confidence: 'HIGH',
    notes: 'NBC 2016 is a model code; state adoption varies.'
  });

  // Green/Open Space
  const requiredGreenPct = (buildingType === 'Group Housing' || buildingType === 'Apartment') ? 30 : 25;
  const requiredGreenM2 = +(plotArea * requiredGreenPct / 100).toFixed(1);
  const proposedGreenM2 = +(plotArea * greenPct / 100).toFixed(1);
  results.push({
    regulation_id: 'LOCAL-GRN-001',
    regulation_name: `Open/Green Space — ${buildingType}`,
    category: 'Green / Open Space',
    authority: location === 'Noida' ? 'NOIDA Authority' : 'Relevant Development Authority',
    required_value: requiredGreenPct,
    required_label: `${requiredGreenPct}% of plot = ${requiredGreenM2} m²`,
    proposed_value: greenPct,
    proposed_label: `${greenPct.toFixed(1)}% = ${proposedGreenM2} m²`,
    required_green_m2: requiredGreenM2,
    proposed_green_m2: proposedGreenM2,
    difference_m2: +(proposedGreenM2 - requiredGreenM2).toFixed(1),
    unit: 'percent of plot area',
    status: greenPct >= requiredGreenPct ? 'WARNING' : 'WARNING',
    conditions: 'Green/open space requirement varies by building type and authority. Must be confirmed.',
    exceptions: 'Individual plots follow different norms than group housing.',
    official_source_name: 'Local Authority Building Regulations',
    official_source_url: '#',
    last_verified_date: '2024-01-01',
    verification_status: 'REQUIRES_CONFIRMATION',
    confidence: 'MEDIUM',
    notes: 'Green area requirement must be confirmed with local authority for the specific plot category.'
  });

  // NBC Water
  results.push({
    regulation_id: 'NBC-WATER-001',
    regulation_name: 'Water Supply Standard (135 LPCD)',
    category: 'Water Supply',
    authority: 'Bureau of Indian Standards — NBC 2016',
    required_value: 135,
    required_label: '135 LPCD minimum (NBC 2016)',
    proposed_value: null,
    proposed_label: 'Refer to NBC standard for water demand planning',
    unit: 'litres per capita per day',
    status: 'NOT_VERIFIED',
    conditions: 'Minimum 135 LPCD for residential. Design water supply based on occupant count.',
    exceptions: 'EWS: 70 LPCD, LIG: 100 LPCD.',
    official_source_name: 'National Building Code 2016 — Part 9 Section 2',
    official_source_url: 'https://bis.gov.in',
    last_verified_date: '2024-01-01',
    verification_status: 'VERIFIED',
    confidence: 'HIGH',
    notes: 'NBC 2016 reference standard for water demand.'
  });

  const passCount = results.filter(r => r.status === 'PASS').length;
  const warnCount = results.filter(r => r.status === 'WARNING').length;
  const nvCount = results.filter(r => r.status === 'NOT_VERIFIED').length;

  return {
    location, building_type: buildingType,
    authority: location === 'Noida' ? 'NOIDA Authority' : location === 'Delhi' ? 'DDA / MCD' : `${location} Development Authority`,
    authority_website: '#', authority_confidence: 'MEDIUM',
    plot_area_m2: plotArea, built_up_area_m2: builtUp, num_floors: floors,
    building_height_m: height, road_width_m: roadWidth,
    regulations_checked: results.length, pass_count: passCount,
    warning_count: warnCount, not_verified_count: nvCount,
    results,
    disclaimer: 'This is a preliminary compliance assessment for planning and educational purposes only. It is NOT a legal approval, sanctioned building plan, or substitute for verification by the relevant authority or a licensed professional. Always verify with the applicable development authority before commencing construction.',
    data_quality_note: 'Regulatory data is sourced from official publications where available. Entries marked REQUIRES_CONFIRMATION or NOT_VERIFIED must be verified with the authority.'
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────
export const LegalCompliance: React.FC = () => {
  const [location, setLocation] = useState('Noida');
  const [buildingType, setBuildingType] = useState('Apartment');
  const [plotArea, setPlotArea] = useState(1000);
  const [builtUpArea, setBuiltUpArea] = useState(2000);
  const [floors, setFloors] = useState(5);
  const [heightM, setHeightM] = useState(15.0);
  const [roadWidth, setRoadWidth] = useState(12.0);
  const [groundCovPct, setGroundCovPct] = useState(33.0);
  const [greenPct, setGreenPct] = useState(25.0);
  const [dwellingUnits, setDwellingUnits] = useState<number | undefined>(undefined);
  const [parkingECS, setParkingECS] = useState<number | undefined>(undefined);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        location, building_type: buildingType,
        plot_area_m2: String(plotArea), built_up_area_m2: String(builtUpArea),
        num_floors: String(floors), building_height_m: String(heightM),
        road_width_m: String(roadWidth), ground_coverage_pct: String(groundCovPct),
        proposed_green_pct: String(greenPct),
        ...(dwellingUnits !== undefined && { dwelling_units: String(dwellingUnits) }),
        ...(parkingECS !== undefined && { parking_ecs: String(parkingECS) }),
      });
      const res = await fetch(`${API_BASE}/compliance?${params}`, { method: 'POST' });
      if (!res.ok) throw new Error('Backend unavailable');
      const data = await res.json();
      setReport(data);
    } catch {
      // Fallback: local calculation
      const local = runLocalCompliance(location, buildingType, plotArea, builtUpArea, floors, heightM, roadWidth, greenPct, groundCovPct);
      setReport(local);
    } finally {
      setIsLoading(false);
    }
  }, [location, buildingType, plotArea, builtUpArea, floors, heightM, roadWidth, groundCovPct, greenPct, dwellingUnits, parkingECS]);

  const InputField = ({ label, value, onChange, min, max, step = 1, unit = '' }: any) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}{unit && <span className="text-slate-400 font-normal"> ({unit})</span>}</label>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 bg-white"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center shadow-lg shrink-0">
          <Scale className="w-6 h-6 text-emerald-200" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">Legal & Preliminary Building Compliance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Preliminary assessment against verified regulatory data. <span className="text-amber-700 font-semibold">Not a legal approval.</span></p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800">
          <span className="font-bold block mb-1">Important Disclaimer</span>
          This tool provides a preliminary compliance assessment for planning and educational purposes only. It is <strong>NOT</strong> a legal approval, sanctioned building plan, or substitute for verification by the relevant authority or a licensed professional. Always verify with the applicable development authority before commencing construction.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="eco-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Project Location & Type
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City / Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white">
                {CITIES_EXTENDED.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Building Type</label>
              <select value={buildingType} onChange={e => setBuildingType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white">
                {BUILDING_TYPES_EXTENDED.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="eco-card p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" /> Building Parameters
            </h2>
            <InputField label="Plot Area" value={plotArea} onChange={setPlotArea} min={10} unit="m²" />
            <InputField label="Total Built-Up Area" value={builtUpArea} onChange={setBuiltUpArea} min={10} unit="m²" />
            <InputField label="Number of Floors" value={floors} onChange={setFloors} min={1} max={100} />
            <InputField label="Building Height" value={heightM} onChange={setHeightM} min={2.5} step={0.5} unit="m" />
            <InputField label="Road Width" value={roadWidth} onChange={setRoadWidth} min={3} step={0.5} unit="m" />
            <InputField label="Ground Coverage" value={groundCovPct} onChange={setGroundCovPct} min={0} max={100} step={0.5} unit="%" />
            <InputField label="Proposed Green/Open Area" value={greenPct} onChange={setGreenPct} min={0} max={100} step={0.5} unit="%" />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Dwelling Units" value={dwellingUnits ?? ''} onChange={(v: number) => setDwellingUnits(v || undefined)} min={0} />
              <InputField label="Parking (ECS)" value={parkingECS ?? ''} onChange={(v: number) => setParkingECS(v || undefined)} min={0} step={0.5} />
            </div>
          </div>

          <button onClick={runCheck} disabled={isLoading}
            className="w-full eco-btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            {isLoading ? 'Checking...' : 'Run Compliance Check'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!report && !isLoading && (
            <div className="eco-card p-12 text-center text-slate-400">
              <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Fill in project details and click <strong>Run Compliance Check</strong></p>
              <p className="text-xs mt-2">Results show preliminary assessment — not legal approval</p>
            </div>
          )}

          {report && (
            <>
              {/* Authority */}
              <div className="eco-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Applicable Authority</p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{report.authority}</p>
                    {report.authority_website && report.authority_website !== '#' && (
                      <a href={report.authority_website} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> {report.authority_website}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-extrabold text-emerald-700">{report.pass_count}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">PASS</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-extrabold text-amber-700">{report.warning_count}</p>
                      <p className="text-[10px] text-amber-600 font-bold">WARNING</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-extrabold text-slate-600">{report.not_verified_count}</p>
                      <p className="text-[10px] text-slate-500 font-bold">NOT VERIFIED</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">{report.data_quality_note}</p>
              </div>

              {/* Results table */}
              <div className="space-y-3">
                {report.results.map((item) => (
                  <div key={item.regulation_id} className="eco-card overflow-hidden">
                    <button
                      className="w-full text-left p-4 flex items-center justify-between gap-3"
                      onClick={() => setExpandedId(expandedId === item.regulation_id ? null : item.regulation_id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <StatusBadge status={item.status} />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">{item.regulation_name}</p>
                          <p className="text-xs text-slate-400">{item.category} · {item.authority.split('(')[0].trim()}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${expandedId === item.regulation_id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedId === item.regulation_id && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-slate-400 mb-0.5 font-medium">Required</p>
                            <p className="font-bold text-slate-800">{item.required_label}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-slate-400 mb-0.5 font-medium">Proposed</p>
                            <p className="font-bold text-slate-800">{item.proposed_label}</p>
                          </div>
                        </div>
                        {item.required_green_m2 !== undefined && (
                          <div className="bg-emerald-50 rounded-lg p-3 text-xs border border-emerald-100">
                            <p className="font-semibold text-emerald-800 mb-1">Green Area Calculation</p>
                            <p className="text-emerald-700">Required: {item.required_green_m2} m² ({item.required_value}% of {report.plot_area_m2} m²)</p>
                            <p className="text-emerald-700">Proposed: {item.proposed_green_m2} m²</p>
                            <p className={`font-bold mt-1 ${(item.difference_m2 ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                              {(item.difference_m2 ?? 0) >= 0 ? '✓ Surplus: ' : '✗ Deficit: '}{Math.abs(item.difference_m2 ?? 0)} m²
                            </p>
                          </div>
                        )}
                        {item.conditions && <p className="text-xs text-slate-600"><span className="font-semibold">Conditions:</span> {item.conditions}</p>}
                        {item.exceptions && <p className="text-xs text-slate-500"><span className="font-semibold">Exceptions:</span> {item.exceptions}</p>}
                        {item.notes && <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded"><span className="font-semibold">Note:</span> {item.notes}</p>}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <VerifBadge status={item.verification_status} />
                          {item.official_source_url && item.official_source_url !== '#' && (
                            <a href={item.official_source_url} target="_blank" rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> {item.official_source_name}
                            </a>
                          )}
                          {item.last_verified_date && <span className="text-[10px] text-slate-400">Verified: {item.last_verified_date}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sustainability recommendations separator */}
              <div className="eco-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-800">Sustainability Recommendations</h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Not Legal Requirements</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Plant native species for low-maintenance green cover",
                    "Add green roof to increase green coverage and reduce heat island effect",
                    "Install rainwater harvesting to supplement water supply",
                    "Use permeable paving in open areas to reduce runoff",
                    "Add vertical gardens on south/west walls for passive cooling",
                    "Install rooftop solar PV to reduce grid dependency",
                    "Plan composting area for organic waste",
                    "Use energy-efficient LED lighting throughout",
                  ].map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✦</span>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Full disclaimer */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 italic">{report.disclaimer}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
