import React, { useState } from 'react';
import {
  Building2, Compass, Layers, Zap, Droplets, Trees,
  AlertTriangle, Sparkles, ArrowRight
} from 'lucide-react';
import type { FullProjectInput, GlassType, RoofType, HvacType, LightingType, BuildingType } from '../types/ecobuild';
import { DEMO_PROJECT_INPUT } from '../mockData/demoProject';

interface NewAnalysisProps {
  initialInput: FullProjectInput;
  onAnalyze: (input: FullProjectInput) => void;
  isProfessionalMode: boolean;
}

export const NewAnalysis: React.FC<NewAnalysisProps> = ({
  initialInput,
  onAnalyze,
  isProfessionalMode
}) => {
  const [formData, setFormData] = useState<FullProjectInput>(initialInput);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [unitIsSqFt, setUnitIsSqFt] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);

  const NCR_CITIES = [
    "Delhi", "New Delhi", "Noida", "Greater Noida", "Gurugram", "Gurgaon",
    "Faridabad", "Ghaziabad", "Bahadurgarh", "Sonipat", "Panipat", "Rohtak", "Manesar", "Delhi NCR"
  ];

  const MAJOR_CITIES = [
    "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Chandigarh", "Goa", "Kochi",
    "Indore", "Bhopal", "Bhubaneswar", "Nagpur", "Dehradun", "Shimla", "Amritsar", "Patna", "Ranchi", "Guwahati"
  ];

  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    "Delhi":         { lat: 28.6139, lng: 77.2090 },
    "New Delhi":     { lat: 28.6129, lng: 77.2295 },
    "Noida":         { lat: 28.5355, lng: 77.3910 },
    "Greater Noida": { lat: 28.4744, lng: 77.5040 },
    "Gurugram":      { lat: 28.4595, lng: 77.0266 },
    "Gurgaon":       { lat: 28.4595, lng: 77.0266 },
    "Faridabad":     { lat: 28.4089, lng: 77.3178 },
    "Ghaziabad":     { lat: 28.6692, lng: 77.4538 },
    "Bahadurgarh":   { lat: 28.6924, lng: 76.9240 },
    "Sonipat":       { lat: 28.9931, lng: 77.0151 },
    "Panipat":       { lat: 29.3909, lng: 76.9635 },
    "Rohtak":        { lat: 28.8955, lng: 76.6066 },
    "Manesar":       { lat: 28.3510, lng: 76.9419 },
    "Delhi NCR":     { lat: 28.6139, lng: 77.2090 },
    "Mumbai":        { lat: 19.0760, lng: 72.8777 },
    "Bengaluru":     { lat: 12.9716, lng: 77.5946 },
    "Chennai":       { lat: 13.0827, lng: 80.2707 },
    "Kolkata":       { lat: 22.5726, lng: 88.3639 },
    "Hyderabad":     { lat: 17.3850, lng: 78.4867 },
    "Pune":          { lat: 18.5204, lng: 73.8567 },
    "Jaipur":        { lat: 26.9124, lng: 75.7873 },
    "Ahmedabad":     { lat: 23.0225, lng: 72.5714 },
    "Surat":         { lat: 21.1702, lng: 72.8311 },
    "Lucknow":       { lat: 26.8467, lng: 80.9462 },
    "Chandigarh":    { lat: 30.7333, lng: 76.7794 },
    "Goa":           { lat: 15.2993, lng: 74.1240 },
    "Kochi":         { lat: 9.9312,  lng: 76.2673 },
    "Indore":        { lat: 22.7196, lng: 75.8577 },
    "Bhopal":        { lat: 23.2599, lng: 77.4126 },
    "Bhubaneswar":   { lat: 20.2961, lng: 85.8245 },
    "Nagpur":        { lat: 21.1458, lng: 79.0882 },
    "Dehradun":      { lat: 30.3165, lng: 78.0322 },
    "Shimla":        { lat: 31.1048, lng: 77.1734 },
    "Amritsar":      { lat: 31.6340, lng: 74.8723 },
    "Patna":         { lat: 25.5941, lng: 85.1376 },
    "Ranchi":        { lat: 23.3441, lng: 85.3096 },
    "Guwahati":      { lat: 26.1445, lng: 91.7362 },
  };

  const CITY_AUTHORITIES: Record<string, string> = {
    "Delhi": "Delhi Development Authority (DDA) / MCD",
    "New Delhi": "New Delhi Municipal Council (NDMC) / DDA",
    "Noida": "New Okhla Industrial Development Authority (NOIDA)",
    "Greater Noida": "Greater Noida Industrial Development Authority (GNIDA)",
    "Gurugram": "Gurugram Metropolitan Development Authority (GMDA) / DTCP Haryana",
    "Gurgaon": "Gurugram Metropolitan Development Authority (GMDA) / DTCP Haryana",
    "Faridabad": "Municipal Corporation Faridabad (MCF) / HSVP",
    "Ghaziabad": "Ghaziabad Development Authority (GDA)",
    "Bahadurgarh": "Municipal Council Bahadurgarh / HSVP",
    "Sonipat": "Municipal Corporation Sonipat / HSVP",
    "Panipat": "Municipal Corporation Panipat / HSVP",
    "Rohtak": "Municipal Corporation Rohtak / HSVP",
    "Manesar": "HSIIDC / Municipal Corporation Manesar / GMDA",
    "Delhi NCR": "NCR Planning Board (Authority requires user confirmation)",
    "Mumbai": "Brihanmumbai Municipal Corporation (BMC) / MMRDA",
    "Bengaluru": "Bruhat Bengaluru Mahanagara Palike (BBMP) / BDA",
    "Chennai": "Chennai Metropolitan Development Authority (CMDA)",
    "Kolkata": "Kolkata Municipal Corporation (KMC) / KMDA",
    "Hyderabad": "Greater Hyderabad Municipal Corporation (GHMC) / HMDA",
    "Pune": "Pune Municipal Corporation (PMC) / PMRDA",
    "Jaipur": "Jaipur Development Authority (JDA)",
    "Ahmedabad": "Ahmedabad Urban Development Authority (AUDA) / AMC",
    "Surat": "Surat Municipal Corporation (SMC) / SUDA",
    "Lucknow": "Lucknow Development Authority (LDA)",
    "Chandigarh": "Chandigarh Administration — Estate Office",
    "Goa": "Town and Country Planning Department Goa (TCP Goa)",
    "Kochi": "Greater Cochin Development Authority (GCDA) / KMC",
    "Indore": "Indore Municipal Corporation (IMC) / IDA",
    "Bhopal": "Bhopal Municipal Corporation (BMC) / BDA",
    "Bhubaneswar": "Bhubaneswar Development Authority (BDA)",
    "Nagpur": "Nagpur Municipal Corporation (NMC) / NIT",
    "Dehradun": "Mussoorie Dehradun Development Authority (MDDA)",
    "Shimla": "Shimla Municipal Corporation / TCP Himachal",
    "Amritsar": "Amritsar Municipal Corporation / PUDA",
    "Patna": "Patna Municipal Corporation (PMC) / PRDA",
    "Ranchi": "Ranchi Regional Development Authority (RRDA)",
    "Guwahati": "Guwahati Metropolitan Development Authority (GMDA)"
  };

  const steps = [
    { title: "1. Project & Location", icon: <Building2 className="w-4 h-4" /> },
    { title: "2. Site & Orientation", icon: <Compass className="w-4 h-4" /> },
    { title: "3. Envelope & Structure", icon: <Layers className="w-4 h-4" /> },
    { title: "4. HVAC & Lighting", icon: <Zap className="w-4 h-4" /> },
    { title: "5. Water & Solar", icon: <Droplets className="w-4 h-4" /> },
    { title: "6. Green & Materials", icon: <Trees className="w-4 h-4" /> }
  ];

  const loadingSteps = [
    "Analyzing local climate data for " + formData.project.location + "...",
    "Calculating envelope thermal heat gains (Q_wall, Q_roof, Q_window)...",
    "Evaluating solar PV radiation yield & peak sun hours...",
    "Analyzing daily occupant water mass balance & greywater potential...",
    "Evaluating microclimate heat island risk & green coverage...",
    "Generating physics-driven optimization recommendations..."
  ];

  const handlePreFillDelhiDemo = () => {
    setFormData(DEMO_PROJECT_INPUT);
    setValidationErrors([]);
  };

  const validateInput = (): boolean => {
    const errs: string[] = [];
    if (formData.site.plot_area_m2 <= 0) errs.push("Plot area must be greater than 0.");
    if (formData.site.built_up_area_m2 <= 0) errs.push("Built-up area must be greater than 0.");
    if (formData.site.built_up_area_m2 > formData.site.plot_area_m2 * formData.site.num_floors * 1.05) {
      errs.push("Built-up area cannot exceed Plot Area × Number of Floors.");
    }
    if (formData.envelope.num_occupants <= 0) errs.push("Number of occupants must be at least 1.");
    if (formData.envelope.window_wall_ratio_pct < 0 || formData.envelope.window_wall_ratio_pct > 100) {
      errs.push("Window-to-Wall ratio must be between 0% and 100%.");
    }
    setValidationErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;

    setIsAnalyzing(true);
    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < loadingSteps.length) {
        setLoadingTextIndex(stepIdx);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        onAnalyze(formData);
      }
    }, 400);
  };

  const sqFtMultiplier = 10.7639;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">New Building Analysis</h2>
            <span className="eco-pill bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs">
              Project Wizard
            </span>
          </div>
          <p className="text-xs text-slate-500">Enter architectural & engineering parameters for physics-based sustainability calculation.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUnitIsSqFt(false)}
              className={`px-3 py-1 rounded-lg transition-colors ${!unitIsSqFt ? 'bg-white text-emerald-950 shadow-2xs' : 'text-slate-500'}`}
            >
              m² (Metric)
            </button>
            <button
              type="button"
              onClick={() => setUnitIsSqFt(true)}
              className={`px-3 py-1 rounded-lg transition-colors ${unitIsSqFt ? 'bg-white text-emerald-950 shadow-2xs' : 'text-slate-500'}`}
            >
              sq ft (Imperial)
            </button>
          </div>

          {/* Quick Demo Pre-fill */}
          <button
            type="button"
            onClick={handlePreFillDelhiDemo}
            className="eco-btn-secondary text-xs px-3.5 py-2 text-amber-900 border-amber-300 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5 font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Pre-fill Delhi Demo
          </button>
        </div>
      </div>

      {/* Validation Warnings */}
      {validationErrors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Input Validation Warnings:
          </div>
          <ul className="list-disc pl-5 space-y-0.5">
            {validationErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStep(idx)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
              activeStep === idx
                ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={activeStep === idx ? 'text-emerald-300' : 'text-slate-400'}>{step.icon}</span>
            <span className="truncate">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Input Form Body */}
      <div className="eco-card p-6 md:p-8 space-y-6">
        {/* STEP 1: Project & Location */}
        {activeStep === 0 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">1. Project Identification & Location Database</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-800"
                  value={formData.project.project_name}
                  onChange={(e) => setFormData({ ...formData, project: { ...formData.project, project_name: e.target.value } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / Climate Zone (India)</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-800"
                  value={formData.project.location}
                  onChange={(e) => {
                    const city = e.target.value;
                    const coords = CITY_COORDS[city] || { lat: 28.6139, lng: 77.2090 };
                    setFormData({
                      ...formData,
                      project: {
                        ...formData.project,
                        location: city,
                        latitude: coords.lat,
                        longitude: coords.lng
                      }
                    });
                  }}
                >
                  <optgroup label="📍 Delhi NCR Locations">
                    {NCR_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🏛️ Major Indian Cities &amp; States">
                    {MAJOR_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                </select>
                <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                  <span className="font-bold">Authority:</span>
                  <span>{CITY_AUTHORITIES[formData.project.location] || "Authority: Requires user confirmation"}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Building Typology</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-800"
                  value={formData.project.building_type}
                  onChange={(e) => setFormData({ ...formData, project: { ...formData.project, building_type: e.target.value as BuildingType } })}
                >
                  {[
                    "Residential", "Individual Residential", "Villa", "Apartment", "Multi-Storey Residential",
                    "Group Housing", "Commercial", "Office", "School", "Educational", "Hospital",
                    "Institutional", "Hostel", "Retail", "Mixed-use", "Public Building", "Sustainable Community"
                  ].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Construction Budget (₹ INR)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-800"
                  value={formData.project.total_budget}
                  onChange={(e) => setFormData({ ...formData, project: { ...formData.project, total_budget: Number(e.target.value) } })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Site & Orientation */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">2. Site Parameters & Orientation Exposure</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Plot Area ({unitIsSqFt ? 'sq ft' : 'm²'})
                </label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={unitIsSqFt ? Math.round(formData.site.plot_area_m2 * sqFtMultiplier) : formData.site.plot_area_m2}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({ ...formData, site: { ...formData.site, plot_area_m2: unitIsSqFt ? val / sqFtMultiplier : val } });
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Built-up Area ({unitIsSqFt ? 'sq ft' : 'm²'})
                </label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={unitIsSqFt ? Math.round(formData.site.built_up_area_m2 * sqFtMultiplier) : formData.site.built_up_area_m2}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({ ...formData, site: { ...formData.site, built_up_area_m2: unitIsSqFt ? val / sqFtMultiplier : val } });
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Number of Floors</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.site.num_floors}
                  onChange={(e) => setFormData({ ...formData, site: { ...formData.site, num_floors: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Building Height (m)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.site.building_height_m}
                  onChange={(e) => setFormData({ ...formData, site: { ...formData.site, building_height_m: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Building Azimuth (Degrees from North)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.orientation.building_azimuth_deg}
                  onChange={(e) => setFormData({ ...formData, orientation: { ...formData.orientation, building_azimuth_deg: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Main Glazing Exposure</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.orientation.main_exposure}
                  onChange={(e) => setFormData({ ...formData, orientation: { ...formData.orientation, main_exposure: e.target.value } })}
                >
                  <option value="North">North</option>
                  <option value="South-East">South-East</option>
                  <option value="South">South</option>
                  <option value="West">West (High Solar Load)</option>
                  <option value="East">East</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Envelope & Thermal Properties */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">3. Building Envelope & Wall/Roof Assemblies</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Occupants Count</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.envelope.num_occupants}
                  onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, num_occupants: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Window-to-Wall Ratio (WWR %)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.envelope.window_wall_ratio_pct}
                  onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, window_wall_ratio_pct: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Glass Spec & Solar Factor</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.envelope.glass_type}
                  onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, glass_type: e.target.value as GlassType } })}
                >
                  <option value="Single Clear (U=5.8, SHGC=0.82)">Single Clear (U=5.8, SHGC=0.82)</option>
                  <option value="Double Clear (U=2.8, SHGC=0.70)">Double Clear (U=2.8, SHGC=0.70)</option>
                  <option value="Low-E Double (U=1.6, SHGC=0.40)">Low-E Double (U=1.6, SHGC=0.40)</option>
                  <option value="Triple Low-E High Eff (U=1.0, SHGC=0.30)">Triple Low-E High Eff (U=1.0, SHGC=0.30)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Roof Type Assembly</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.envelope.roof_type}
                  onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, roof_type: e.target.value as RoofType } })}
                >
                  <option value="Concrete Slab">Concrete Slab</option>
                  <option value="Insulated Concrete">Insulated Concrete</option>
                  <option value="Cool Roof White (High Albedo)">Cool Roof White (High Albedo)</option>
                  <option value="Green Roof / Vegetated">Green Roof / Vegetated</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shading Overhang Depth (m)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.envelope.overhang_depth_m}
                  onChange={(e) => setFormData({ ...formData, envelope: { ...formData.envelope, overhang_depth_m: Number(e.target.value) } })}
                />
              </div>

              {isProfessionalMode && (
                <div className="p-3 bg-emerald-950 text-emerald-100 rounded-xl text-xs space-y-1 col-span-full">
                  <span className="font-bold block text-emerald-300">Architect Pro Mode - Thermal Properties:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>Wall U-value: {formData.envelope.wall_u_value} W/m²K</div>
                    <div>Roof U-value: {formData.envelope.roof_u_value} W/m²K</div>
                    <div>Window U-value: {formData.envelope.window_u_value} W/m²K</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: HVAC & Lighting */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">4. Air Conditioning, Lighting & Appliances</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">HVAC System Type</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.hvac_lighting.hvac_type}
                  onChange={(e) => setFormData({ ...formData, hvac_lighting: { ...formData.hvac_lighting, hvac_type: e.target.value as HvacType } })}
                >
                  <option value="Split AC (COP 3.2)">Split AC (COP 3.2)</option>
                  <option value="Inverter Split AC (COP 4.2)">Inverter Split AC (COP 4.2)</option>
                  <option value="VRF / VRV System (COP 4.8)">VRF / VRV System (COP 4.8)</option>
                  <option value="Chiller Plant (COP 5.5)">Chiller Plant (COP 5.5)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">AC Usage Hours/Day</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.hvac_lighting.ac_usage_hours}
                  onChange={(e) => setFormData({ ...formData, hvac_lighting: { ...formData.hvac_lighting, ac_usage_hours: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lighting Technology</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.hvac_lighting.lighting_type}
                  onChange={(e) => setFormData({ ...formData, hvac_lighting: { ...formData.hvac_lighting, lighting_type: e.target.value as LightingType } })}
                >
                  <option value="Incandescent / Halogen (15 W/m²)">Incandescent / Halogen (15 W/m²)</option>
                  <option value="Fluorescent T8/T5 (8 W/m²)">Fluorescent T8/T5 (8 W/m²)</option>
                  <option value="Standard LED (5 W/m²)">Standard LED (5 W/m²)</option>
                  <option value="High-Efficiency Smart LED (3 W/m²)">High-Efficiency Smart LED (3 W/m²)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Water & Solar */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">5. Water Conservation & Solar PV Systems</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Daily Water Use (Litres/Person/Day)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.water.daily_water_per_person_l}
                  onChange={(e) => setFormData({ ...formData, water: { ...formData.water, daily_water_per_person_l: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Available Solar Roof Area (m²)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.solar.available_solar_area_m2}
                  onChange={(e) => setFormData({ ...formData, solar: { ...formData.solar, available_solar_area_m2: Number(e.target.value) } })}
                />
              </div>

              <div className="space-y-2 col-span-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block">Conservation Interventions:</span>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.water.low_flow_fixtures_enabled}
                      onChange={(e) => setFormData({ ...formData, water: { ...formData.water, low_flow_fixtures_enabled: e.target.checked } })}
                    />
                    Low-Flow Aerator Fixtures
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.water.rainwater_harvesting_enabled}
                      onChange={(e) => setFormData({ ...formData, water: { ...formData.water, rainwater_harvesting_enabled: e.target.checked } })}
                    />
                    Rainwater Harvesting Catchment
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.water.greywater_reuse_enabled}
                      onChange={(e) => setFormData({ ...formData, water: { ...formData.water, greywater_reuse_enabled: e.target.checked } })}
                    />
                    On-Site Greywater Recycling
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Green & Materials */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">6. Green Infrastructure & Material Embodied Carbon</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proposed Canopy Trees Count</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.green.proposed_trees_count}
                  onChange={(e) => setFormData({ ...formData, green: { ...formData.green, proposed_trees_count: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Concrete Quantity (Tons)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.materials.concrete_qty_tons}
                  onChange={(e) => setFormData({ ...formData, materials: { ...formData.materials, concrete_qty_tons: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Steel Reinforcement Quantity (Tons)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.materials.steel_qty_tons}
                  onChange={(e) => setFormData({ ...formData, materials: { ...formData.materials, steel_qty_tons: Number(e.target.value) } })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Recycled Materials Content (%)</label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  value={formData.materials.recycled_materials_pct}
                  onChange={(e) => setFormData({ ...formData, materials: { ...formData.materials, recycled_materials_pct: Number(e.target.value) } })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            className="eco-btn-secondary text-xs px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="eco-btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="eco-btn-primary bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-sm px-6 py-2.5 shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Analyze with EcoBuild AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Analyzing Loading Animation Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 text-white rounded-2xl p-8 max-w-md w-full text-center space-y-6 border border-emerald-500/30 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Physics Engine</h3>
              <p className="text-xs font-mono text-emerald-300 transition-all duration-300">
                {loadingSteps[loadingTextIndex]}
              </p>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((loadingTextIndex + 1) / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
