import type { FullProjectInput } from '../types/ecobuild';

export const DEMO_PROJECT_INPUT: FullProjectInput = {
  project: {
    project_name: "Eco Residence Delhi",
    location: "Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    building_type: "Residential",
    total_budget: 4000000.0,
    sustainable_budget: 600000.0,
    max_additional_investment: 400000.0
  },
  site: {
    plot_area_m2: 185.8,
    built_up_area_m2: 139.35,
    num_floors: 2,
    building_height_m: 6.5,
    ground_coverage_pct: 45.0,
    existing_vegetation_pct: 10.0,
    proposed_vegetation_pct: 25.0,
    open_area_pct: 55.0,
    road_width_m: 9.0,
    surrounding_building_height_m: 7.0,
    site_slope_deg: 0.0
  },
  orientation: {
    north_orientation_deg: 0.0,
    building_azimuth_deg: 0.0,
    main_exposure: "South-East",
    main_entrance_direction: "North"
  },
  envelope: {
    floor_area_m2: 139.35,
    num_occupants: 4,
    occupancy_hours_per_day: 14.0,
    window_wall_ratio_pct: 25.0,
    window_orientation: "South/East",
    glass_type: "Double Clear (U=2.8, SHGC=0.70)",
    window_u_value: 2.8,
    wall_material: "AAC Block Masonry with Plaster",
    wall_u_value: 0.65,
    roof_material: "RC Slab with EPS Insulation",
    roof_u_value: 0.50,
    floor_material: "Vitrified Tiles over Concrete Base",
    insulation_thickness_cm: 5.0,
    roof_type: "Insulated Concrete",
    shading_device: "Overhang Louvers",
    overhang_depth_m: 0.6
  },
  hvac_lighting: {
    hvac_type: "Inverter Split AC (COP 4.2)",
    hvac_cop: 4.2,
    ac_usage_hours: 8.0,
    set_temperature_c: 24.0,
    fan_usage: true,
    natural_ventilation_available: true,
    lighting_type: "Standard LED (5 W/m²)",
    lighting_power_density_w_m2: 5.0,
    avg_lighting_hours_per_day: 6.0,
    daylight_availability: 70.0,
    refrigerators_qty: 1,
    fans_qty: 6,
    computers_qty: 2,
    tvs_qty: 2,
    pumps_qty: 1,
    other_appliances_kw: 1.2,
    appliance_operating_hours: 8.0
  },
  water: {
    daily_water_per_person_l: 135.0,
    fixture_types: "Standard Dual-Flush & Aerators",
    low_flow_fixtures_enabled: true,
    greywater_reuse_enabled: false,
    rainwater_harvesting_enabled: true,
    rainwater_tank_capacity_l: 5000.0
  },
  solar: {
    roof_area_m2: 70.0,
    available_solar_area_m2: 45.0,
    panel_efficiency_pct: 20.5,
    panel_capacity_w: 400.0,
    inverter_efficiency_pct: 96.0,
    shading_factor_pct: 10.0
  },
  green: {
    existing_trees_count: 2,
    proposed_trees_count: 4,
    green_roof_enabled: false,
    green_roof_area_m2: 0.0,
    vertical_garden_enabled: false,
    vertical_garden_area_m2: 0.0,
    lawn_area_m2: 30.0,
    native_plants_pct: 75.0,
    permeable_surface_pct: 40.0
  },
  materials: {
    concrete_qty_tons: 85.0,
    steel_qty_tons: 6.5,
    brick_qty_thousand: 12.0,
    cement_qty_tons: 18.0,
    wood_qty_m3: 2.5,
    glass_qty_m2: 35.0,
    recycled_materials_pct: 15.0
  },
  is_professional_mode: false
};
