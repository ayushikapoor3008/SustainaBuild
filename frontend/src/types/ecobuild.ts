export type BuildingType =
  | 'Residential'
  | 'Commercial'
  | 'School'
  | 'Hospital'
  | 'Office'
  | 'Hostel'
  | 'Retail'
  | 'Mixed-use';

export type GlassType =
  | 'Single Clear (U=5.8, SHGC=0.82)'
  | 'Double Clear (U=2.8, SHGC=0.70)'
  | 'Low-E Double (U=1.6, SHGC=0.40)'
  | 'Triple Low-E High Eff (U=1.0, SHGC=0.30)';

export type RoofType =
  | 'Concrete Slab'
  | 'Insulated Concrete'
  | 'Cool Roof White (High Albedo)'
  | 'Green Roof / Vegetated'
  | 'Metal Deck';

export type HvacType =
  | 'Split AC (COP 3.2)'
  | 'Inverter Split AC (COP 4.2)'
  | 'VRF / VRV System (COP 4.8)'
  | 'Chiller Plant (COP 5.5)'
  | 'Evaporative Cooling (COP 8.0)'
  | 'No Active HVAC / Fans Only';

export type LightingType =
  | 'Incandescent / Halogen (15 W/m²)'
  | 'Fluorescent T8/T5 (8 W/m²)'
  | 'Standard LED (5 W/m²)'
  | 'High-Efficiency Smart LED (3 W/m²)';

export interface ProjectInfo {
  project_name: string;
  location: string;
  latitude: number;
  longitude: number;
  building_type: BuildingType;
  total_budget: number;
  sustainable_budget: number;
  max_additional_investment: number;
}

export interface SiteParameters {
  plot_area_m2: number;
  built_up_area_m2: number;
  num_floors: number;
  building_height_m: number;
  ground_coverage_pct: number;
  existing_vegetation_pct: number;
  proposed_vegetation_pct: number;
  open_area_pct: number;
  road_width_m: number;
  surrounding_building_height_m: number;
  site_slope_deg: number;
}

export interface OrientationParameters {
  north_orientation_deg: number;
  building_azimuth_deg: number;
  main_exposure: string;
  main_entrance_direction: string;
}

export interface BuildingEnvelope {
  floor_area_m2: number;
  num_occupants: number;
  occupancy_hours_per_day: number;
  window_wall_ratio_pct: number;
  window_orientation: string;
  glass_type: GlassType;
  window_u_value: number;
  wall_material: string;
  wall_u_value: number;
  roof_material: string;
  roof_u_value: number;
  floor_material: string;
  insulation_thickness_cm: number;
  roof_type: RoofType;
  shading_device: string;
  overhang_depth_m: number;
}

export interface HvacLightingAppliances {
  hvac_type: HvacType;
  hvac_cop: number;
  ac_usage_hours: number;
  set_temperature_c: number;
  fan_usage: boolean;
  natural_ventilation_available: boolean;
  lighting_type: LightingType;
  lighting_power_density_w_m2: number;
  avg_lighting_hours_per_day: number;
  daylight_availability: number;
  refrigerators_qty: number;
  fans_qty: number;
  computers_qty: number;
  tvs_qty: number;
  pumps_qty: number;
  other_appliances_kw: number;
  appliance_operating_hours: number;
}

export interface WaterParameters {
  daily_water_per_person_l: number;
  fixture_types: string;
  low_flow_fixtures_enabled: boolean;
  greywater_reuse_enabled: boolean;
  rainwater_harvesting_enabled: boolean;
  rainwater_tank_capacity_l: number;
}

export interface SolarParameters {
  roof_area_m2: number;
  available_solar_area_m2: number;
  panel_efficiency_pct: number;
  panel_capacity_w: number;
  inverter_efficiency_pct: number;
  shading_factor_pct: number;
}

export interface GreenParameters {
  existing_trees_count: number;
  proposed_trees_count: number;
  green_roof_enabled: boolean;
  green_roof_area_m2: number;
  vertical_garden_enabled: boolean;
  vertical_garden_area_m2: number;
  lawn_area_m2: number;
  native_plants_pct: number;
  permeable_surface_pct: number;
}

export interface MaterialParameters {
  concrete_qty_tons: number;
  steel_qty_tons: number;
  brick_qty_thousand: number;
  cement_qty_tons: number;
  wood_qty_m3: number;
  glass_qty_m2: number;
  recycled_materials_pct: number;
}

export interface FullProjectInput {
  project: ProjectInfo;
  site: SiteParameters;
  orientation: OrientationParameters;
  envelope: BuildingEnvelope;
  hvac_lighting: HvacLightingAppliances;
  water: WaterParameters;
  solar: SolarParameters;
  green: GreenParameters;
  materials: MaterialParameters;
  is_professional_mode?: boolean;
}

export interface WhatIfOptions {
  solar_panels: boolean;
  battery_storage?: boolean;
  green_roof: boolean;
  plant_trees: boolean;
  vertical_garden?: boolean;
  permeable_paving?: boolean;
  external_shading: boolean;
  natural_ventilation: boolean;
  reflective_roof: boolean;
  led_lighting?: boolean;
  rainwater_harvesting: boolean;
  greywater_reuse: boolean;
  stp_reuse?: boolean;
  composting?: boolean;
  low_e_glass: boolean;
  roof_insulation: boolean;
  wall_insulation: boolean;
  increase_green_area: boolean;
  change_orientation: boolean;
}

export interface CalculationDetail {
  formula: string;
  inputs: Record<string, any>;
  values: Record<string, any>;
  calculation_steps: string;
  result_str: string;
  assumptions: string[];
  confidence_level: number;
  level_name: string;
}

export interface HeatGainBreakdown {
  q_wall_kw: number;
  q_roof_kw: number;
  q_window_conduction_kw: number;
  q_window_solar_kw: number;
  q_people_kw: number;
  q_lighting_kw: number;
  q_equipment_kw: number;
  q_infiltration_kw: number;
  q_total_kw: number;
}

export interface EnergyMetrics {
  lighting_annual_kwh: number;
  appliance_annual_kwh: number;
  hvac_cooling_annual_kwh: number;
  pump_other_annual_kwh: number;
  total_annual_kwh: number;
  energy_use_intensity_eui: number;
  heat_gain_breakdown: HeatGainBreakdown;
  monthly_energy_kwh: number[];
}

export interface WaterMetrics {
  daily_demand_litres: number;
  annual_demand_litres: number;
  drinking_kitchen_litres: number;
  toilet_flushing_litres: number;
  bathing_washing_litres: number;
  landscaping_litres: number;
  low_flow_savings_litres: number;
  greywater_generated_litres: number;
  greywater_reused_litres: number;
  rainwater_harvested_litres: number;
  fresh_water_reduction_pct: number;
  water_demand_coverage_pct: number;
  monthly_rainwater_litres: number[];
  monthly_water_demand_litres: number[];
}

export interface SolarMetrics {
  panel_count: number;
  installed_capacity_kwp: number;
  annual_generation_kwh: number;
  solar_coverage_pct: number;
  annual_co2_avoided_tons: number;
  peak_sun_hours_avg: number;
  monthly_generation_kwh: number[];
}

export interface GreenMetrics {
  green_coverage_pct: number;
  recommended_green_pct: number;
  tree_recommendation_count: number;
  green_roof_recommendation_m2: number;
  vertical_garden_recommendation_m2: number;
  permeable_recommendation_pct: number;
  microclimate_heat_risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  potential_heat_reduction_score: number;
}

export interface CarbonMetrics {
  operational_co2_annual_tons: number;
  embodied_co2_total_tons: number;
  total_lifetime_co2_30yr_tons: number;
  co2_per_sq_meter_kg: number;
  material_sustainability_score: number;
  solar_carbon_offset_tons: number;
  potential_carbon_reduction_tons: number;
}

export interface PassiveMetrics {
  passive_cooling_score: number;
  estimated_ach: number;
  natural_ventilation_suitability: string;
  orientation_benefit_pct: number;
  shading_benefit_pct: number;
  roof_insulation_benefit_pct: number;
  total_cooling_reduction_pct: number;
}

export interface EcoScores {
  overall_eco_score: number;
  energy_score: number;
  water_score: number;
  solar_score: number;
  green_score: number;
  climate_score: number;
  material_score: number;
}

export interface ConfidenceMetrics {
  model_confidence_pct: number;
  confidence_level_str: string;
  level_breakdown: Record<string, string>;
  assumptions_and_limitations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  why: string;
  impact: 'High' | 'Medium' | 'Low';
  cost: 'Low' | 'Medium' | 'High';
  priority: number;
  estimated_energy_reduction_pct: number;
  estimated_cost_inr: number;
  payback_years: number;
  confidence_pct: number;
  category: string;
}

export interface AnalysisResult {
  project_id?: string;
  project_name: string;
  city: string;
  eco_scores: EcoScores;
  energy: EnergyMetrics;
  water: WaterMetrics;
  solar: SolarMetrics;
  green: GreenMetrics;
  carbon: CarbonMetrics;
  passive: PassiveMetrics;
  confidence: ConfidenceMetrics;
  recommendations: Recommendation[];
  calculations_explained: Record<string, CalculationDetail>;
}

export interface SavedProjectRecord {
  id: string;
  project_name: string;
  city: string;
  building_type: string;
  created_at: string;
  updated_at: string;
  overall_eco_score: number;
  eui_kwh_m2_yr: number;
  annual_co2_tons: number;
  input_data: FullProjectInput;
  analysis_result: AnalysisResult;
}

// ─── SustainaBuild AI — Extended Types ────────────────────────────────────────

export type ComplianceStatus = 'PASS' | 'WARNING' | 'NOT_VERIFIED';
export type VerificationStatus = 'VERIFIED' | 'REQUIRES_CONFIRMATION' | 'NOT_VERIFIED';

export interface ComplianceResultItem {
  regulation_id: string;
  regulation_name: string;
  category: string;
  authority: string;
  required_value: number;
  required_label: string;
  proposed_value: number | null;
  proposed_label: string;
  required_green_m2?: number;
  proposed_green_m2?: number;
  difference_m2?: number;
  difference?: number;
  unit: string;
  status: ComplianceStatus;
  conditions: string;
  exceptions: string;
  official_source_name: string;
  official_source_url: string;
  last_verified_date: string;
  verification_status: VerificationStatus;
  confidence: string;
  notes: string;
}

export interface ComplianceReport {
  location: string;
  authority: string;
  authority_website: string;
  authority_confidence: string;
  building_type: string;
  plot_area_m2: number;
  built_up_area_m2: number;
  num_floors: number;
  building_height_m: number;
  road_width_m: number;
  regulations_checked: number;
  pass_count: number;
  warning_count: number;
  not_verified_count: number;
  results: ComplianceResultItem[];
  disclaimer: string;
  data_quality_note: string;
}

export interface ComplianceInput {
  location: string;
  building_type: string;
  plot_area_m2: number;
  built_up_area_m2: number;
  num_floors: number;
  building_height_m: number;
  road_width_m: number;
  ground_coverage_pct: number;
  proposed_green_pct: number;
  parking_ecs?: number;
  dwelling_units?: number;
}

export interface RenewableMetrics {
  installed_capacity_kwp: number;
  panel_count: number;
  panel_capacity_w: number;
  panel_efficiency_pct: number;
  usable_solar_area_m2: number;
  annual_generation_kwh: number;
  daily_generation_kwh: number;
  monthly_generation_kwh: number[];
  solar_coverage_pct: number;
  solar_surplus_kwh: number;
  annual_co2_avoided_tons: number;
  peak_sun_hours_avg: number;
  battery_capacity_kwh: number;
  usable_battery_kwh: number;
  depth_of_discharge_pct: number;
  round_trip_efficiency_pct: number;
  backup_hours: number;
  battery_charge_days_solar: number;
  energy_independence_pct: number;
  grid_dependency_pct: number;
  grid_saved_kwh: number;
  grid_cost_savings_inr: number;
  estimated_system_cost_inr: number;
  payback_years: number;
  assumptions: string[];
  data_quality: string;
}

export interface WaterCircularityMetrics {
  num_occupants: number;
  daily_demand_litres: number;
  annual_demand_litres: number;
  annual_rainfall_mm: number;
  monthly_rainfall_mm: number[];
  roof_area_m2: number;
  runoff_coefficient: number;
  collection_efficiency_pct: number;
  tank_capacity_l: number;
  suggested_tank_capacity_l: number;
  monthly_rainwater_harvested_l: number[];
  effective_monthly_rainwater_l: number[];
  annual_rainwater_potential_l: number;
  annual_rainwater_effective_l: number;
  rainwater_coverage_pct: number;
  months: string[];
  greywater_enabled: boolean;
  daily_greywater_generated_l: number;
  daily_greywater_reused_l: number;
  annual_greywater_reused_l: number;
  freshwater_saved_greywater_lpd: number;
  stp_enabled: boolean;
  daily_wastewater_l: number;
  stp_capacity_kld: number;
  daily_treated_reuse_l: number;
  annual_treated_reuse_l: number;
  stp_note: string;
  total_annual_reuse_l: number;
  fresh_water_saved_l: number;
  fresh_water_reduction_pct: number;
  water_independence_pct: number;
  water_circularity_score: number;
  assumptions: string[];
  data_quality: string;
}

export interface WasteMetrics {
  num_occupants: number;
  building_type: string;
  total_waste_kg_day: number;
  organic_waste_kg_day: number;
  dry_recyclable_kg_day: number;
  residual_waste_kg_day: number;
  total_waste_kg_year: number;
  organic_waste_kg_year: number;
  dry_recyclable_kg_year: number;
  residual_waste_kg_year: number;
  composting_enabled: boolean;
  compost_production_kg_year: number;
  recycling_enabled: boolean;
  recycled_kg_year: number;
  recyclable_fraction_pct: number;
  waste_diversion_pct: number;
  diverted_kg_year: number;
  residual_to_landfill_kg_year: number;
  waste_circularity_score: number;
  recommendations: string[];
  assumptions: string[];
  data_quality: string;
}

export interface CircularityBreakdownItem {
  dimension: string;
  weight_pct: number;
  score: number;
  contribution: number;
  description: string;
  color: string;
}

export interface ResourceCircularityResult {
  resource_circularity_score: number;
  grade: string;
  grade_label: string;
  grade_color: string;
  breakdown: CircularityBreakdownItem[];
  energy_independence_pct: number;
  water_independence_pct: number;
  waste_diversion_pct: number;
  green_coverage_pct: number;
  renewable_energy_coverage_pct: number;
  grid_dependency_pct: number;
  estimated_co2_reduction_tons_yr: number;
  electricity_savings_inr_yr: number;
  water_savings_inr_yr: number;
  total_annual_savings_inr: number;
  methodology: Record<string, any>;
  disclaimer: string;
}

// Multi-Storey Planner types
export interface MultiStoreyFloor {
  floor_number: number;
  floor_label: string;
  use: string;
  area_m2: number;
  height_m: number;
  rooms: string[];
}

export interface MultiStoreyInput {
  plot_width_m: number;
  plot_depth_m: number;
  plot_area_m2: number;
  setback_front_m: number;
  setback_rear_m: number;
  setback_side_m: number;
  building_width_m: number;
  building_depth_m: number;
  num_floors: number;
  floor_to_floor_height_m: number;
  total_height_m: number;
  building_type: string;
  floors: MultiStoreyFloor[];
  parking_area_m2: number;
  green_area_m2: number;
  solar_area_m2: number;
  orientation_deg: number;
  has_lift: boolean;
  has_staircase: boolean;
  has_rainwater_tank: boolean;
  has_stp: boolean;
}

// Extended BuildingType for SustainaBuild
export type ExtendedBuildingType =
  | 'Residential'
  | 'Commercial'
  | 'School'
  | 'Hospital'
  | 'Office'
  | 'Hostel'
  | 'Retail'
  | 'Mixed-use'
  | 'Individual Residential'
  | 'Villa'
  | 'Apartment'
  | 'Multi-Storey Residential'
  | 'Group Housing'
  | 'Educational'
  | 'Institutional'
  | 'Public Building'
  | 'Sustainable Community';

