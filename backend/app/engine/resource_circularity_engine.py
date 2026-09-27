"""
resource_circularity_engine.py — Resource Circularity Score Calculator
SustainaBuild AI — Powered by EcoBuild AI

The Resource Circularity Score is a SEPARATE metric from the Eco Score.
It measures how self-sufficient and circular a building's resource use is.

Methodology (transparent):
  Energy Independence     : 30% weight  (solar + battery coverage of demand)
  Water Independence      : 30% weight  (rainwater + greywater + STP reuse)
  Waste Circularity       : 20% weight  (composting + recycling diversion)
  Green Coverage          : 20% weight  (green area vs recommended)

Score range: 0–100
Grade: A+ (>85), A (70–85), B (55–70), C (40–55), D (<40)

DISCLAIMER: This score is not a government-certified sustainability rating.
It is a planning tool for preliminary assessment only.
"""

from typing import Dict, Any


def calculate_resource_circularity(
    energy_independence_pct: float,
    water_independence_pct: float,
    waste_diversion_pct: float,
    green_coverage_pct: float,
    recommended_green_pct: float = 30.0,
    solar_coverage_pct: float = 0.0,
    annual_co2_avoided_tons: float = 0.0,
    annual_water_saved_l: float = 0.0,
    annual_energy_demand_kwh: float = 5000.0,
) -> Dict[str, Any]:
    """
    Calculates the Resource Circularity Score and related independence metrics.
    All inputs are percentages (0–100) unless otherwise noted.
    """

    # ── Component Scores ─────────────────────────────────────────────────────

    # Energy Independence (30%): direct coverage of demand by renewables
    energy_score = min(100.0, energy_independence_pct)
    energy_contribution = energy_score * 0.30

    # Water Independence (30%): fraction of demand met without fresh mains water
    water_score = min(100.0, water_independence_pct)
    water_contribution = water_score * 0.30

    # Waste Circularity (20%): waste diverted from landfill via composting/recycling
    waste_score = min(100.0, waste_diversion_pct)
    waste_contribution = waste_score * 0.20

    # Green Coverage (20%): ratio of achieved green vs recommended
    green_ratio = green_coverage_pct / max(recommended_green_pct, 1.0)
    green_score = min(100.0, green_ratio * 100.0)
    green_contribution = green_score * 0.20

    # Total
    total_score = round(energy_contribution + water_contribution + waste_contribution + green_contribution, 1)
    total_score = max(0.0, min(100.0, total_score))

    # Grade
    if total_score >= 85:
        grade = "A+"
        grade_label = "Excellent Resource Circularity"
        grade_color = "#059669"
    elif total_score >= 70:
        grade = "A"
        grade_label = "Very Good Resource Circularity"
        grade_color = "#10b981"
    elif total_score >= 55:
        grade = "B"
        grade_label = "Good Resource Circularity"
        grade_color = "#84cc16"
    elif total_score >= 40:
        grade = "C"
        grade_label = "Moderate Resource Circularity"
        grade_color = "#f59e0b"
    else:
        grade = "D"
        grade_label = "Low Resource Circularity — Significant Improvement Possible"
        grade_color = "#ef4444"

    # ── Additional Metrics ───────────────────────────────────────────────────
    renewable_energy_coverage = round(solar_coverage_pct, 1)
    grid_dependency_pct = round(100.0 - energy_independence_pct, 1)

    # Estimated CO₂ reduction vs baseline (per year)
    estimated_co2_reduction = annual_co2_avoided_tons

    # Annual savings estimate
    electricity_savings_inr = round((annual_energy_demand_kwh * (energy_independence_pct / 100)) * 8.0, 0)
    water_savings_inr = round((annual_water_saved_l / 1000) * 45.0, 0)  # ₹45/kL
    total_annual_savings_inr = round(electricity_savings_inr + water_savings_inr, 0)

    # Breakdown table for UI
    breakdown = [
        {
            "dimension": "Energy Independence",
            "weight_pct": 30,
            "score": round(energy_score, 1),
            "contribution": round(energy_contribution, 1),
            "description": f"Solar + battery covers {energy_independence_pct:.0f}% of energy demand",
            "color": "#f59e0b"
        },
        {
            "dimension": "Water Independence",
            "weight_pct": 30,
            "score": round(water_score, 1),
            "contribution": round(water_contribution, 1),
            "description": f"Rainwater + greywater + STP covers {water_independence_pct:.0f}% of water demand",
            "color": "#3b82f6"
        },
        {
            "dimension": "Waste Circularity",
            "weight_pct": 20,
            "score": round(waste_score, 1),
            "contribution": round(waste_contribution, 1),
            "description": f"{waste_diversion_pct:.0f}% of waste diverted from landfill (composting + recycling)",
            "color": "#84cc16"
        },
        {
            "dimension": "Green Coverage",
            "weight_pct": 20,
            "score": round(green_score, 1),
            "contribution": round(green_contribution, 1),
            "description": f"{green_coverage_pct:.0f}% green coverage vs {recommended_green_pct:.0f}% recommended",
            "color": "#10b981"
        },
    ]

    return {
        "resource_circularity_score": total_score,
        "grade": grade,
        "grade_label": grade_label,
        "grade_color": grade_color,
        "breakdown": breakdown,
        "energy_independence_pct": round(energy_independence_pct, 1),
        "water_independence_pct": round(water_independence_pct, 1),
        "waste_diversion_pct": round(waste_diversion_pct, 1),
        "green_coverage_pct": round(green_coverage_pct, 1),
        "renewable_energy_coverage_pct": renewable_energy_coverage,
        "grid_dependency_pct": grid_dependency_pct,
        "estimated_co2_reduction_tons_yr": round(estimated_co2_reduction, 2),
        "electricity_savings_inr_yr": electricity_savings_inr,
        "water_savings_inr_yr": water_savings_inr,
        "total_annual_savings_inr": total_annual_savings_inr,
        "methodology": {
            "name": "SustainaBuild Resource Circularity Score",
            "version": "1.0",
            "weights": {
                "Energy Independence": "30%",
                "Water Independence": "30%",
                "Waste Circularity": "20%",
                "Green Coverage": "20%"
            },
            "note": (
                "This score is a planning and educational metric developed for SustainaBuild AI. "
                "It is NOT a government-certified sustainability rating, GRIHA rating, LEED score, "
                "or any official green building certification. "
                "The methodology is transparent and open for review."
            )
        },
        "disclaimer": (
            "Resource Circularity Score is not a government-certified sustainability rating. "
            "It is an internal planning metric for comparison and improvement tracking. "
            "All component scores are estimates based on engineering calculations."
        )
    }
