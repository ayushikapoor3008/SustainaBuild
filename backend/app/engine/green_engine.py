import numpy as np
from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, GreenMetrics, CalculationDetail
from app.data.climate_db import get_climate_data

def calculate_green(data: FullProjectInput) -> Tuple[GreenMetrics, Dict[str, CalculationDetail]]:
    city_data = get_climate_data(data.project.location)
    plot_area = max(data.site.plot_area_m2, 10.0)
    
    # Canopy calculation: ~12 m² canopy area per tree
    total_trees = data.green.existing_trees_count + data.green.proposed_trees_count
    tree_canopy_area = total_trees * 12.0

    green_roof_area = data.green.green_roof_area_m2 if data.green.green_roof_enabled else 0.0
    vert_garden_area = data.green.vertical_garden_area_m2 if data.green.vertical_garden_enabled else 0.0
    lawn_area = data.green.lawn_area_m2

    total_green_area = lawn_area + tree_canopy_area + green_roof_area + (vert_garden_area * 0.5)
    green_coverage_pct = (total_green_area / plot_area) * 100.0
    green_coverage_pct = float(min(green_coverage_pct, 100.0))

    # Recommended green coverage benchmark (NBC & IGBC guidelines ~ 25% minimum, higher for hot climates)
    recommended_pct = 25.0
    if "Hot" in city_data["climate_classification"] or "Composite" in city_data["climate_classification"]:
        recommended_pct = 30.0

    # Recommendations gap calculation
    tree_rec = max(int(np.ceil((plot_area * 0.15) / 12.0)) - total_trees, 0)
    green_roof_rec = round(data.solar.roof_area_m2 * 0.40, 1) if not data.green.green_roof_enabled else 0.0
    vert_rec = round(data.site.building_height_m * 6.0, 1) if not data.green.vertical_garden_enabled else 0.0
    perm_rec = 50.0

    # Urban Heat Risk Index calculation
    hardscape_pct = 100.0 - green_coverage_pct - (data.green.permeable_surface_pct * 0.3)
    temp_factor = (city_data["avg_temperature_c"] - 20.0) / 15.0
    heat_risk_score = (hardscape_pct * 0.5) + (temp_factor * 30.0) - (total_trees * 1.5)
    
    if heat_risk_score > 65.0:
        heat_risk_str = "Very High"
    elif heat_risk_score > 45.0:
        heat_risk_str = "High"
    elif heat_risk_score > 25.0:
        heat_risk_str = "Moderate"
    else:
        heat_risk_str = "Low"

    # Heat reduction score (0 - 100)
    potential_heat_red = min(100.0, (green_coverage_pct * 1.8) + (total_trees * 3.0) + (15.0 if data.green.green_roof_enabled else 0.0))

    metrics = GreenMetrics(
        green_coverage_pct=round(green_coverage_pct, 1),
        recommended_green_pct=round(recommended_pct, 1),
        tree_recommendation_count=tree_rec,
        green_roof_recommendation_m2=green_roof_rec,
        vertical_garden_recommendation_m2=vert_rec,
        permeable_recommendation_pct=perm_rec,
        microclimate_heat_risk=heat_risk_str,
        potential_heat_reduction_score=round(potential_heat_red, 1)
    )

    explanations = {
        "green_coverage": CalculationDetail(
            formula="Green_Coverage (%) = (Lawn_Area + Tree_Canopy_Area + Green_Roof_Area + Vertical_Garden_Area) / Plot_Area × 100",
            inputs={
                "Plot Area (m²)": plot_area,
                "Lawn Area (m²)": lawn_area,
                "Total Trees": total_trees,
                "Green Roof Area (m²)": green_roof_area,
                "Vertical Garden (m²)": vert_garden_area
            },
            values={
                "Tree Canopy Area": f"{tree_canopy_area} m² (12 m²/tree)",
                "Total Green Area": f"{round(total_green_area, 1)} m²"
            },
            calculation_steps=f"({lawn_area} + {tree_canopy_area} + {green_roof_area} + {vert_garden_area * 0.5}) / {plot_area} × 100 = {round(green_coverage_pct, 1)}%",
            result_str=f"{round(green_coverage_pct, 1)}%",
            assumptions=["Each mature tree canopy estimated at 12 m² plan area coverage."],
            confidence_level=3,
            level_name="Level 3: Spatial Canopy Area Ratio"
        )
    }

    return metrics, explanations
