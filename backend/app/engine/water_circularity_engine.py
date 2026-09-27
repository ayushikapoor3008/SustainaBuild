"""
water_circularity_engine.py — Water Resource Management & Circularity Calculator
SustainaBuild AI — Powered by EcoBuild AI

Covers:
1. Rainwater Harvesting (mass balance)
2. Greywater Recycling
3. STP / Wastewater Estimate
4. Water Independence & Circularity Score

Formula: Rainwater_Harvested = Rainfall_mm × Catchment_m² × Runoff_Coefficient / 1000 (→ litres)
All values are engineering estimates for planning purposes.
"""

from typing import Dict, Any, List


MONTHLY_RAINFALL_DEFAULTS: Dict[str, List[float]] = {
    "Delhi":        [19.0, 20.0, 15.0, 12.0, 25.0, 75.0, 210.0, 230.0, 120.0, 14.0, 4.0, 10.0],
    "Mumbai":       [0.2, 0.2, 0.5, 0.5, 12.0, 520.0, 840.0, 580.0, 340.0, 110.0, 15.0, 2.0],
    "Bengaluru":    [2.0, 5.0, 12.0, 45.0, 110.0, 80.0, 115.0, 140.0, 180.0, 170.0, 85.0, 16.0],
    "Chennai":      [20.0, 10.0, 5.0, 12.0, 40.0, 50.0, 80.0, 100.0, 120.0, 305.0, 355.0, 140.0],
    "Kolkata":      [12.0, 23.0, 30.0, 45.0, 110.0, 260.0, 330.0, 320.0, 270.0, 150.0, 25.0, 7.0],
    "Hyderabad":    [5.0, 10.0, 15.0, 25.0, 35.0, 75.0, 165.0, 170.0, 150.0, 90.0, 25.0, 5.0],
    "Pune":         [1.0, 1.0, 5.0, 18.0, 35.0, 120.0, 190.0, 155.0, 105.0, 60.0, 20.0, 2.0],
    "Ahmedabad":    [1.0, 1.0, 1.0, 1.0, 5.0, 50.0, 180.0, 190.0, 85.0, 15.0, 5.0, 1.0],
    "Jaipur":       [8.0, 7.0, 5.0, 3.0, 10.0, 35.0, 130.0, 165.0, 75.0, 10.0, 2.0, 4.0],
    "Chandigarh":   [35.0, 40.0, 30.0, 15.0, 25.0, 80.0, 220.0, 220.0, 90.0, 15.0, 5.0, 20.0],
    "Lucknow":      [20.0, 18.0, 12.0, 8.0, 15.0, 65.0, 200.0, 235.0, 125.0, 25.0, 5.0, 8.0],
    "Noida":        [19.0, 20.0, 15.0, 12.0, 25.0, 75.0, 210.0, 230.0, 120.0, 14.0, 4.0, 10.0],
    "Ghaziabad":    [19.0, 20.0, 15.0, 12.0, 25.0, 75.0, 210.0, 230.0, 120.0, 14.0, 4.0, 10.0],
    "Gurugram":     [20.0, 18.0, 15.0, 10.0, 22.0, 65.0, 185.0, 210.0, 110.0, 15.0, 4.0, 10.0],
    "Faridabad":    [20.0, 18.0, 15.0, 10.0, 22.0, 65.0, 185.0, 210.0, 110.0, 15.0, 4.0, 10.0],
    "Kochi":        [20.0, 25.0, 50.0, 120.0, 260.0, 550.0, 520.0, 350.0, 245.0, 280.0, 120.0, 40.0],
    "Bhopal":       [5.0, 8.0, 10.0, 5.0, 10.0, 120.0, 280.0, 300.0, 160.0, 30.0, 8.0, 4.0],
    "Indore":       [5.0, 8.0, 10.0, 5.0, 8.0, 110.0, 260.0, 280.0, 150.0, 25.0, 7.0, 3.0],
    "Bhubaneswar":  [15.0, 25.0, 30.0, 35.0, 75.0, 185.0, 285.0, 310.0, 230.0, 125.0, 35.0, 15.0],
    "Nagpur":       [10.0, 15.0, 15.0, 10.0, 20.0, 110.0, 220.0, 220.0, 145.0, 45.0, 10.0, 5.0],
    "Dehradun":     [40.0, 45.0, 35.0, 30.0, 55.0, 200.0, 400.0, 370.0, 250.0, 50.0, 10.0, 30.0],
    "Patna":        [20.0, 22.0, 18.0, 12.0, 30.0, 100.0, 265.0, 295.0, 185.0, 55.0, 10.0, 8.0],
    "Ranchi":       [25.0, 30.0, 30.0, 35.0, 60.0, 185.0, 310.0, 320.0, 250.0, 80.0, 20.0, 15.0],
    "Guwahati":     [30.0, 40.0, 70.0, 150.0, 260.0, 360.0, 410.0, 380.0, 280.0, 150.0, 50.0, 20.0],
    "Amritsar":     [35.0, 35.0, 25.0, 12.0, 18.0, 45.0, 165.0, 155.0, 60.0, 10.0, 5.0, 20.0],
    "Surat":        [1.0, 1.0, 1.0, 1.0, 5.0, 100.0, 270.0, 260.0, 110.0, 20.0, 5.0, 1.0],
    "Shimla":       [65.0, 55.0, 50.0, 40.0, 50.0, 145.0, 340.0, 315.0, 175.0, 45.0, 15.0, 45.0],
    "DEFAULT":      [20.0, 20.0, 20.0, 20.0, 40.0, 100.0, 200.0, 200.0, 130.0, 50.0, 15.0, 15.0],
}

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def calculate_water_circularity(
    location: str,
    num_occupants: int,
    plot_area_m2: float,
    roof_area_m2: float,
    landscape_area_m2: float = 0.0,
    daily_water_lpcd: float = 135.0,
    rainwater_tank_capacity_l: float = 5000.0,
    runoff_coefficient: float = 0.85,
    collection_efficiency: float = 0.90,
    greywater_enabled: bool = True,
    stp_enabled: bool = False,
    custom_monthly_rainfall: list = None,
) -> Dict[str, Any]:
    """
    Comprehensive water circularity analysis.
    """

    # ── Monthly Rainfall ─────────────────────────────────────────────────────
    monthly_rainfall_mm = (
        custom_monthly_rainfall
        if custom_monthly_rainfall and len(custom_monthly_rainfall) == 12
        else MONTHLY_RAINFALL_DEFAULTS.get(location, MONTHLY_RAINFALL_DEFAULTS["DEFAULT"])
    )
    annual_rainfall_mm = sum(monthly_rainfall_mm)

    # ── Water Demand ─────────────────────────────────────────────────────────
    daily_demand_l = num_occupants * daily_water_lpcd
    annual_demand_l = daily_demand_l * 365.0

    # Breakdown (NBC 2016 residential proportions)
    drinking_kitchen_pct = 0.10
    toilet_flushing_pct = 0.30
    bathing_washing_pct = 0.45
    landscaping_pct = 0.15

    daily_drinking = daily_demand_l * drinking_kitchen_pct
    daily_toilet = daily_demand_l * toilet_flushing_pct
    daily_bathing = daily_demand_l * bathing_washing_pct
    daily_landscape = daily_demand_l * landscaping_pct

    # ── Rainwater Harvesting ─────────────────────────────────────────────────
    # Formula: Harvested_L = Rainfall_mm × Catchment_m² × Runoff_Coeff × Collection_Eff
    monthly_rainwater_l = [
        round(mm * roof_area_m2 * runoff_coefficient * collection_efficiency, 0)
        for mm in monthly_rainfall_mm
    ]
    annual_rainwater_l = sum(monthly_rainwater_l)

    # Storage: tank capacity limits collection
    effective_monthly_rainwater = []
    for i, monthly_l in enumerate(monthly_rainwater_l):
        # For months with overflow, cap at tank fills 4 times per month (practical estimate)
        effective_monthly_rainwater.append(min(monthly_l, rainwater_tank_capacity_l * 4))
    effective_annual_rainwater_l = sum(effective_monthly_rainwater)

    # Coverage from rainwater
    rainwater_coverage_pct = min(100.0, round(effective_annual_rainwater_l / max(annual_demand_l, 1) * 100, 1))

    # Suggested storage capacity
    peak_monthly_demand = max(daily_demand_l * 30, 1)
    suggested_tank_l = round(peak_monthly_demand * 0.5, 0)

    # ── Greywater Recycling ──────────────────────────────────────────────────
    # Greywater = bathing + basin + laundry (approx 45% of daily demand)
    daily_greywater_generated_l = daily_bathing
    daily_greywater_treatable_l = daily_greywater_generated_l * 0.80  # 80% treatable
    # Greywater reuse: toilet flushing + landscape irrigation
    daily_greywater_reused_l = min(daily_greywater_treatable_l, daily_toilet + daily_landscape * 0.5)
    annual_greywater_reused_l = daily_greywater_reused_l * 365.0 if greywater_enabled else 0.0

    # ── STP / Wastewater ─────────────────────────────────────────────────────
    # Daily wastewater = ~80% of total demand
    daily_wastewater_l = daily_demand_l * 0.80
    stp_capacity_kld = round(daily_wastewater_l / 1000.0, 1)  # KLD
    daily_treated_reuse_l = daily_wastewater_l * 0.70 if stp_enabled else 0.0  # 70% reuse after treatment
    annual_treated_reuse_l = daily_treated_reuse_l * 365.0 if stp_enabled else 0.0

    # ── Combined Savings ─────────────────────────────────────────────────────
    total_reuse_annual_l = effective_annual_rainwater_l + annual_greywater_reused_l + annual_treated_reuse_l
    fresh_water_saved_l = min(total_reuse_annual_l, annual_demand_l)
    fresh_water_reduction_pct = min(100.0, round(fresh_water_saved_l / max(annual_demand_l, 1) * 100, 1))
    water_independence_pct = fresh_water_reduction_pct

    # ── Water Circularity Score ──────────────────────────────────────────────
    # 0–100 score based on three dimensions
    rainwater_score = min(40.0, rainwater_coverage_pct * 0.4)
    greywater_score = min(35.0, (annual_greywater_reused_l / max(annual_demand_l, 1) * 100) * 0.35) if greywater_enabled else 0.0
    stp_score = min(25.0, (annual_treated_reuse_l / max(annual_demand_l, 1) * 100) * 0.25) if stp_enabled else 0.0
    water_circularity_score = round(rainwater_score + greywater_score + stp_score, 1)

    return {
        # Demand
        "num_occupants": num_occupants,
        "daily_demand_litres": round(daily_demand_l, 0),
        "annual_demand_litres": round(annual_demand_l, 0),
        "daily_drinking_litres": round(daily_drinking, 0),
        "daily_toilet_litres": round(daily_toilet, 0),
        "daily_bathing_litres": round(daily_bathing, 0),
        "daily_landscape_litres": round(daily_landscape, 0),
        # Rainfall
        "location": location,
        "annual_rainfall_mm": round(annual_rainfall_mm, 1),
        "monthly_rainfall_mm": monthly_rainfall_mm,
        # Rainwater Harvesting
        "roof_area_m2": roof_area_m2,
        "runoff_coefficient": runoff_coefficient,
        "collection_efficiency_pct": collection_efficiency * 100,
        "tank_capacity_l": rainwater_tank_capacity_l,
        "suggested_tank_capacity_l": suggested_tank_l,
        "monthly_rainwater_harvested_l": [round(x, 0) for x in monthly_rainwater_l],
        "effective_monthly_rainwater_l": [round(x, 0) for x in effective_monthly_rainwater],
        "annual_rainwater_potential_l": round(annual_rainwater_l, 0),
        "annual_rainwater_effective_l": round(effective_annual_rainwater_l, 0),
        "rainwater_coverage_pct": rainwater_coverage_pct,
        "months": MONTHS,
        # Greywater
        "greywater_enabled": greywater_enabled,
        "daily_greywater_generated_l": round(daily_greywater_generated_l, 0),
        "daily_greywater_reused_l": round(daily_greywater_reused_l, 0) if greywater_enabled else 0.0,
        "annual_greywater_reused_l": round(annual_greywater_reused_l, 0),
        "freshwater_saved_greywater_lpd": round(daily_greywater_reused_l, 0) if greywater_enabled else 0.0,
        # STP
        "stp_enabled": stp_enabled,
        "daily_wastewater_l": round(daily_wastewater_l, 0),
        "stp_capacity_kld": stp_capacity_kld,
        "daily_treated_reuse_l": round(daily_treated_reuse_l, 0) if stp_enabled else 0.0,
        "annual_treated_reuse_l": round(annual_treated_reuse_l, 0),
        "stp_note": (
            "STP sizing and final design requires qualified engineering verification. "
            "Values are indicative estimates only."
        ),
        # Summary
        "total_annual_reuse_l": round(total_reuse_annual_l, 0),
        "fresh_water_saved_l": round(fresh_water_saved_l, 0),
        "fresh_water_reduction_pct": fresh_water_reduction_pct,
        "water_independence_pct": water_independence_pct,
        "water_circularity_score": water_circularity_score,
        "assumptions": [
            "Water demand: 135 LPCD (NBC 2016 standard for residential)",
            "Runoff coefficient: 0.85 (RCC/tiled roof, standard for India)",
            "Collection efficiency: 90% (first flush excluded)",
            "Greywater: 45% of demand (bathing, basin, laundry)",
            "Greywater treatment: 80% treatable with low-cost systems",
            "STP reuse: 70% of treated wastewater available for reuse",
            "Monthly rainfall from regional climate database (engineering estimate)",
            "All values are estimates for planning purposes only.",
        ],
        "data_quality": "ESTIMATED — Engineering calculation. Verify with qualified engineer."
    }
