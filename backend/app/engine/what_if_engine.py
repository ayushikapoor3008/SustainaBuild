import copy
from typing import Dict, Any
from app.models.schemas import (
    FullProjectInput, WhatIfOptions, AnalysisResult,
    GlassType, RoofType, HvacType
)
from app.engine.energy_engine import calculate_energy
from app.engine.solar_engine import calculate_solar
from app.engine.water_engine import calculate_water
from app.engine.green_engine import calculate_green
from app.engine.carbon_engine import calculate_carbon
from app.engine.passive_engine import calculate_passive
from app.engine.eco_score_engine import calculate_eco_score

def run_full_analysis(data: FullProjectInput) -> AnalysisResult:
    # Execute full calculation pipeline
    energy, energy_ex = calculate_energy(data)
    solar, solar_ex = calculate_solar(data, energy.total_annual_kwh)
    water, water_ex = calculate_water(data)
    green, green_ex = calculate_green(data)
    carbon, carbon_ex = calculate_carbon(data, energy.total_annual_kwh, solar.annual_generation_kwh)
    passive, passive_ex = calculate_passive(data)
    
    eco_scores, confidence = calculate_eco_score(data, energy, water, solar, green, carbon, passive)
    
    from app.engine.recommendation_engine import generate_recommendations
    recs = generate_recommendations(data, energy, water, solar, green, passive)

    explained = {}
    explained.update(energy_ex)
    explained.update(solar_ex)
    explained.update(water_ex)
    explained.update(green_ex)
    explained.update(carbon_ex)
    explained.update(passive_ex)

    return AnalysisResult(
        project_name=data.project.project_name,
        city=data.project.location,
        eco_scores=eco_scores,
        energy=energy,
        water=water,
        solar=solar,
        green=green,
        carbon=carbon,
        passive=passive,
        confidence=confidence,
        recommendations=recs,
        calculations_explained=explained
    )

def simulate_what_if(data: FullProjectInput, options: WhatIfOptions) -> Dict[str, Any]:
    # Baseline run
    baseline_result = run_full_analysis(data)

    # Clone project input for scenario modification
    modified = copy.deepcopy(data)
    additional_investment = 0.0

    # 1. Solar Panels & Battery Storage
    if options.solar_panels:
        modified.solar.available_solar_area_m2 = min(modified.solar.roof_area_m2 * 0.80, modified.solar.roof_area_m2)
        additional_investment += 180000.0  # ~ ₹1.8L for solar PV

    if getattr(options, 'battery_storage', False):
        additional_investment += 90000.0  # ~ ₹90k for 10kWh LiFePO4 battery

    # 2. Green Roof
    if options.green_roof:
        modified.green.green_roof_enabled = True
        modified.green.green_roof_area_m2 = modified.solar.roof_area_m2 * 0.40
        modified.envelope.roof_type = RoofType.GREEN_ROOF
        modified.envelope.roof_u_value = 0.35
        additional_investment += 75000.0

    # 3. Plant Trees
    if options.plant_trees:
        modified.green.proposed_trees_count += 6
        additional_investment += 9000.0

    # 3b. Vertical Garden
    if getattr(options, 'vertical_garden', False):
        modified.green.vertical_garden_enabled = True
        modified.green.vertical_garden_area_m2 = 30.0
        additional_investment += 35000.0

    # 3c. Permeable Paving
    if getattr(options, 'permeable_paving', False):
        modified.green.permeable_surface_pct = min(modified.green.permeable_surface_pct + 30.0, 80.0)
        additional_investment += 18000.0

    # 4. External Shading
    if options.external_shading:
        modified.envelope.shading_device = "Overhang Louvers + Shading Screen"
        modified.envelope.overhang_depth_m = 0.8
        additional_investment += 25000.0

    # 5. Natural Ventilation
    if options.natural_ventilation:
        modified.hvac_lighting.natural_ventilation_available = True
        modified.envelope.window_wall_ratio_pct = min(modified.envelope.window_wall_ratio_pct + 5.0, 40.0)

    # 6. Reflective Roof
    if options.reflective_roof and not options.green_roof:
        modified.envelope.roof_type = RoofType.COOL_ROOF_WHITE
        modified.envelope.roof_u_value = 0.40
        additional_investment += 15000.0

    # 6b. LED Lighting
    if getattr(options, 'led_lighting', False):
        modified.hvac_lighting.lighting_power_density_w_m2 = 3.0  # High-Eff LED
        additional_investment += 12000.0

    # 7. Rainwater Harvesting
    if options.rainwater_harvesting:
        modified.water.rainwater_harvesting_enabled = True
        modified.water.rainwater_tank_capacity_l = 8000.0
        additional_investment += 45000.0

    # 8. Greywater Reuse
    if options.greywater_reuse:
        modified.water.greywater_reuse_enabled = True
        additional_investment += 65000.0

    # 8b. STP Reuse
    if getattr(options, 'stp_reuse', False):
        additional_investment += 85000.0

    # 8c. Composting
    if getattr(options, 'composting', False):
        additional_investment += 10000.0

    # 9. Low-E Glass
    if options.low_e_glass:
        modified.envelope.glass_type = GlassType.LOW_E_DOUBLE
        modified.envelope.window_u_value = 1.6
        additional_investment += 55000.0

    # 10. Roof Insulation
    if options.roof_insulation:
        modified.envelope.roof_u_value = min(modified.envelope.roof_u_value, 0.25)
        modified.envelope.insulation_thickness_cm = 10.0
        additional_investment += 30000.0

    # 11. Wall Insulation
    if options.wall_insulation:
        modified.envelope.wall_u_value = 0.35
        additional_investment += 40000.0

    # 12. Increase Green Area
    if options.increase_green_area:
        modified.green.lawn_area_m2 = min(modified.green.lawn_area_m2 + 40.0, modified.site.plot_area_m2 * 0.4)
        additional_investment += 20000.0

    # 13. Change Orientation
    if options.change_orientation:
        modified.orientation.building_azimuth_deg = 0.0  # Ideal North-South alignment
        modified.orientation.main_exposure = "North-South"

    # Simulated run
    simulated_result = run_full_analysis(modified)

    # Financial & Savings calculation
    electricity_saved_kwh = max(baseline_result.energy.total_annual_kwh - simulated_result.energy.total_annual_kwh, 0.0) + simulated_result.solar.annual_generation_kwh
    water_saved_l = max(simulated_result.water.low_flow_savings_litres + simulated_result.water.greywater_reused_litres + simulated_result.water.rainwater_harvested_litres - baseline_result.water.rainwater_harvested_litres, 0.0)

    annual_monetary_savings_inr = (electricity_saved_kwh * 8.0) + ((water_saved_l / 1000.0) * 45.0)
    payback_years = (additional_investment / max(annual_monetary_savings_inr, 1.0)) if additional_investment > 0 else 0.0

    return {
        "baseline": baseline_result,
        "simulated": simulated_result,
        "deltas": {
            "eco_score_delta": round(simulated_result.eco_scores.overall_eco_score - baseline_result.eco_scores.overall_eco_score, 1),
            "energy_saved_kwh": round(electricity_saved_kwh, 1),
            "water_saved_litres": round(water_saved_l, 1),
            "solar_generated_kwh": round(simulated_result.solar.annual_generation_kwh, 1),
            "co2_reduced_tons": round(baseline_result.carbon.operational_co2_annual_tons - simulated_result.carbon.operational_co2_annual_tons + simulated_result.solar.annual_co2_avoided_tons, 2),
            "green_coverage_delta": round(simulated_result.green.green_coverage_pct - baseline_result.green.green_coverage_pct, 1),
            "annual_monetary_savings_inr": round(annual_monetary_savings_inr, 0),
            "additional_investment_inr": round(additional_investment, 0),
            "payback_years": round(payback_years, 1)
        },
        "options_applied": options
    }
