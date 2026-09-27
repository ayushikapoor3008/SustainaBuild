from fastapi import FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
import os

from app.models.schemas import FullProjectInput, WhatIfOptions, AnalysisResult
from app.data.climate_db import CLIMATE_DATABASE, get_climate_data
from app.data.regulatory_db import get_regulations_for_location, get_authority_for_location, REGULATORY_DATABASE
from app.engine.energy_engine import calculate_energy
from app.engine.solar_engine import calculate_solar
from app.engine.water_engine import calculate_water
from app.engine.green_engine import calculate_green
from app.engine.carbon_engine import calculate_carbon
from app.engine.passive_engine import calculate_passive
from app.engine.eco_score_engine import calculate_eco_score
from app.engine.what_if_engine import run_full_analysis, simulate_what_if
from app.engine.compliance_engine import calculate_compliance
from app.engine.renewable_engine import calculate_renewable
from app.engine.water_circularity_engine import calculate_water_circularity
from app.engine.waste_engine import calculate_waste
from app.engine.resource_circularity_engine import calculate_resource_circularity
from app.database.db import (
    save_project_to_db, get_all_projects_from_db,
    get_project_by_id_from_db, delete_project_from_db
)


app = FastAPI(
    title="SustainaBuild AI API",
    description="Intelligent Sustainable Architecture & Renewable Resource Management — Powered by EcoBuild Intelligence.",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "SustainaBuild AI",
        "subtitle": "Intelligent Sustainable Architecture & Renewable Resource Management",
        "tagline": "Design Better. Build Greener. Manage Resources Smarter.",
        "powered_by": "EcoBuild Intelligence",
        "version": "2.0.0",
        "supported_cities": list(CLIMATE_DATABASE.keys())
    }

@app.get("/api/climate")
def get_all_climates():
    return {city: data for city, data in CLIMATE_DATABASE.items()}

@app.get("/api/climate/{city}")
def get_city_climate(city: str):
    if city not in CLIMATE_DATABASE:
        # Fallback with friendly message
        return {
            "warning": f"Live data unavailable for '{city}'. EcoBuild is using regional baseline data.",
            "data": get_climate_data(city)
        }
    return CLIMATE_DATABASE[city]

@app.post("/api/analyze", response_model=AnalysisResult)
def analyze_building(input_data: FullProjectInput):
    try:
        res = run_full_analysis(input_data)
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Calculation error: {str(e)}")

@app.post("/api/what-if")
def calculate_what_if(input_data: FullProjectInput, options: WhatIfOptions):
    try:
        return simulate_what_if(input_data, options)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"What-If Simulation error: {str(e)}")

@app.post("/api/calculate/energy")
def calculate_energy_only(input_data: FullProjectInput):
    metrics, explained = calculate_energy(input_data)
    return {"metrics": metrics, "explained": explained}

@app.post("/api/calculate/water")
def calculate_water_only(input_data: FullProjectInput):
    metrics, explained = calculate_water(input_data)
    return {"metrics": metrics, "explained": explained}

@app.post("/api/calculate/solar")
def calculate_solar_only(input_data: FullProjectInput):
    energy, _ = calculate_energy(input_data)
    metrics, explained = calculate_solar(input_data, energy.total_annual_kwh)
    return {"metrics": metrics, "explained": explained}

@app.post("/api/calculate/carbon")
def calculate_carbon_only(input_data: FullProjectInput):
    energy, _ = calculate_energy(input_data)
    solar, _ = calculate_solar(input_data, energy.total_annual_kwh)
    metrics, explained = calculate_carbon(input_data, energy.total_annual_kwh, solar.annual_generation_kwh)
    return {"metrics": metrics, "explained": explained}

@app.post("/api/calculate/green")
def calculate_green_only(input_data: FullProjectInput):
    metrics, explained = calculate_green(input_data)
    return {"metrics": metrics, "explained": explained}

@app.post("/api/calculate/eco-score")
def calculate_eco_score_only(input_data: FullProjectInput):
    result = run_full_analysis(input_data)
    return {"eco_scores": result.eco_scores, "confidence": result.confidence}

@app.post("/api/projects")
def create_or_update_project(input_data: FullProjectInput, project_id: Optional[str] = None):
    result = run_full_analysis(input_data)
    saved_id = save_project_to_db(input_data.model_dump(), result.model_dump(), project_id)
    return {"id": saved_id, "status": "saved", "analysis_result": result}

@app.get("/api/projects")
def list_projects():
    return get_all_projects_from_db()

@app.get("/api/projects/{project_id}")
def get_project(project_id: str):
    proj = get_project_by_id_from_db(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str):
    success = delete_project_from_db(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found or already deleted")
    return {"status": "deleted", "id": project_id}

@app.get("/api/demo")
def get_demo_analysis():
    demo_input = FullProjectInput()
    res = run_full_analysis(demo_input)
    return {"input": demo_input, "analysis": res}


# ─── SustainaBuild AI — New Endpoints ────────────────────────────────────────

@app.get("/api/authorities")
def list_authorities():
    """Return the list of known city-authority mappings."""
    from app.data.regulatory_db import AUTHORITY_MAP_REF  # noqa: F401
    return {"message": "Use /api/authorities/{city} for a specific city."}

@app.get("/api/authorities/{city}")
def get_authority(city: str):
    """Return the applicable authority for a given city."""
    return get_authority_for_location(city)

@app.get("/api/regulations/{location}")
def get_regulations(location: str, building_type: Optional[str] = None):
    """Return the regulatory data entries for a given location."""
    regs = get_regulations_for_location(location, building_type)
    return {
        "location": location,
        "building_type": building_type,
        "count": len(regs),
        "regulations": regs,
        "disclaimer": "Data for planning purposes only. Verify with relevant authority."
    }

@app.post("/api/compliance")
def run_compliance_check(
    location: str = Query(...),
    building_type: str = Query("Residential"),
    plot_area_m2: float = Query(200.0),
    built_up_area_m2: float = Query(280.0),
    num_floors: int = Query(2),
    building_height_m: float = Query(6.5),
    road_width_m: float = Query(9.0),
    ground_coverage_pct: float = Query(45.0),
    proposed_green_pct: float = Query(25.0),
    parking_ecs: Optional[float] = Query(None),
    dwelling_units: Optional[int] = Query(None),
):
    """
    Run a preliminary legal compliance check for a building project.
    Returns PASS / WARNING / NOT_VERIFIED for each applicable regulation.
    NOT a legal approval — for planning and educational purposes only.
    """
    try:
        result = calculate_compliance(
            location=location,
            building_type=building_type,
            plot_area_m2=plot_area_m2,
            built_up_area_m2=built_up_area_m2,
            num_floors=num_floors,
            building_height_m=building_height_m,
            road_width_m=road_width_m,
            ground_coverage_pct=ground_coverage_pct,
            proposed_green_pct=proposed_green_pct,
            parking_ecs=parking_ecs,
            dwelling_units=dwelling_units,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Compliance check error: {str(e)}")

@app.post("/api/renewable")
def calculate_renewable_energy(
    usable_solar_area_m2: float = Query(45.0),
    panel_efficiency_pct: float = Query(20.0),
    panel_capacity_w: float = Query(400.0),
    solar_irradiation_kwh_m2_day: float = Query(5.4),
    system_losses_pct: float = Query(14.0),
    annual_energy_demand_kwh: float = Query(5000.0),
    battery_capacity_kwh: float = Query(10.0),
    depth_of_discharge_pct: float = Query(80.0),
    round_trip_efficiency_pct: float = Query(90.0),
    grid_emission_factor: float = Query(0.82),
):
    """Calculate solar PV and battery storage metrics."""
    try:
        return calculate_renewable(
            roof_area_m2=usable_solar_area_m2 * 1.3,
            usable_solar_area_m2=usable_solar_area_m2,
            panel_efficiency_pct=panel_efficiency_pct,
            panel_capacity_w=panel_capacity_w,
            solar_irradiation_kwh_m2_day=solar_irradiation_kwh_m2_day,
            system_losses_pct=system_losses_pct,
            annual_energy_demand_kwh=annual_energy_demand_kwh,
            battery_capacity_kwh=battery_capacity_kwh,
            depth_of_discharge_pct=depth_of_discharge_pct,
            round_trip_efficiency_pct=round_trip_efficiency_pct,
            grid_emission_factor=grid_emission_factor,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Renewable energy calculation error: {str(e)}")

@app.post("/api/water-circularity")
def calculate_water_circular(
    location: str = Query("Delhi"),
    num_occupants: int = Query(4),
    roof_area_m2: float = Query(70.0),
    landscape_area_m2: float = Query(30.0),
    daily_water_lpcd: float = Query(135.0),
    rainwater_tank_capacity_l: float = Query(5000.0),
    greywater_enabled: bool = Query(False),
    stp_enabled: bool = Query(False),
):
    """Calculate rainwater harvesting, greywater recycling, and STP estimates."""
    try:
        return calculate_water_circularity(
            location=location,
            num_occupants=num_occupants,
            plot_area_m2=roof_area_m2 * 1.5,
            roof_area_m2=roof_area_m2,
            landscape_area_m2=landscape_area_m2,
            daily_water_lpcd=daily_water_lpcd,
            rainwater_tank_capacity_l=rainwater_tank_capacity_l,
            greywater_enabled=greywater_enabled,
            stp_enabled=stp_enabled,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Water circularity calculation error: {str(e)}")

@app.post("/api/waste")
def calculate_waste_management(
    num_occupants: int = Query(4),
    building_type: str = Query("Residential"),
    composting_enabled: bool = Query(True),
    recycling_enabled: bool = Query(True),
    green_area_m2: float = Query(30.0),
):
    """Calculate waste generation, composting, recycling, and diversion metrics."""
    try:
        return calculate_waste(
            num_occupants=num_occupants,
            building_type=building_type,
            composting_enabled=composting_enabled,
            recycling_enabled=recycling_enabled,
            green_area_m2=green_area_m2,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Waste calculation error: {str(e)}")

@app.post("/api/resource-circularity")
def calculate_resource_circular(
    energy_independence_pct: float = Query(0.0),
    water_independence_pct: float = Query(0.0),
    waste_diversion_pct: float = Query(0.0),
    green_coverage_pct: float = Query(25.0),
    recommended_green_pct: float = Query(30.0),
    solar_coverage_pct: float = Query(0.0),
    annual_co2_avoided_tons: float = Query(0.0),
    annual_water_saved_l: float = Query(0.0),
    annual_energy_demand_kwh: float = Query(5000.0),
):
    """Calculate the Resource Circularity Score (separate from Eco Score)."""
    try:
        return calculate_resource_circularity(
            energy_independence_pct=energy_independence_pct,
            water_independence_pct=water_independence_pct,
            waste_diversion_pct=waste_diversion_pct,
            green_coverage_pct=green_coverage_pct,
            recommended_green_pct=recommended_green_pct,
            solar_coverage_pct=solar_coverage_pct,
            annual_co2_avoided_tons=annual_co2_avoided_tons,
            annual_water_saved_l=annual_water_saved_l,
            annual_energy_demand_kwh=annual_energy_demand_kwh,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Resource circularity calculation error: {str(e)}")

