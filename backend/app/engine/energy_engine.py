import numpy as np
from typing import Dict, Any, Tuple
from app.models.schemas import FullProjectInput, EnergyMetrics, HeatGainBreakdown, CalculationDetail
from app.data.climate_db import get_climate_data

def calculate_energy(data: FullProjectInput) -> Tuple[EnergyMetrics, Dict[str, CalculationDetail]]:
    city_data = get_climate_data(data.project.location)
    built_up_area = max(data.site.built_up_area_m2, 10.0)
    avg_temp = city_data["avg_temperature_c"]
    set_temp = data.hvac_lighting.set_temperature_c
    delta_t = max(avg_temp - set_temp, 4.0)  # Min indoor-outdoor delta
    
    # 1. Lighting Energy
    lpd = data.hvac_lighting.lighting_power_density_w_m2
    lighting_hours = data.hvac_lighting.avg_lighting_hours_per_day
    # Daylight adjustment
    daylight_factor = 1.0 - (data.hvac_lighting.daylight_availability / 100.0) * 0.35
    effective_lighting_hours = lighting_hours * daylight_factor
    lighting_annual_kwh = (lpd * built_up_area * effective_lighting_hours * 365.0) / 1000.0

    # 2. Appliance Energy
    refr_kwh = data.hvac_lighting.refrigerators_qty * 1.5 * 365.0  # ~1.5 kWh/day each
    fans_kwh = data.hvac_lighting.fans_qty * 0.075 * data.hvac_lighting.appliance_operating_hours * 365.0
    comp_kwh = data.hvac_lighting.computers_qty * 0.15 * 8.0 * 250.0
    tvs_kwh = data.hvac_lighting.tvs_qty * 0.10 * 5.0 * 365.0
    other_kwh = data.hvac_lighting.other_appliances_kw * data.hvac_lighting.appliance_operating_hours * 365.0
    appliance_annual_kwh = refr_kwh + fans_kwh + comp_kwh + tvs_kwh + other_kwh

    # 3. Heat Gain Decomposition
    # Wall Area estimate: gross envelope wall area = Perimeter * Height
    building_volume = built_up_area * data.site.building_height_m
    approx_perimeter = 4.0 * np.sqrt(built_up_area / max(data.site.num_floors, 1))
    gross_wall_area = approx_perimeter * data.site.building_height_m
    
    wwr = data.envelope.window_wall_ratio_pct / 100.0
    window_area = gross_wall_area * wwr
    net_wall_area = gross_wall_area - window_area
    roof_area = data.solar.roof_area_m2

    # Conduction Heat Gains (kW)
    q_wall = (data.envelope.wall_u_value * net_wall_area * delta_t) / 1000.0
    q_roof = (data.envelope.roof_u_value * roof_area * delta_t) / 1000.0
    q_win_cond = (data.envelope.window_u_value * window_area * delta_t) / 1000.0
    
    # Solar Heat Gain through Windows (kW peak average)
    solar_irrad = city_data["solar_irradiation_kwh_m2_day"] / 10.0  # Approx peak kW/m²
    shgc_val = 0.40 if "Low-E" in data.envelope.glass_type else (0.70 if "Double" in data.envelope.glass_type else 0.82)
    # Shading factor reduction
    shading_reduction = 0.25 if "Overhang" in data.envelope.shading_device or "Louvers" in data.envelope.shading_device else 0.0
    q_win_solar = (shgc_val * (1.0 - shading_reduction) * solar_irrad * window_area)

    # People Heat Gain (kW)
    q_people = (data.envelope.num_occupants * 0.12)  # 120W per person (sensible + latent)

    # Lighting & Equipment Internal Gains (kW)
    q_lighting = (lpd * built_up_area * 0.8) / 1000.0
    q_equipment = (data.hvac_lighting.other_appliances_kw * 0.5)

    # Infiltration Heat Gain (kW): Q = rho * Cp * ACH * V * dT / 3600
    ach = 1.0  # Air changes per hour baseline
    q_infil = (1.2 * 1.005 * ach * building_volume * delta_t) / 3600.0

    q_total_peak_kw = (q_wall + q_roof + q_win_cond + q_win_solar + q_people + q_lighting + q_equipment + q_infil)

    # HVAC Electricity Consumption
    cop = max(data.hvac_lighting.hvac_cop, 1.0)
    ac_hours = data.hvac_lighting.ac_usage_hours
    # Cooling days per year based on CDD
    cooling_days = min(city_data["cooling_degree_days"] / 8.0, 280.0)
    
    # Average cooling load factor ~ 0.55 of peak
    hvac_cooling_annual_kwh = (q_total_peak_kw * 0.55 / cop) * ac_hours * cooling_days

    # Pump & Other Loads
    pump_annual_kwh = data.hvac_lighting.pumps_qty * 0.75 * 1.5 * 365.0

    total_annual_kwh = lighting_annual_kwh + appliance_annual_kwh + hvac_cooling_annual_kwh + pump_annual_kwh
    eui = total_annual_kwh / built_up_area

    # Monthly breakdown profile based on city temperature profile
    monthly_temps = np.array(city_data["monthly_temperature_c"])
    temp_weights = np.maximum(monthly_temps - 20.0, 2.0)
    temp_weights = temp_weights / np.sum(temp_weights)
    base_monthly = (lighting_annual_kwh + appliance_annual_kwh + pump_annual_kwh) / 12.0
    monthly_energy = (base_monthly + hvac_cooling_annual_kwh * temp_weights).tolist()

    heat_breakdown = HeatGainBreakdown(
        q_wall_kw=round(float(q_wall), 2),
        q_roof_kw=round(float(q_roof), 2),
        q_window_conduction_kw=round(float(q_win_cond), 2),
        q_window_solar_kw=round(float(q_win_solar), 2),
        q_people_kw=round(float(q_people), 2),
        q_lighting_kw=round(float(q_lighting), 2),
        q_equipment_kw=round(float(q_equipment), 2),
        q_infiltration_kw=round(float(q_infil), 2),
        q_total_kw=round(float(q_total_peak_kw), 2)
    )

    metrics = EnergyMetrics(
        lighting_annual_kwh=round(float(lighting_annual_kwh), 1),
        appliance_annual_kwh=round(float(appliance_annual_kwh), 1),
        hvac_cooling_annual_kwh=round(float(hvac_cooling_annual_kwh), 1),
        pump_other_annual_kwh=round(float(pump_annual_kwh), 1),
        total_annual_kwh=round(float(total_annual_kwh), 1),
        energy_use_intensity_eui=round(float(eui), 1),
        heat_gain_breakdown=heat_breakdown,
        monthly_energy_kwh=[round(float(m), 1) for m in monthly_energy]
    )

    # Formulas & Explanations for Modal Transparency
    explanations = {
        "lighting_energy": CalculationDetail(
            formula="E_lighting = (LPD × Area × Lighting_Hours × 365) / 1000",
            inputs={"LPD (W/m²)": lpd, "Built-up Area (m²)": built_up_area, "Lighting Hours/day": lighting_hours, "Daylight Availability (%)": data.hvac_lighting.daylight_availability},
            values={"Effective Hours/day": round(effective_lighting_hours, 2), "Days": 365},
            calculation_steps=f"({lpd} W/m² × {built_up_area} m² × {round(effective_lighting_hours, 2)} hrs/day × 365) / 1000 = {round(lighting_annual_kwh, 1)} kWh/yr",
            result_str=f"{round(lighting_annual_kwh, 1)} kWh/year",
            assumptions=["Daylight harvesting reduces electrical lighting by up to 35% during daytime hours."],
            confidence_level=3,
            level_name="Level 3: Engineering Equation"
        ),
        "hvac_cooling_energy": CalculationDetail(
            formula="Q_total = Q_wall + Q_roof + Q_window + Q_solar + Q_people + Q_lighting + Q_equip + Q_infil; HVAC_kWh = (Q_total × Load_Factor / COP) × AC_Hours × Cooling_Days",
            inputs={"Q_total (kW)": round(q_total_peak_kw, 2), "COP": cop, "AC Hours/day": ac_hours, "Cooling Days": round(cooling_days, 0)},
            values={"Peak Cooling Load": f"{round(q_total_peak_kw, 2)} kW", "Average Load Factor": 0.55},
            calculation_steps=f"({round(q_total_peak_kw, 2)} kW × 0.55 / {cop}) × {ac_hours} hrs/day × {int(cooling_days)} days = {round(hvac_cooling_annual_kwh, 1)} kWh/yr",
            result_str=f"{round(hvac_cooling_annual_kwh, 1)} kWh/year",
            assumptions=["COP represents Seasonal Coefficient of Performance under IS 1391 rating conditions."],
            confidence_level=3,
            level_name="Level 3: Simplified Thermal Load Model"
        ),
        "energy_use_intensity": CalculationDetail(
            formula="EUI = Total Annual Building Electricity (kWh/yr) / Total Built-up Area (m²)",
            inputs={"Total Annual Electricity": round(total_annual_kwh, 1), "Built-up Area": built_up_area},
            values={"Annual Electricity": f"{round(total_annual_kwh, 1)} kWh", "Area": f"{built_up_area} m²"},
            calculation_steps=f"{round(total_annual_kwh, 1)} kWh / {built_up_area} m² = {round(eui, 1)} kWh/m²/year",
            result_str=f"{round(eui, 1)} kWh/m²/year",
            assumptions=["Standard benchmark range for Indian residential buildings is 60–120 kWh/m²/yr."],
            confidence_level=2,
            level_name="Level 2: Derived Standard Metric"
        )
    }

    return metrics, explanations
