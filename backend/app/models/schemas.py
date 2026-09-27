from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional, Any
from enum import Enum

class BuildingType(str, Enum):
    RESIDENTIAL = "Residential"
    COMMERCIAL = "Commercial"
    SCHOOL = "School"
    HOSPITAL = "Hospital"
    OFFICE = "Office"
    HOSTEL = "Hostel"
    RETAIL = "Retail"
    MIXED_USE = "Mixed-use"

class GlassType(str, Enum):
    SINGLE_CLEAR = "Single Clear (U=5.8, SHGC=0.82)"
    DOUBLE_CLEAR = "Double Clear (U=2.8, SHGC=0.70)"
    LOW_E_DOUBLE = "Low-E Double (U=1.6, SHGC=0.40)"
    TRIPLE_LOW_E = "Triple Low-E High Eff (U=1.0, SHGC=0.30)"

class RoofType(str, Enum):
    CONCRETE_SLAB = "Concrete Slab"
    INSULATED_CONCRETE = "Insulated Concrete"
    COOL_ROOF_WHITE = "Cool Roof White (High Albedo)"
    GREEN_ROOF = "Green Roof / Vegetated"
    METAL_DECK = "Metal Deck"

class HvacType(str, Enum):
    SPLIT_AC = "Split AC (COP 3.2)"
    INVERTER_SPLIT = "Inverter Split AC (COP 4.2)"
    VRF_SYSTEM = "VRF / VRV System (COP 4.8)"
    CHILLER_PLANT = "Central Chilled Water (COP 5.5)"
    EVAPORATIVE_COOLER = "Evaporative Cooling (COP 8.0)"
    NONE = "No Active HVAC / Fans Only"

class LightingType(str, Enum):
    INCANDESCENT = "Incandescent / Halogen (15 W/m²)"
    FLUORESCENT = "Fluorescent T8/T5 (8 W/m²)"
    STANDARD_LED = "Standard LED (5 W/m²)"
    HIGH_EFF_LED = "High-Efficiency Smart LED (3 W/m²)"

# Input Schemas
class ProjectInfo(BaseModel):
    project_name: str = "Eco Residence Delhi"
    location: str = "Delhi"
    latitude: float = 28.6139
    longitude: float = 77.2090
    building_type: BuildingType = BuildingType.RESIDENTIAL
    total_budget: float = 4000000.0  # INR
    sustainable_budget: float = 600000.0
    max_additional_investment: float = 400000.0

class SiteParameters(BaseModel):
    plot_area_m2: float = 185.8  # ~2000 sq ft
    built_up_area_m2: float = 139.35  # ~1500 sq ft
    num_floors: int = 2
    building_height_m: float = 6.5
    ground_coverage_pct: float = 45.0
    existing_vegetation_pct: float = 10.0
    proposed_vegetation_pct: float = 25.0
    open_area_pct: float = 55.0
    road_width_m: float = 9.0
    surrounding_building_height_m: float = 7.0
    site_slope_deg: float = 0.0

class OrientationParameters(BaseModel):
    north_orientation_deg: float = 0.0
    building_azimuth_deg: float = 0.0
    main_exposure: str = "South-East"
    main_entrance_direction: str = "North"

class BuildingEnvelope(BaseModel):
    floor_area_m2: float = 139.35
    num_occupants: int = 4
    occupancy_hours_per_day: float = 14.0
    window_wall_ratio_pct: float = 25.0
    window_orientation: str = "South/East"
    glass_type: GlassType = GlassType.DOUBLE_CLEAR
    window_u_value: float = 2.8
    wall_material: str = "AAC Block Masonry with Plaster"
    wall_u_value: float = 0.65
    roof_material: str = "RC Slab with EPS Insulation"
    roof_u_value: float = 0.50
    floor_material: str = "Vitrified Tiles over Concrete Base"
    insulation_thickness_cm: float = 5.0
    roof_type: RoofType = RoofType.INSULATED_CONCRETE
    shading_device: str = "Overhang Louvers"
    overhang_depth_m: float = 0.6

class HvacLightingAppliances(BaseModel):
    hvac_type: HvacType = HvacType.INVERTER_SPLIT
    hvac_cop: float = 4.2
    ac_usage_hours: float = 8.0
    set_temperature_c: float = 24.0
    fan_usage: bool = True
    natural_ventilation_available: bool = True
    lighting_type: LightingType = LightingType.STANDARD_LED
    lighting_power_density_w_m2: float = 5.0
    avg_lighting_hours_per_day: float = 6.0
    daylight_availability: float = 70.0  # %
    refrigerators_qty: int = 1
    fans_qty: int = 6
    computers_qty: int = 2
    tvs_qty: int = 2
    pumps_qty: int = 1
    other_appliances_kw: float = 1.2
    appliance_operating_hours: float = 8.0

class WaterParameters(BaseModel):
    daily_water_per_person_l: float = 135.0  # NBC Standard India
    fixture_types: str = "Standard Dual-Flush & Aerators"
    low_flow_fixtures_enabled: bool = True
    greywater_reuse_enabled: bool = False
    rainwater_harvesting_enabled: bool = True
    rainwater_tank_capacity_l: float = 5000.0

class SolarParameters(BaseModel):
    roof_area_m2: float = 70.0
    available_solar_area_m2: float = 45.0
    panel_efficiency_pct: float = 20.5
    panel_capacity_w: float = 400.0
    inverter_efficiency_pct: float = 96.0
    shading_factor_pct: float = 10.0

class GreenParameters(BaseModel):
    existing_trees_count: int = 2
    proposed_trees_count: int = 4
    green_roof_enabled: bool = False
    green_roof_area_m2: float = 0.0
    vertical_garden_enabled: bool = False
    vertical_garden_area_m2: float = 0.0
    lawn_area_m2: float = 30.0
    native_plants_pct: float = 75.0
    permeable_surface_pct: float = 40.0

class MaterialParameters(BaseModel):
    concrete_qty_tons: float = 85.0
    steel_qty_tons: float = 6.5
    brick_qty_thousand: float = 12.0
    cement_qty_tons: float = 18.0
    wood_qty_m3: float = 2.5
    glass_qty_m2: float = 35.0
    recycled_materials_pct: float = 15.0

class FullProjectInput(BaseModel):
    project: ProjectInfo = ProjectInfo()
    site: SiteParameters = SiteParameters()
    orientation: OrientationParameters = OrientationParameters()
    envelope: BuildingEnvelope = BuildingEnvelope()
    hvac_lighting: HvacLightingAppliances = HvacLightingAppliances()
    water: WaterParameters = WaterParameters()
    solar: SolarParameters = SolarParameters()
    green: GreenParameters = GreenParameters()
    materials: MaterialParameters = MaterialParameters()
    is_professional_mode: bool = False

class WhatIfOptions(BaseModel):
    solar_panels: bool = False
    battery_storage: bool = False
    green_roof: bool = False
    plant_trees: bool = False
    vertical_garden: bool = False
    permeable_paving: bool = False
    external_shading: bool = False
    natural_ventilation: bool = False
    reflective_roof: bool = False
    led_lighting: bool = False
    rainwater_harvesting: bool = False
    greywater_reuse: bool = False
    stp_reuse: bool = False
    composting: bool = False
    low_e_glass: bool = False
    roof_insulation: bool = False
    wall_insulation: bool = False
    increase_green_area: bool = False
    change_orientation: bool = False

# Output Schemas
class CalculationDetail(BaseModel):
    formula: str
    inputs: Dict[str, Any]
    values: Dict[str, Any]
    calculation_steps: str
    result_str: str
    assumptions: List[str]
    confidence_level: int = Field(default=3, description="Hierarchy Level 1-5")
    level_name: str = "Level 3: Engineering Equation"

class HeatGainBreakdown(BaseModel):
    q_wall_kw: float
    q_roof_kw: float
    q_window_conduction_kw: float
    q_window_solar_kw: float
    q_people_kw: float
    q_lighting_kw: float
    q_equipment_kw: float
    q_infiltration_kw: float
    q_total_kw: float

class EnergyMetrics(BaseModel):
    lighting_annual_kwh: float
    appliance_annual_kwh: float
    hvac_cooling_annual_kwh: float
    pump_other_annual_kwh: float
    total_annual_kwh: float
    energy_use_intensity_eui: float  # kWh/m²/year
    heat_gain_breakdown: HeatGainBreakdown
    monthly_energy_kwh: List[float]

class WaterMetrics(BaseModel):
    daily_demand_litres: float
    annual_demand_litres: float
    drinking_kitchen_litres: float
    toilet_flushing_litres: float
    bathing_washing_litres: float
    landscaping_litres: float
    low_flow_savings_litres: float
    greywater_generated_litres: float
    greywater_reused_litres: float
    rainwater_harvested_litres: float
    fresh_water_reduction_pct: float
    water_demand_coverage_pct: float
    monthly_rainwater_litres: List[float]
    monthly_water_demand_litres: List[float]

class SolarMetrics(BaseModel):
    panel_count: int
    installed_capacity_kwp: float
    annual_generation_kwh: float
    solar_coverage_pct: float
    annual_co2_avoided_tons: float
    peak_sun_hours_avg: float
    monthly_generation_kwh: List[float]

class GreenMetrics(BaseModel):
    green_coverage_pct: float
    recommended_green_pct: float
    tree_recommendation_count: int
    green_roof_recommendation_m2: float
    vertical_garden_recommendation_m2: float
    permeable_recommendation_pct: float
    microclimate_heat_risk: str  # Low, Moderate, High, Very High
    potential_heat_reduction_score: float

class CarbonMetrics(BaseModel):
    operational_co2_annual_tons: float
    embodied_co2_total_tons: float
    total_lifetime_co2_30yr_tons: float
    co2_per_sq_meter_kg: float
    material_sustainability_score: float
    solar_carbon_offset_tons: float
    potential_carbon_reduction_tons: float

class PassiveMetrics(BaseModel):
    passive_cooling_score: float  # /100
    estimated_ach: float
    natural_ventilation_suitability: str  # Excellent, Moderate, Limited
    orientation_benefit_pct: float
    shading_benefit_pct: float
    roof_insulation_benefit_pct: float
    total_cooling_reduction_pct: float

class EcoScores(BaseModel):
    overall_eco_score: float
    energy_score: float
    water_score: float
    solar_score: float
    green_score: float
    climate_score: float
    material_score: float

class ConfidenceMetrics(BaseModel):
    model_confidence_pct: float
    confidence_level_str: str
    level_breakdown: Dict[str, str]
    assumptions_and_limitations: List[str]

class RecommendationSchema(BaseModel):
    id: str
    title: str
    why: str
    impact: str  # High, Medium, Low
    cost: str    # Low, Medium, High
    priority: int  # 1 to 5
    estimated_energy_reduction_pct: float
    estimated_cost_inr: float
    payback_years: float
    confidence_pct: float
    category: str

class AnalysisResult(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    project_id: Optional[str] = None
    project_name: str
    city: str
    eco_scores: EcoScores
    energy: EnergyMetrics
    water: WaterMetrics
    solar: SolarMetrics
    green: GreenMetrics
    carbon: CarbonMetrics
    passive: PassiveMetrics
    confidence: ConfidenceMetrics
    recommendations: List[RecommendationSchema]
    calculations_explained: Dict[str, CalculationDetail]
    what_if_baseline: Optional[Dict[str, Any]] = None

class SavedProjectRecord(BaseModel):
    id: str
    project_name: str
    city: str
    building_type: str
    created_at: str
    updated_at: str
    overall_eco_score: float
    eui_kwh_m2_yr: float
    annual_co2_tons: float
    input_data: FullProjectInput
    analysis_result: AnalysisResult
