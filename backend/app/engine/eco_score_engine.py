from typing import Dict, Any, Tuple
from app.models.schemas import (
    FullProjectInput, EcoScores, ConfidenceMetrics,
    EnergyMetrics, WaterMetrics, SolarMetrics, GreenMetrics,
    CarbonMetrics, PassiveMetrics
)

def calculate_eco_score(
    data: FullProjectInput,
    energy: EnergyMetrics,
    water: WaterMetrics,
    solar: SolarMetrics,
    green: GreenMetrics,
    carbon: CarbonMetrics,
    passive: PassiveMetrics
) -> Tuple[EcoScores, ConfidenceMetrics]:
    # 1. Component Sub-scores (0 - 100)
    # Energy: EUI benchmark for Indian residential is ~80 kWh/m²/yr (good) to 150 kWh/m²/yr (poor)
    energy_score = float(max(0.0, min(100.0, 100.0 - (energy.energy_use_intensity_eui - 40.0) * 0.75)))

    # Water: fresh water reduction percentage
    water_score = float(min(100.0, water.fresh_water_reduction_pct * 1.1 + 25.0))

    # Solar: solar coverage percentage
    solar_score = float(min(100.0, solar.solar_coverage_pct * 1.1))

    # Green: ratio of actual green coverage vs recommended
    green_ratio = green.green_coverage_pct / max(green.recommended_green_pct, 1.0)
    green_score = float(min(100.0, green_ratio * 75.0))

    # Climate Adaptation: passive cooling score
    climate_score = float(passive.passive_cooling_score)

    # Material: material sustainability score
    material_score = float(carbon.material_sustainability_score)

    # 2. Weighted Overall Eco Score
    overall_eco_score = (
        energy_score * 0.25 +
        water_score * 0.20 +
        solar_score * 0.15 +
        green_score * 0.15 +
        climate_score * 0.15 +
        material_score * 0.10
    )
    overall_eco_score = float(min(100.0, max(0.0, overall_eco_score)))

    eco_scores = EcoScores(
        overall_eco_score=round(overall_eco_score, 1),
        energy_score=round(energy_score, 1),
        water_score=round(water_score, 1),
        solar_score=round(solar_score, 1),
        green_score=round(green_score, 1),
        climate_score=round(climate_score, 1),
        material_score=round(material_score, 1)
    )

    # 3. Model Confidence Score Calculation
    # Depend on user completeness & data accuracy level
    confidence_base = 78.0
    if data.is_professional_mode:
        confidence_base += 10.0
    if data.materials.concrete_qty_tons > 0:
        confidence_base += 5.0
    if data.solar.panel_efficiency_pct > 15.0:
        confidence_base += 3.0

    confidence_pct = min(confidence_base, 94.0)

    confidence_metrics = ConfidenceMetrics(
        model_confidence_pct=round(confidence_pct, 1),
        confidence_level_str="High Confidence (Engineering Analytical Physics Model)",
        level_breakdown={
            "Level 1 (User Measurements)": "Building geometry, floor area, occupant count, appliance list",
            "Level 2 (Location Datasets)": "15-city climate database, solar PSH, NBC water benchmarks, CEA grid emission factor",
            "Level 3 (Engineering Equations)": "Conduction Q_wall/roof/win, Orifice airflow ACH, PV yield equation, Rainwater mass balance",
            "Level 4 (Published Coefficients)": "ICE Material Embodied Carbon Factors, Window U-values & SHGC",
            "Level 5 (Assumptions)": "AC usage hours, average load factor 0.55, 30-year lifecycle horizon"
        },
        assumptions_and_limitations=[
            "Confidence reflects input completeness and physics model applicability; it is not a guarantee of professional simulation software (e.g. EnergyPlus / IES-VE) accuracy.",
            "Calculations assume standard operating schedules and nominal grid availability without blackout interruptions.",
            "Solar PV yield assumes unshaded tilt at local latitude angle.",
            "Cost estimates and payback periods use current 2024 regional Indian utility tariffs (₹8.0/kWh electricity, ₹45/kl water)."
        ]
    )

    return eco_scores, confidence_metrics
