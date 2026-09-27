from typing import List
from app.models.schemas import (
    FullProjectInput, RecommendationSchema,
    EnergyMetrics, WaterMetrics, SolarMetrics, GreenMetrics, PassiveMetrics
)
from app.data.climate_db import get_climate_data

def generate_recommendations(
    data: FullProjectInput,
    energy: EnergyMetrics,
    water: WaterMetrics,
    solar: SolarMetrics,
    green: GreenMetrics,
    passive: PassiveMetrics
) -> List[RecommendationSchema]:
    city_data = get_climate_data(data.project.location)
    recs: List[RecommendationSchema] = []

    # 1. Solar PV Recommendation
    if solar.solar_coverage_pct < 60.0 and data.solar.available_solar_area_m2 >= 20.0:
        cost_est = (data.solar.available_solar_area_m2 * 220.0) * 110.0  # ~ ₹1.1L per kWp
        annual_sav_inr = (solar.annual_generation_kwh * 8.0)
        payback = cost_est / max(annual_sav_inr, 1.0)
        recs.append(RecommendationSchema(
            id="rec_solar_pv",
            title="Install Rooftop Solar PV System",
            why=f"Roof area can support {solar.panel_count} PV panels, generating {solar.annual_generation_kwh} kWh/yr clean solar energy and offsetting grid electricity.",
            impact="High",
            cost="Medium",
            priority=1,
            estimated_energy_reduction_pct=round(solar.solar_coverage_pct, 1),
            estimated_cost_inr=round(cost_est, 0),
            payback_years=round(payback, 1),
            confidence_pct=92.0,
            category="Renewable Energy"
        ))

    # 2. Window Glazing & Shading
    if "Low-E" not in data.envelope.glass_type and data.envelope.window_wall_ratio_pct > 18.0:
        cost_est = data.envelope.floor_area_m2 * 450.0  # Approx ₹450/m² upgrade cost
        annual_sav_kwh = energy.hvac_cooling_annual_kwh * 0.18
        annual_sav_inr = annual_sav_kwh * 8.0
        payback = cost_est / max(annual_sav_inr, 1.0)
        recs.append(RecommendationSchema(
            id="rec_low_e_glass",
            title="Upgrade to Low-E Double Glazing & External Shading",
            why="High solar heat gain through clear glass increases cooling load peak Q_solar. Low-E glass (SHGC 0.40) blocks 60% of infrared solar radiation.",
            impact="High",
            cost="Medium",
            priority=2,
            estimated_energy_reduction_pct=14.5,
            estimated_cost_inr=round(cost_est, 0),
            payback_years=round(payback, 1),
            confidence_pct=88.0,
            category="Building Envelope"
        ))

    # 3. Rainwater Harvesting
    if not data.water.rainwater_harvesting_enabled and city_data["annual_rainfall_mm"] > 500.0:
        cost_est = 45000.0  # Tank + filter installation ~ ₹45k
        water_sav_inr = (water.rainwater_harvested_litres / 1000.0) * 45.0
        payback = cost_est / max(water_sav_inr, 1.0)
        recs.append(RecommendationSchema(
            id="rec_rainwater",
            title="Implement Rainwater Harvesting & Catchment Storage",
            why=f"Annual rainfall of {city_data['annual_rainfall_mm']} mm can yield {water.rainwater_harvested_litres} Litres of fresh water from roof catchment.",
            impact="High",
            cost="Low",
            priority=3,
            estimated_energy_reduction_pct=0.0,
            estimated_cost_inr=cost_est,
            payback_years=round(payback, 1),
            confidence_pct=94.0,
            category="Water Conservation"
        ))

    # 4. Green Roof / Roof Insulation
    roof_str = str(data.envelope.roof_type)
    if "Cool" not in roof_str and "Green" not in roof_str:
        cost_est = data.solar.roof_area_m2 * 650.0  # Reflective coat / insulation
        annual_sav_kwh = energy.hvac_cooling_annual_kwh * 0.12
        annual_sav_inr = annual_sav_kwh * 8.0
        payback = cost_est / max(annual_sav_inr, 1.0)
        recs.append(RecommendationSchema(
            id="rec_cool_roof",
            title="Apply Cool Roof High-Albedo Reflective Coating",
            why="Uninsulated roof conducts severe heat into top floor spaces. High SRI (>78) white coating lowers roof surface temp by 12–15°C.",
            impact="Medium",
            cost="Low",
            priority=4,
            estimated_energy_reduction_pct=11.0,
            estimated_cost_inr=round(cost_est, 0),
            payback_years=round(payback, 1),
            confidence_pct=90.0,
            category="Passive Cooling"
        ))

    # 5. Tree Canopy & Vegetation
    if green.green_coverage_pct < green.recommended_green_pct:
        cost_est = green.tree_recommendation_count * 1500.0 + 10000.0
        recs.append(RecommendationSchema(
            id="rec_tree_canopy",
            title="Plant Native Urban Shade Trees & Increase Green Cover",
            why=f"Current green coverage of {green.green_coverage_pct}% is below the recommended {green.recommended_green_pct}% climate benchmark for {data.project.location}.",
            impact="Medium",
            cost="Low",
            priority=5,
            estimated_energy_reduction_pct=6.5,
            estimated_cost_inr=round(cost_est, 0),
            payback_years=2.5,
            confidence_pct=85.0,
            category="Green Infrastructure"
        ))

    # Sort recommendations by priority
    recs.sort(key=lambda x: x.priority)
    return recs
