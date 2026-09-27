import numpy as np
from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, SolarMetrics, CalculationDetail
from app.data.climate_db import get_climate_data

def calculate_solar(data: FullProjectInput, total_building_kwh: float) -> Tuple[SolarMetrics, Dict[str, CalculationDetail]]:
    city_data = get_climate_data(data.project.location)
    
    avail_area = min(data.solar.available_solar_area_m2, data.solar.roof_area_m2)
    panel_eff = data.solar.panel_efficiency_pct / 100.0
    panel_wattage = data.solar.panel_capacity_w
    panel_area = 1.95  # Standard 400W solar panel footprint (~1.95 m²)
    
    panel_count = int(np.floor(avail_area / panel_area))
    installed_capacity_kwp = (panel_count * panel_wattage) / 1000.0

    psh = city_data["solar_irradiation_kwh_m2_day"]
    pr = (data.solar.inverter_efficiency_pct / 100.0) * 0.82  # Inverter eff * balance of system ratio (~0.78)
    shading_factor = data.solar.shading_factor_pct / 100.0

    # Annual Solar Generation: kWp * PSH * 365 * PR * (1 - Shading)
    annual_generation_kwh = installed_capacity_kwp * psh * 365.0 * pr * (1.0 - shading_factor)

    # Sanity check: Solar generation cannot physically exceed total irradiance * roof area * panel efficiency
    max_physical_kwh = (avail_area * psh * 365.0 * panel_eff)
    annual_generation_kwh = float(min(annual_generation_kwh, max_physical_kwh))

    solar_coverage_pct = (annual_generation_kwh / max(total_building_kwh, 1.0)) * 100.0
    solar_coverage_pct = float(min(solar_coverage_pct, 100.0))

    grid_ef = city_data.get("grid_emission_factor_kg_kwh", 0.82)
    co2_avoided_tons = (annual_generation_kwh * grid_ef) / 1000.0

    # Monthly solar profile (higher in spring/summer, lower in monsoon/winter)
    monthly_irrad_ratios = [0.85, 0.95, 1.10, 1.15, 1.10, 0.85, 0.70, 0.75, 0.90, 1.00, 0.90, 0.80]
    avg_ratio = np.mean(monthly_irrad_ratios)
    monthly_gen = [(annual_generation_kwh / 12.0) * (r / avg_ratio) for r in monthly_irrad_ratios]

    metrics = SolarMetrics(
        panel_count=panel_count,
        installed_capacity_kwp=round(installed_capacity_kwp, 2),
        annual_generation_kwh=round(annual_generation_kwh, 1),
        solar_coverage_pct=round(solar_coverage_pct, 1),
        annual_co2_avoided_tons=round(co2_avoided_tons, 2),
        peak_sun_hours_avg=round(psh, 2),
        monthly_generation_kwh=[round(m, 1) for m in monthly_gen]
    )

    explanations = {
        "solar_generation": CalculationDetail(
            formula="E_solar = Installed_Capacity (kWp) × Peak_Sun_Hours × 365 × Performance_Ratio × (1 - Shading)",
            inputs={
                "Available Roof Area (m²)": avail_area,
                "Panel Wattage (W)": panel_wattage,
                "Peak Sun Hours (kWh/m²/day)": psh,
                "Inverter Efficiency (%)": data.solar.inverter_efficiency_pct,
                "Shading Factor (%)": data.solar.shading_factor_pct
            },
            values={
                "Panel Count": panel_count,
                "Installed Capacity": f"{round(installed_capacity_kwp, 2)} kWp",
                "Performance Ratio": round(pr, 3)
            },
            calculation_steps=f"{round(installed_capacity_kwp, 2)} kWp × {psh} PSH × 365 days × {round(pr, 3)} PR × (1 - {shading_factor}) = {round(annual_generation_kwh, 1)} kWh/yr",
            result_str=f"{round(annual_generation_kwh, 1)} kWh/year",
            assumptions=["Based on standard 400W monocrystalline PV panels with 20.5% module efficiency."],
            confidence_level=3,
            level_name="Level 3: Mathematical PV System Calculation"
        )
    }

    return metrics, explanations
