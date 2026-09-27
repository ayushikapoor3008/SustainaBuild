from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, CarbonMetrics, CalculationDetail
from app.data.climate_db import get_climate_data

def calculate_carbon(data: FullProjectInput, annual_electricity_kwh: float, solar_generation_kwh: float) -> Tuple[CarbonMetrics, Dict[str, CalculationDetail]]:
    city_data = get_climate_data(data.project.location)
    grid_ef = city_data.get("grid_emission_factor_kg_kwh", 0.82)
    built_up_area = max(data.site.built_up_area_m2, 10.0)

    # 1. Operational Carbon (Annual Tons)
    net_electricity_kwh = max(annual_electricity_kwh - solar_generation_kwh, 0.0)
    operational_co2_tons = (net_electricity_kwh * grid_ef) / 1000.0
    solar_offset_tons = (solar_generation_kwh * grid_ef) / 1000.0

    # 2. Embodied Carbon (Tons CO2)
    # Published ICE (Inventory of Carbon & Energy) factors
    co2_concrete = data.materials.concrete_qty_tons * 0.150  # 150 kg/ton
    co2_steel = data.materials.steel_qty_tons * 1.800     # 1800 kg/ton
    co2_brick = data.materials.brick_qty_thousand * 0.240   # 240 kg/1000 bricks
    co2_cement = data.materials.cement_qty_tons * 0.850    # 850 kg/ton
    co2_wood = data.materials.wood_qty_m3 * (-0.450)        # Sequestered -450 kg/m³
    co2_glass = (data.materials.glass_qty_m2 * 12.0 * 1.20) / 1000.0  # 12kg/m² glass * 1.2 kg CO2/kg

    raw_embodied_co2 = co2_concrete + co2_steel + co2_brick + co2_cement + co2_wood + co2_glass
    recycled_factor = 1.0 - (data.materials.recycled_materials_pct / 100.0) * 0.25
    final_embodied_co2 = raw_embodied_co2 * recycled_factor

    # 3. Total Lifetime Carbon (30 Years)
    lifetime_co2 = final_embodied_co2 + (operational_co2_tons * 30.0)
    co2_per_sqm_kg = (lifetime_co2 * 1000.0) / built_up_area

    # 4. Material Sustainability Score / 100
    recycled_score = (data.materials.recycled_materials_pct / 100.0) * 40.0
    embodied_intensity = final_embodied_co2 / built_up_area  # tons/m²
    embodied_score = max(0.0, 40.0 - (embodied_intensity * 80.0))
    timber_bonus = 10.0 if data.materials.wood_qty_m3 > 1.5 else 0.0
    material_score = min(100.0, recycled_score + embodied_score + timber_bonus + 10.0)

    potential_reduction_tons = (final_embodied_co2 * 0.20) + (solar_offset_tons * 30.0)

    metrics = CarbonMetrics(
        operational_co2_annual_tons=round(operational_co2_tons, 2),
        embodied_co2_total_tons=round(final_embodied_co2, 2),
        total_lifetime_co2_30yr_tons=round(lifetime_co2, 1),
        co2_per_sq_meter_kg=round(co2_per_sqm_kg, 1),
        material_sustainability_score=round(material_score, 1),
        solar_carbon_offset_tons=round(solar_offset_tons, 2),
        potential_carbon_reduction_tons=round(potential_reduction_tons, 1)
    )

    explanations = {
        "operational_carbon": CalculationDetail(
            formula="Operational_CO2 (Tons/yr) = (Net_Annual_Electricity (kWh) × Grid_EF (kg/kWh)) / 1000",
            inputs={
                "Net Electricity (kWh)": round(net_electricity_kwh, 1),
                "Grid Emission Factor (kg CO2/kWh)": grid_ef,
                "Region / Grid": city_data["climate_classification"]
            },
            values={
                "Annual Grid Electricity": f"{round(net_electricity_kwh, 1)} kWh",
                "Emission Factor": f"{grid_ef} kg CO₂/kWh"
            },
            calculation_steps=f"({round(net_electricity_kwh, 1)} kWh × {grid_ef} kg/kWh) / 1000 = {round(operational_co2_tons, 2)} Tons CO₂/year",
            result_str=f"{round(operational_co2_tons, 2)} Tons CO₂/year",
            assumptions=["Grid emission factors sourced from CEA (Central Electricity Authority India 2023 baseline)."],
            confidence_level=2,
            level_name="Level 2: Published CEA Grid Emission Factor"
        ),
        "embodied_carbon": CalculationDetail(
            formula="Embodied_CO2 = ∑ (Qty_i × EF_i) × (1 - 0.25 × Recycled_Pct)",
            inputs={
                "Concrete (Tons)": data.materials.concrete_qty_tons,
                "Steel (Tons)": data.materials.steel_qty_tons,
                "Brick (1000s)": data.materials.brick_qty_thousand,
                "Recycled Content (%)": data.materials.recycled_materials_pct
            },
            values={
                "Raw Embodied CO₂": f"{round(raw_embodied_co2, 2)} Tons",
                "Recycled Discount": f"{round((1 - recycled_factor)*100, 1)}%"
            },
            calculation_steps=f"({data.materials.concrete_qty_tons}×0.15 + {data.materials.steel_qty_tons}×1.8 + {data.materials.brick_qty_thousand}×0.24 + {data.materials.cement_qty_tons}×0.85 - {data.materials.wood_qty_m3}×0.45) × {round(recycled_factor, 2)} = {round(final_embodied_co2, 2)} Tons CO₂",
            result_str=f"{round(final_embodied_co2, 2)} Tons CO₂",
            assumptions=["Embodied coefficients derived from ICE Database v3.0 (University of Bath)."],
            confidence_level=4,
            level_name="Level 4: Published Material Life Cycle Coefficients"
        )
    }

    return metrics, explanations
