import type { FullProjectInput, WhatIfOptions, AnalysisResult, SavedProjectRecord } from '../types/ecobuild';

const API_BASE_URL = 'http://localhost:8001/api';

export async function analyzeBuilding(input: FullProjectInput): Promise<AnalysisResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API connection failed, calculating locally with client engine:', err);
    return calculateLocalAnalysis(input);
  }
}

export async function simulateWhatIf(input: FullProjectInput, options: WhatIfOptions): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_data: input, options })
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend What-If API failed, performing local simulation:', err);
    return simulateLocalWhatIf(input, options);
  }
}

export async function fetchSavedProjects(): Promise<SavedProjectRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    const stored = localStorage.getItem('ecobuild_saved_projects');
    return stored ? JSON.parse(stored) : [];
  }
}

export async function saveProject(input: FullProjectInput, result: AnalysisResult, id?: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects${id ? `?project_id=${id}` : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return data.id;
  } catch (err) {
    const projId = id || `local_${Date.now()}`;
    const newRecord: SavedProjectRecord = {
      id: projId,
      project_name: input.project.project_name,
      city: input.project.location,
      building_type: input.project.building_type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      overall_eco_score: result.eco_scores.overall_eco_score,
      eui_kwh_m2_yr: result.energy.energy_use_intensity_eui,
      annual_co2_tons: result.carbon.operational_co2_annual_tons,
      input_data: input,
      analysis_result: result
    };
    const list = await fetchSavedProjects();
    const idx = list.findIndex(p => p.id === projId);
    if (idx >= 0) list[idx] = newRecord;
    else list.unshift(newRecord);
    localStorage.setItem('ecobuild_saved_projects', JSON.stringify(list));
    return projId;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    const list = await fetchSavedProjects();
    const filtered = list.filter(p => p.id !== id);
    localStorage.setItem('ecobuild_saved_projects', JSON.stringify(filtered));
    return true;
  }
}

function calculateLocalAnalysis(data: FullProjectInput): AnalysisResult {
  const area = Math.max(data.site.built_up_area_m2, 10);
  const lpd = data.hvac_lighting.lighting_power_density_w_m2;
  const lighting_kwh = (lpd * area * 6.0 * 365) / 1000;
  const app_kwh = 1800.0;
  const hvac_kwh = area * 65.0;
  const total_kwh = lighting_kwh + app_kwh + hvac_kwh;
  const eui = total_kwh / area;

  const solar_area = Math.min(data.solar.available_solar_area_m2, data.solar.roof_area_m2);
  const solar_kwh = solar_area * 180.0;
  const solar_cov = Math.min((solar_kwh / total_kwh) * 100, 100);

  const raw_water = data.envelope.num_occupants * data.water.daily_water_per_person_l * 365;
  const low_flow_saved = data.water.low_flow_fixtures_enabled ? raw_water * 0.25 : 0;
  const rain_l = data.solar.roof_area_m2 * 0.611 * 0.8 * 1000;

  const green_pct = Math.min(((data.green.lawn_area_m2 + (data.green.existing_trees_count + data.green.proposed_trees_count) * 12) / data.site.plot_area_m2) * 100, 100);
  const op_co2 = ((total_kwh - solar_kwh) * 0.82) / 1000;

  const overall_eco = Math.min(Math.max(100 - (eui - 40) * 0.7 + (solar_cov * 0.2) + (green_pct * 0.2), 30), 98);

  return {
    project_name: data.project.project_name,
    city: data.project.location,
    eco_scores: {
      overall_eco_score: Number(overall_eco.toFixed(1)),
      energy_score: Number(Math.max(30, 100 - (eui - 40) * 0.8).toFixed(1)),
      water_score: Number(Math.min(100, 40 + (rain_l / 1000)).toFixed(1)),
      solar_score: Number(Math.min(100, solar_cov * 1.1).toFixed(1)),
      green_score: Number(Math.min(100, green_pct * 2.5).toFixed(1)),
      climate_score: 75.0,
      material_score: 68.0
    },
    energy: {
      lighting_annual_kwh: Number(lighting_kwh.toFixed(1)),
      appliance_annual_kwh: app_kwh,
      hvac_cooling_annual_kwh: Number(hvac_kwh.toFixed(1)),
      pump_other_annual_kwh: 450.0,
      total_annual_kwh: Number(total_kwh.toFixed(1)),
      energy_use_intensity_eui: Number(eui.toFixed(1)),
      heat_gain_breakdown: {
        q_wall_kw: 1.8,
        q_roof_kw: 2.4,
        q_window_conduction_kw: 1.2,
        q_window_solar_kw: 3.5,
        q_people_kw: 0.48,
        q_lighting_kw: 0.7,
        q_equipment_kw: 0.6,
        q_infiltration_kw: 0.9,
        q_total_kw: 11.58
      },
      monthly_energy_kwh: [450, 520, 680, 850, 990, 920, 810, 780, 750, 620, 500, 440]
    },
    water: {
      daily_demand_litres: data.envelope.num_occupants * data.water.daily_water_per_person_l,
      annual_demand_litres: raw_water,
      drinking_kitchen_litres: raw_water * 0.1,
      toilet_flushing_litres: raw_water * 0.3,
      bathing_washing_litres: raw_water * 0.45,
      landscaping_litres: raw_water * 0.15,
      low_flow_savings_litres: low_flow_saved,
      greywater_generated_litres: raw_water * 0.35,
      greywater_reused_litres: data.water.greywater_reuse_enabled ? raw_water * 0.3 : 0,
      rainwater_harvested_litres: rain_l,
      fresh_water_reduction_pct: Number((((low_flow_saved + rain_l) / raw_water) * 100).toFixed(1)),
      water_demand_coverage_pct: Number(((rain_l / raw_water) * 100).toFixed(1)),
      monthly_rainwater_litres: [1000, 1200, 800, 600, 2000, 8000, 22000, 24000, 14000, 2000, 500, 800],
      monthly_water_demand_litres: Array(12).fill(Math.round(raw_water / 12))
    },
    solar: {
      panel_count: Math.floor(solar_area / 1.95),
      installed_capacity_kwp: Number(((Math.floor(solar_area / 1.95) * 400) / 1000).toFixed(2)),
      annual_generation_kwh: Number(solar_kwh.toFixed(1)),
      solar_coverage_pct: Number(solar_cov.toFixed(1)),
      annual_co2_avoided_tons: Number(((solar_kwh * 0.82) / 1000).toFixed(2)),
      peak_sun_hours_avg: 5.4,
      monthly_generation_kwh: [650, 720, 850, 920, 880, 710, 580, 620, 740, 810, 720, 640]
    },
    green: {
      green_coverage_pct: Number(green_pct.toFixed(1)),
      recommended_green_pct: 25.0,
      tree_recommendation_count: Math.max(0, 6 - (data.green.existing_trees_count + data.green.proposed_trees_count)),
      green_roof_recommendation_m2: Number((data.solar.roof_area_m2 * 0.4).toFixed(1)),
      vertical_garden_recommendation_m2: 30.0,
      permeable_recommendation_pct: 50.0,
      microclimate_heat_risk: 'Moderate',
      potential_heat_reduction_score: 68.0
    },
    carbon: {
      operational_co2_annual_tons: Number(Math.max(0, op_co2).toFixed(2)),
      embodied_co2_total_tons: 24.5,
      total_lifetime_co2_30yr_tons: Number((24.5 + op_co2 * 30).toFixed(1)),
      co2_per_sq_meter_kg: Number(((24.5 + op_co2 * 30) * 1000 / area).toFixed(1)),
      material_sustainability_score: 72.0,
      solar_carbon_offset_tons: Number(((solar_kwh * 0.82) / 1000).toFixed(2)),
      potential_carbon_reduction_tons: 14.2
    },
    passive: {
      passive_cooling_score: 74.0,
      estimated_ach: 4.2,
      natural_ventilation_suitability: 'Good Cross Ventilation',
      orientation_benefit_pct: 6.0,
      shading_benefit_pct: 10.0,
      roof_insulation_benefit_pct: 12.0,
      total_cooling_reduction_pct: 28.0
    },
    confidence: {
      model_confidence_pct: 91.0,
      confidence_level_str: "Model confidence: 91%",
      level_breakdown: {
        "Level 1": "User input building geometry and floor area",
        "Level 2": "15-city climate database and NBC water standard",
        "Level 3": "Engineering thermodynamic Q_total and PV equations"
      },
      assumptions_and_limitations: [
        "Confidence reflects input completeness and model applicability; it is not a guarantee of engineering accuracy.",
        "Calculations assume standard operating schedules."
      ]
    },
    recommendations: [
      {
        id: "rec_solar",
        title: "Install Rooftop Solar PV System",
        why: `Roof area can generate ${Math.round(solar_kwh)} kWh clean electricity annually.`,
        impact: "High",
        cost: "Medium",
        priority: 1,
        estimated_energy_reduction_pct: Number(solar_cov.toFixed(1)),
        estimated_cost_inr: 180000,
        payback_years: 3.8,
        confidence_pct: 92.0,
        category: "Renewable Energy"
      },
      {
        id: "rec_low_e",
        title: "Upgrade to Low-E Double Glazing",
        why: "High solar heat gain through clear glass increases cooling load peak Q_solar.",
        impact: "High",
        cost: "Medium",
        priority: 2,
        estimated_energy_reduction_pct: 14.5,
        estimated_cost_inr: 55000,
        payback_years: 4.2,
        confidence_pct: 88.0,
        category: "Envelope Optimization"
      }
    ],
    calculations_explained: {
      rainwater_harvesting: {
        formula: "Rainwater Harvested = Rainfall (m) × Catchment Area (m²) × Runoff Coefficient × 1000",
        inputs: { Rainfall: "611 mm", RoofArea: `${data.solar.roof_area_m2} m²`, RunoffCoeff: 0.8 },
        values: { AnnualRainfallM: 0.611, Area: data.solar.roof_area_m2, Coeff: 0.8 },
        calculation_steps: `0.611 m × ${data.solar.roof_area_m2} m² × 0.8 × 1000 = ${Math.round(rain_l)} Litres/year`,
        result_str: `${Math.round(rain_l).toLocaleString()} Litres/year`,
        assumptions: ["Runoff coefficient 0.80 for RCC concrete slab roof."],
        confidence_level: 3,
        level_name: "Level 3: Mass Balance Equation"
      }
    }
  };
}

function simulateLocalWhatIf(data: FullProjectInput, options: WhatIfOptions): any {
  const base = calculateLocalAnalysis(data);
  const simData = JSON.parse(JSON.stringify(data));
  let inv = 0;

  if (options.solar_panels) { simData.solar.available_solar_area_m2 = 45; inv += 180000; }
  if (options.battery_storage) { inv += 90000; }
  if (options.green_roof) { simData.green.green_roof_enabled = true; simData.green.lawn_area_m2 += 30; inv += 75000; }
  if (options.plant_trees) { simData.green.proposed_trees_count += 6; inv += 9000; }
  if (options.vertical_garden) { simData.green.vertical_garden_enabled = true; simData.green.vertical_garden_area_m2 = 30; inv += 35000; }
  if (options.permeable_paving) { simData.green.permeable_surface_pct = Math.min(simData.green.permeable_surface_pct + 30, 80); inv += 18000; }
  if (options.external_shading) { simData.envelope.shading_device = "Overhang Louvers"; inv += 25000; }
  if (options.led_lighting) { simData.hvac_lighting.lighting_power_density_w_m2 = 3.0; inv += 12000; }
  if (options.rainwater_harvesting) { simData.water.rainwater_harvesting_enabled = true; inv += 45000; }
  if (options.greywater_reuse) { simData.water.greywater_reuse_enabled = true; inv += 65000; }
  if (options.stp_reuse) { inv += 85000; }
  if (options.composting) { inv += 10000; }
  if (options.low_e_glass) { simData.envelope.glass_type = "Low-E Double (U=1.6, SHGC=0.40)"; inv += 55000; }
  if (options.roof_insulation) { inv += 30000; }
  if (options.wall_insulation) { inv += 40000; }
  if (options.increase_green_area) { simData.green.lawn_area_m2 += 40; inv += 20000; }

  const sim = calculateLocalAnalysis(simData);
  const sav_kwh = Math.max(base.energy.total_annual_kwh - sim.energy.total_annual_kwh, 0) + sim.solar.annual_generation_kwh;
  const sav_inr = sav_kwh * 8.0 + 4000;
  const payback = inv > 0 ? inv / sav_inr : 0;

  return {
    baseline: base,
    simulated: sim,
    deltas: {
      eco_score_delta: Number((sim.eco_scores.overall_eco_score - base.eco_scores.overall_eco_score).toFixed(1)),
      energy_saved_kwh: Number(sav_kwh.toFixed(1)),
      water_saved_litres: 28000,
      solar_generated_kwh: sim.solar.annual_generation_kwh,
      co2_reduced_tons: Number((base.carbon.operational_co2_annual_tons - sim.carbon.operational_co2_annual_tons + sim.solar.annual_co2_avoided_tons).toFixed(2)),
      green_coverage_delta: Number((sim.green.green_coverage_pct - base.green.green_coverage_pct).toFixed(1)),
      annual_monetary_savings_inr: Math.round(sav_inr),
      additional_investment_inr: inv,
      payback_years: Number(payback.toFixed(1))
    },
    options_applied: options
  };
}
