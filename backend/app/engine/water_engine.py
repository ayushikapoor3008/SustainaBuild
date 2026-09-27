import numpy as np
from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, WaterMetrics, CalculationDetail
from app.data.climate_db import get_climate_data

def calculate_water(data: FullProjectInput) -> Tuple[WaterMetrics, Dict[str, CalculationDetail]]:
    city_data = get_climate_data(data.project.location)
    occupants = max(data.envelope.num_occupants, 1)
    base_lpd = data.water.daily_water_per_person_l
    
    raw_daily_demand = occupants * base_lpd
    raw_annual_demand = raw_daily_demand * 365.0

    # Category breakdown (Litres/day)
    drinking = raw_daily_demand * 0.10
    toilet = raw_daily_demand * 0.30
    bathing = raw_daily_demand * 0.45
    landscaping = raw_daily_demand * 0.15

    # Low-flow fixture savings
    low_flow_savings_daily = 0.0
    if data.water.low_flow_fixtures_enabled:
        toilet_saved = toilet * 0.30  # 30% saving on toilet flush
        bathing_saved = bathing * 0.20  # 20% saving on taps & showers
        low_flow_savings_daily = toilet_saved + bathing_saved
        toilet -= toilet_saved
        bathing -= bathing_saved

    actual_daily_demand = drinking + toilet + bathing + landscaping
    actual_annual_demand = actual_daily_demand * 365.0
    low_flow_savings_annual = low_flow_savings_daily * 365.0

    # Greywater calculation
    # Bathing + washing wastewater is greywater (~80% of bathing/washing)
    greywater_generated_daily = bathing * 0.80
    greywater_generated_annual = greywater_generated_daily * 365.0

    greywater_reused_annual = 0.0
    if data.water.greywater_reuse_enabled:
        treatment_efficiency = 0.85
        reusable_annual = greywater_generated_annual * treatment_efficiency
        # Target flushing + landscaping demand
        flush_landscape_demand = (toilet + landscaping) * 365.0
        greywater_reused_annual = min(reusable_annual, flush_landscape_demand)

    # Rainwater Harvesting
    annual_rainfall_m = city_data["annual_rainfall_mm"] / 1000.0
    catchment_area = data.solar.roof_area_m2
    
    # Runoff coefficient based on roof type
    roof_str = str(data.envelope.roof_type)
    if "Green" in roof_str:
        runoff_coeff = 0.45
    elif "Cool" in roof_str or "Metal" in roof_str:
        runoff_coeff = 0.90
    else:
        runoff_coeff = 0.80  # Standard concrete roof

    rainwater_harvested_annual_m3 = annual_rainfall_m * catchment_area * runoff_coeff
    rainwater_harvested_litres = rainwater_harvested_annual_m3 * 1000.0

    # Storage tank utilization check
    if not data.water.rainwater_harvesting_enabled:
        rainwater_harvested_litres = 0.0

    # Monthly rainwater harvest & demand profiles
    monthly_rainfall = city_data["monthly_rainfall_mm"]
    monthly_rainwater_l = [(r / 1000.0) * catchment_area * runoff_coeff * 1000.0 for r in monthly_rainfall]
    monthly_demand_l = [actual_daily_demand * 30.4] * 12

    # Total Fresh Water Reduction %
    total_saved_annual = low_flow_savings_annual + greywater_reused_annual + min(rainwater_harvested_litres, actual_annual_demand * 0.4)
    fresh_water_reduction_pct = (total_saved_annual / max(raw_annual_demand, 1.0)) * 100.0
    fresh_water_reduction_pct = min(fresh_water_reduction_pct, 95.0)

    water_coverage_pct = ((rainwater_harvested_litres + greywater_reused_annual) / max(actual_annual_demand, 1.0)) * 100.0
    water_coverage_pct = min(water_coverage_pct, 100.0)

    metrics = WaterMetrics(
        daily_demand_litres=round(actual_daily_demand, 1),
        annual_demand_litres=round(actual_annual_demand, 1),
        drinking_kitchen_litres=round(drinking * 365.0, 1),
        toilet_flushing_litres=round(toilet * 365.0, 1),
        bathing_washing_litres=round(bathing * 365.0, 1),
        landscaping_litres=round(landscaping * 365.0, 1),
        low_flow_savings_litres=round(low_flow_savings_annual, 1),
        greywater_generated_litres=round(greywater_generated_annual, 1),
        greywater_reused_litres=round(greywater_reused_annual, 1),
        rainwater_harvested_litres=round(rainwater_harvested_litres, 1),
        fresh_water_reduction_pct=round(fresh_water_reduction_pct, 1),
        water_demand_coverage_pct=round(water_coverage_pct, 1),
        monthly_rainwater_litres=[round(m, 1) for m in monthly_rainwater_l],
        monthly_water_demand_litres=[round(m, 1) for m in monthly_demand_l]
    )

    explanations = {
        "rainwater_harvesting": CalculationDetail(
            formula="Rainwater_Harvested (L) = Annual_Rainfall (m) × Catchment_Area (m²) × Runoff_Coefficient × 1000",
            inputs={
                "Annual Rainfall (mm)": city_data["annual_rainfall_mm"],
                "Roof Catchment Area (m²)": catchment_area,
                "Runoff Coefficient": runoff_coeff,
                "Roof Type": roof_str
            },
            values={
                "Annual Rainfall (m)": round(annual_rainfall_m, 3),
                "Runoff Coeff": runoff_coeff,
                "Volume (m³)": round(rainwater_harvested_annual_m3, 2)
            },
            calculation_steps=f"{round(annual_rainfall_m, 3)} m × {catchment_area} m² × {runoff_coeff} × 1000 = {round(rainwater_harvested_litres, 1)} Litres/year",
            result_str=f"{round(rainwater_harvested_litres, 1)} Litres/year",
            assumptions=["Runoff coefficient based on CPWD / NBC guidelines for RCC concrete roofs."],
            confidence_level=3,
            level_name="Level 3: Mass Balance Catchment Model"
        ),
        "water_demand": CalculationDetail(
            formula="Annual_Demand = Occupants × Baseline_LPD × 365 × (1 - Low_Flow_Reduction)",
            inputs={
                "Occupants": occupants,
                "Baseline LPD": base_lpd,
                "Low-Flow Fixtures": data.water.low_flow_fixtures_enabled
            },
            values={
                "Raw Daily Demand": f"{round(raw_daily_demand, 1)} L/day",
                "Low-Flow Savings": f"{round(low_flow_savings_annual, 1)} L/year"
            },
            calculation_steps=f"{occupants} persons × {base_lpd} LPD × 365 days - {round(low_flow_savings_annual, 1)} L saved = {round(actual_annual_demand, 1)} L/year",
            result_str=f"{round(actual_annual_demand, 1)} Litres/year",
            assumptions=["Baseline 135 LPD complies with National Building Code of India (NBC 2016)."],
            confidence_level=2,
            level_name="Level 2: Standard Occupancy Benchmark"
        )
    }

    return metrics, explanations
