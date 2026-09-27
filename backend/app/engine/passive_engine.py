import numpy as np
from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, PassiveMetrics, CalculationDetail

def calculate_passive(data: FullProjectInput) -> Tuple[PassiveMetrics, Dict[str, CalculationDetail]]:
    built_up_area = max(data.site.built_up_area_m2, 10.0)
    building_vol = built_up_area * data.site.building_height_m
    
    # Natural Ventilation ACH calculation: Q = Cd * A * sqrt(2 * dP / rho)
    # Openable window area ~ 30% of total glass area
    gross_wall = 4.0 * np.sqrt(built_up_area / max(data.site.num_floors, 1)) * data.site.building_height_m
    win_area = gross_wall * (data.envelope.window_wall_ratio_pct / 100.0)
    openable_area = win_area * 0.35

    cd = 0.60  # Discharge coefficient for window openings
    delta_p = 2.5  # Typical wind pressure differential (Pascals)
    rho = 1.2  # Air density kg/m³

    if data.hvac_lighting.natural_ventilation_available and openable_area > 1.0:
        q_airflow_m3_s = cd * openable_area * np.sqrt((2.0 * delta_p) / rho)
        estimated_ach = (q_airflow_m3_s * 3600.0) / max(building_vol, 1.0)
    else:
        estimated_ach = 0.5  # Infiltration default

    estimated_ach = float(np.clip(estimated_ach, 0.5, 12.0))

    if estimated_ach > 6.0:
        suitability_str = "Excellent Cross-Ventilation"
    elif estimated_ach > 2.5:
        suitability_str = "Moderate Ventilation Potential"
    else:
        suitability_str = "Limited Natural Airflow"

    # Individual Passive Reduction Benefits
    # 1. Orientation benefit
    azimuth = abs(data.orientation.building_azimuth_deg)
    orientation_benefit = 6.0 if azimuth < 15 or (azimuth > 165 and azimuth < 195) else 2.0

    # 2. Shading benefit
    shading_benefit = 10.0 if "Overhang" in data.envelope.shading_device or "Louvers" in data.envelope.shading_device else 3.0

    # 3. Roof insulation & reflective roof
    roof_str = str(data.envelope.roof_type)
    roof_benefit = 12.0 if "Cool" in roof_str or "Green" in roof_str or "Insulated" in roof_str else 4.0

    # 4. Ventilation benefit
    vent_benefit = min(estimated_ach * 1.5, 12.0)

    # Sum of validated reductions clamped to physical limit (Max 45% reduction)
    raw_total_reduction = orientation_benefit + shading_benefit + roof_benefit + vent_benefit
    total_reduction_pct = float(min(raw_total_reduction, 45.0))

    passive_cooling_score = min(100.0, (total_reduction_pct / 45.0) * 100.0)

    metrics = PassiveMetrics(
        passive_cooling_score=round(passive_cooling_score, 1),
        estimated_ach=round(estimated_ach, 1),
        natural_ventilation_suitability=suitability_str,
        orientation_benefit_pct=round(orientation_benefit, 1),
        shading_benefit_pct=round(shading_benefit, 1),
        roof_insulation_benefit_pct=round(roof_benefit, 1),
        total_cooling_reduction_pct=round(total_reduction_pct, 1)
    )

    explanations = {
        "natural_ventilation_ach": CalculationDetail(
            formula="Q_airflow = Cd × A_open × √(2 × ΔP / ρ);  ACH = (Q_airflow × 3600) / V_building",
            inputs={
                "Building Volume (m³)": round(building_vol, 1),
                "Window Wall Ratio (%)": data.envelope.window_wall_ratio_pct,
                "Openable Window Area (m²)": round(openable_area, 1),
                "Pressure Differential (Pa)": delta_p
            },
            values={
                "Airflow Q": f"{round(q_airflow_m3_s if 'q_airflow_m3_s' in locals() else 0, 2)} m³/s",
                "Discharge Coeff Cd": cd
            },
            calculation_steps=f"(0.60 × {round(openable_area, 1)} × √(2 × 2.5 / 1.2)) × 3600 / {round(building_vol, 1)} = {round(estimated_ach, 1)} ACH",
            result_str=f"{round(estimated_ach, 1)} Air Changes per Hour (ACH)",
            assumptions=["Calculated using Orifice Flow Equation for cross-ventilation under 2.5 Pa wind pressure."],
            confidence_level=3,
            level_name="Level 3: Fluid Dynamics Airflow Equation"
        )
    }

    return metrics, explanations
