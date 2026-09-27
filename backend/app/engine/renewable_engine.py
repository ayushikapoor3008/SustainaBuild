"""
renewable_engine.py — Solar PV & Battery Storage Calculator
SustainaBuild AI — Powered by EcoBuild AI

Calculates detailed renewable energy metrics including:
- Solar PV capacity and generation
- Battery storage sizing and backup
- Energy independence
- Carbon offset
All values are estimates based on standard engineering calculations.
"""

from typing import Dict, Any, Tuple
import math


def calculate_renewable(
    roof_area_m2: float,
    usable_solar_area_m2: float,
    panel_efficiency_pct: float = 20.0,
    panel_capacity_w: float = 400.0,
    solar_irradiation_kwh_m2_day: float = 5.4,
    system_losses_pct: float = 14.0,
    annual_energy_demand_kwh: float = 5000.0,
    battery_capacity_kwh: float = 10.0,
    depth_of_discharge_pct: float = 80.0,
    round_trip_efficiency_pct: float = 90.0,
    grid_emission_factor: float = 0.82,
    daily_energy_demand_kwh: float = None,
) -> Dict[str, Any]:
    """
    Returns comprehensive renewable energy and battery storage metrics.
    All values are engineering estimates — clearly labeled as such.
    """

    if daily_energy_demand_kwh is None:
        daily_energy_demand_kwh = annual_energy_demand_kwh / 365.0

    # ── Solar PV Calculations ────────────────────────────────────────────────
    # Panel area requirement: 1 kWp ≈ 5-7 m² depending on efficiency
    area_per_kwp = 1000.0 / (panel_efficiency_pct * 10.0)  # m² per kWp
    installed_kwp = usable_solar_area_m2 / area_per_kwp
    installed_kwp = round(installed_kwp, 2)

    panel_count = int(usable_solar_area_m2 / (panel_capacity_w / 1000.0 / (panel_efficiency_pct / 100.0) / 1.0))
    panel_area_each = (panel_capacity_w / 1000.0) / (panel_efficiency_pct / 100.0)  # m²
    panel_count = max(1, int(usable_solar_area_m2 / panel_area_each))

    # Annual generation
    system_efficiency = (1 - system_losses_pct / 100.0)
    annual_generation_kwh = installed_kwp * solar_irradiation_kwh_m2_day * 365.0 * system_efficiency
    annual_generation_kwh = round(annual_generation_kwh, 1)

    daily_generation_kwh = round(annual_generation_kwh / 365.0, 2)

    # Coverage
    solar_coverage_pct = min(100.0, round((annual_generation_kwh / max(annual_energy_demand_kwh, 1.0)) * 100.0, 1))
    solar_surplus_kwh = max(0.0, annual_generation_kwh - annual_energy_demand_kwh)

    # Carbon
    annual_co2_avoided_tons = round(annual_generation_kwh * grid_emission_factor / 1000.0, 2)

    # Monthly distribution (typical Indian pattern: higher in summer/spring)
    monthly_factors = [0.85, 0.90, 1.00, 1.10, 1.15, 1.00, 0.85, 0.85, 0.95, 1.00, 0.90, 0.82]
    total_factor = sum(monthly_factors)
    monthly_generation_kwh = [
        round(annual_generation_kwh * f / total_factor, 1) for f in monthly_factors
    ]

    # ── Battery Storage Calculations ─────────────────────────────────────────
    usable_battery_kwh = battery_capacity_kwh * (depth_of_discharge_pct / 100.0) * (round_trip_efficiency_pct / 100.0)
    usable_battery_kwh = round(usable_battery_kwh, 2)

    # Backup duration from battery alone (without solar)
    backup_hours = round((usable_battery_kwh / max(daily_energy_demand_kwh, 0.1)) * 24.0, 1)

    # Solar energy available for battery charging
    solar_for_battery_kwh_day = max(0.0, daily_generation_kwh - daily_energy_demand_kwh)
    battery_charge_days = 0 if solar_for_battery_kwh_day <= 0 else round(usable_battery_kwh / solar_for_battery_kwh_day, 1)

    # Energy independence estimate
    # Fraction of demand met by solar (direct use + battery)
    direct_solar_fraction = min(1.0, daily_generation_kwh / max(daily_energy_demand_kwh, 0.01))
    battery_fraction = min(1.0 - direct_solar_fraction, usable_battery_kwh / max(daily_energy_demand_kwh, 0.01))
    energy_independence_pct = round((direct_solar_fraction + battery_fraction) * 100.0, 1)
    energy_independence_pct = min(100.0, energy_independence_pct)

    grid_dependency_pct = round(100.0 - energy_independence_pct, 1)

    # Grid electricity saved annually
    grid_saved_kwh = round(min(annual_generation_kwh, annual_energy_demand_kwh), 1)
    grid_cost_savings_inr = round(grid_saved_kwh * 8.0, 0)  # ₹8/kWh typical

    # Payback period estimate (rough)
    solar_cost_per_kwp = 55000  # INR/kWp (approx. 2024)
    battery_cost_per_kwh = 15000  # INR/kWh
    total_system_cost = installed_kwp * solar_cost_per_kwp + battery_capacity_kwh * battery_cost_per_kwh
    payback_years = round(total_system_cost / max(grid_cost_savings_inr, 1), 1) if grid_cost_savings_inr > 0 else 99.0

    return {
        # Solar PV
        "installed_capacity_kwp": round(installed_kwp, 2),
        "panel_count": panel_count,
        "panel_capacity_w": panel_capacity_w,
        "panel_efficiency_pct": panel_efficiency_pct,
        "usable_solar_area_m2": usable_solar_area_m2,
        "annual_generation_kwh": annual_generation_kwh,
        "daily_generation_kwh": daily_generation_kwh,
        "monthly_generation_kwh": monthly_generation_kwh,
        "solar_coverage_pct": solar_coverage_pct,
        "solar_surplus_kwh": round(solar_surplus_kwh, 1),
        "annual_co2_avoided_tons": annual_co2_avoided_tons,
        "peak_sun_hours_avg": solar_irradiation_kwh_m2_day,
        # Battery
        "battery_capacity_kwh": battery_capacity_kwh,
        "usable_battery_kwh": usable_battery_kwh,
        "depth_of_discharge_pct": depth_of_discharge_pct,
        "round_trip_efficiency_pct": round_trip_efficiency_pct,
        "backup_hours": backup_hours,
        "battery_charge_days_solar": battery_charge_days,
        # Independence
        "energy_independence_pct": energy_independence_pct,
        "grid_dependency_pct": grid_dependency_pct,
        "grid_saved_kwh": grid_saved_kwh,
        "grid_cost_savings_inr": grid_cost_savings_inr,
        # Economics
        "estimated_system_cost_inr": round(total_system_cost, 0),
        "payback_years": payback_years,
        # Metadata
        "assumptions": [
            f"Solar irradiation: {solar_irradiation_kwh_m2_day} kWh/m²/day (location-based estimate)",
            f"System losses: {system_losses_pct}% (wiring, inverter, soiling, temperature)",
            f"Panel efficiency: {panel_efficiency_pct}%",
            f"Battery DOD: {depth_of_discharge_pct}%, Round-trip efficiency: {round_trip_efficiency_pct}%",
            "Solar cost: ₹55,000/kWp (indicative 2024 installed cost)",
            "Battery cost: ₹15,000/kWh (indicative 2024)",
            "Electricity tariff: ₹8/kWh (typical Indian utility rate)",
            "Generation estimate does not account for seasonal shading or panel degradation.",
            "All values are engineering estimates for planning purposes only."
        ],
        "data_quality": "ESTIMATED — Engineering calculation based on standard parameters",
    }
