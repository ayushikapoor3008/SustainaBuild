"""
regulatory_db.py — Structured Regulatory Database for SustainaBuild AI

All entries carry a verification_status field:
  VERIFIED              — sourced from an official government/authority document
  REQUIRES_CONFIRMATION — rule is referenced but conditions unclear; needs authority confirmation
  NOT_VERIFIED          — no reliable official source found; do NOT use for compliance decisions

IMPORTANT: This data is for preliminary planning and educational purposes only.
It is NOT a substitute for verification by the relevant authority or a licensed professional.
"""

from typing import Dict, List, Any

REGULATORY_DATABASE: List[Dict[str, Any]] = [

    # ─────────────────────────────────────────────────────────────────────────
    # NOIDA — New Okhla Industrial Development Authority (NIDA/NOIDA Authority)
    # Source: Noida Authority Building Regulations & Directions, 2010 (amended)
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "NOIDA-FAR-RES-001",
        "location": "Noida",
        "state": "Uttar Pradesh",
        "authority": "New Okhla Industrial Development Authority (NOIDA Authority)",
        "authority_website": "https://noidaauthorityonline.in",
        "regulation_name": "Floor Area Ratio (FAR) — Residential Plot",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Individual Residential", "Villa"],
        "land_use_category": "Residential",
        "plot_category": "Individual Residential Plot",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Maximum permissible FAR for residential plots in Noida. The FAR depends on plot size and sector type.",
        "required_value": 2.0,
        "unit": "ratio",
        "conditions": "FAR of 2.0 applies to standard residential plots. Premium sectors may differ. Check with NOIDA Authority for plot-specific FAR.",
        "exceptions": "Corner plots, plots on roads wider than 24m may have different FAR. Authority discretion applies.",
        "effective_date": "2010-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "NOIDA Authority Building Regulations & Directions",
        "official_source_url": "https://noidaauthorityonline.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "The specific FAR table has multiple conditions. Users must verify with NOIDA Authority for their specific plot."
    },
    {
        "id": "NOIDA-GRN-RES-001",
        "location": "Noida",
        "state": "Uttar Pradesh",
        "authority": "New Okhla Industrial Development Authority (NOIDA Authority)",
        "authority_website": "https://noidaauthorityonline.in",
        "regulation_name": "Open/Green Space — Group Housing",
        "regulation_category": "Green / Open Space",
        "building_type": ["Apartment", "Group Housing", "Multi-Storey Residential"],
        "land_use_category": "Residential",
        "plot_category": "Group Housing",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "For group housing projects in Noida, a minimum percentage of the plot area must be maintained as open/green space. The exact requirement depends on project density and plot area.",
        "required_value": 30.0,
        "unit": "percent of plot area",
        "conditions": "Open space requirements apply to group housing. Individual plot owners follow different norms. Green area and open space are not identical — check authority definition.",
        "exceptions": "Podium parking may have different treatment. Consult NOIDA Authority for group housing-specific norms.",
        "effective_date": "2010-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "NOIDA Authority Group Housing Norms",
        "official_source_url": "https://noidaauthorityonline.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "30% is commonly cited but must be confirmed with NOIDA Authority for the specific project."
    },
    {
        "id": "NOIDA-HT-RES-001",
        "location": "Noida",
        "state": "Uttar Pradesh",
        "authority": "New Okhla Industrial Development Authority (NOIDA Authority)",
        "authority_website": "https://noidaauthorityonline.in",
        "regulation_name": "Maximum Building Height — Residential",
        "regulation_category": "Building Height",
        "building_type": ["Residential", "Individual Residential", "Villa", "Apartment"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Building height is generally governed by FAR consumed, number of floors permitted, and road width. For individual plots, the maximum height is typically limited.",
        "required_value": 15.0,
        "unit": "metres",
        "conditions": "Height limit varies with road width and plot area. Taller buildings require fire NOC and may need aviation clearance. For high-rise (>15m), NOIDA Authority and Fire Department approval is mandatory.",
        "exceptions": "Buildings near airports are subject to AAI height restrictions.",
        "effective_date": "2010-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "NOIDA Authority Building Regulations",
        "official_source_url": "https://noidaauthorityonline.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "15m is a typical reference. Exact limit depends on plot, sector, and road width. Must be confirmed."
    },
    {
        "id": "NOIDA-PARK-RES-001",
        "location": "Noida",
        "state": "Uttar Pradesh",
        "authority": "New Okhla Industrial Development Authority (NOIDA Authority)",
        "regulation_name": "Parking Requirement — Residential",
        "regulation_category": "Parking",
        "building_type": ["Residential", "Apartment", "Group Housing"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Minimum parking spaces required per residential dwelling unit.",
        "required_value": 1.0,
        "unit": "ECS per dwelling unit",
        "conditions": "1 ECS (Equivalent Car Space) per dwelling unit for group housing. Visitor parking additional. Two-wheeler parking also required.",
        "exceptions": "EWS/LIG units may have different norms.",
        "effective_date": "2010-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "NOIDA Authority Building Regulations",
        "official_source_url": "https://noidaauthorityonline.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "Parking norms are subject to revision. Verify with NOIDA Authority."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # DELHI — Delhi Development Authority (DDA) / Municipal Corporation of Delhi
    # Source: Delhi Master Plan 2041, Delhi Building Bylaws
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "DELHI-FAR-RES-001",
        "location": "Delhi",
        "state": "Delhi",
        "authority": "Delhi Development Authority (DDA) / Municipal Corporation of Delhi",
        "authority_website": "https://dda.gov.in",
        "regulation_name": "Floor Area Ratio (FAR) — Residential",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Individual Residential"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "FAR for residential plots in Delhi as per Delhi Master Plan 2021/2041.",
        "required_value": 3.5,
        "unit": "ratio",
        "conditions": "FAR of 3.5 applicable to certain residential zones with roads ≥18m. Lower FAR in other zones. Bonus FAR available for green buildings under certain conditions.",
        "exceptions": "Lal Dora, extended Lal Dora, and urban villages have different norms.",
        "effective_date": "2021-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "Delhi Master Plan 2041 — DDA",
        "official_source_url": "https://dda.gov.in/ddanew/pdf/Planning/MPD-2041.pdf",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "MPD-2041 is the primary reference. DDA zoning must be checked for specific plot."
    },
    {
        "id": "DELHI-GRN-RES-001",
        "location": "Delhi",
        "state": "Delhi",
        "authority": "Delhi Development Authority (DDA)",
        "authority_website": "https://dda.gov.in",
        "regulation_name": "Ground Coverage — Residential",
        "regulation_category": "Ground Coverage",
        "building_type": ["Residential", "Individual Residential", "Apartment"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Maximum ground coverage (building footprint as % of plot area) for residential use.",
        "required_value": 33.33,
        "unit": "percent of plot area",
        "conditions": "Maximum ground coverage of 33.33% (1/3rd) for residential plots above a certain size. Smaller plots may have different norms.",
        "exceptions": "Mixed-use zones and commercial zones have different coverage norms.",
        "effective_date": "2021-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "Delhi Master Plan 2041 — DDA",
        "official_source_url": "https://dda.gov.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "Ground coverage norms vary by zone. Must be verified with MCD/DDA for the specific locality."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # NATIONAL — National Building Code (NBC) 2016
    # Published by: Bureau of Indian Standards (BIS)
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "NBC-FIRE-HT-001",
        "location": "ALL",
        "state": "ALL",
        "authority": "Bureau of Indian Standards (BIS) — National Building Code 2016",
        "authority_website": "https://bis.gov.in",
        "regulation_name": "Fire Safety — High-Rise Building Definition",
        "regulation_category": "Fire Safety",
        "building_type": ["ALL"],
        "land_use_category": "ALL",
        "plot_category": "ALL",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Buildings with height above 15 metres are classified as High-Rise and require mandatory fire NOC from the State Fire Department.",
        "required_value": 15.0,
        "unit": "metres (threshold height for high-rise classification)",
        "conditions": "High-rise buildings must comply with NBC 2016 Part 4 — Fire and Life Safety. Fire NOC mandatory before occupancy certificate.",
        "exceptions": "Industrial buildings may have different thresholds.",
        "effective_date": "2016-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "National Building Code of India 2016 — Part 4",
        "official_source_url": "https://bis.gov.in/product/national-building-code-of-india-2016-two-volume-set/",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "NBC 2016 is a nationally applicable model code. State adoption varies; check local regulations."
    },
    {
        "id": "NBC-WATER-OCC-001",
        "location": "ALL",
        "state": "ALL",
        "authority": "Bureau of Indian Standards (BIS) — National Building Code 2016",
        "authority_website": "https://bis.gov.in",
        "regulation_name": "Water Supply Standard — Residential Occupancy",
        "regulation_category": "Water Supply",
        "building_type": ["Residential", "Apartment", "Individual Residential"],
        "land_use_category": "Residential",
        "plot_category": "ALL",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "NBC 2016 recommends minimum daily water supply of 135 litres per capita for residential buildings with individual house service connections.",
        "required_value": 135.0,
        "unit": "litres per capita per day (LPCD)",
        "conditions": "This is a minimum recommended standard. Local utility supply may be less. Rainwater harvesting and greywater reuse encouraged to supplement.",
        "exceptions": "EWS housing: 70 LPCD. Low-income group: 100 LPCD.",
        "effective_date": "2016-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "National Building Code of India 2016 — Part 9 Section 2",
        "official_source_url": "https://bis.gov.in",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "Standard NBC reference for water demand calculation."
    },
    {
        "id": "NBC-PARKING-001",
        "location": "ALL",
        "state": "ALL",
        "authority": "Bureau of Indian Standards (BIS) — National Building Code 2016",
        "authority_website": "https://bis.gov.in",
        "regulation_name": "Parking Standards — Residential",
        "regulation_category": "Parking",
        "building_type": ["Residential", "Apartment", "Group Housing"],
        "land_use_category": "Residential",
        "plot_category": "ALL",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "NBC 2016 recommends minimum parking provisions for residential buildings.",
        "required_value": 1.0,
        "unit": "ECS per dwelling unit (for floor area ≤100 m²)",
        "conditions": "Dwelling units >100 m²: 1.5 ECS. >200 m²: 2 ECS. Local authority norms override NBC.",
        "exceptions": "Local authority parking norms take precedence over NBC.",
        "effective_date": "2016-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "National Building Code of India 2016",
        "official_source_url": "https://bis.gov.in",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "Local authority norms usually apply. NBC is a reference baseline."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # NATIONAL — Energy Conservation Building Code (ECBC) 2017
    # Published by: Bureau of Energy Efficiency (BEE), Govt of India
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "ECBC-EUI-COM-001",
        "location": "ALL",
        "state": "ALL",
        "authority": "Bureau of Energy Efficiency (BEE) — ECBC 2017",
        "authority_website": "https://beeindia.gov.in/content/ecbc",
        "regulation_name": "Energy Conservation Building Code — Commercial Buildings",
        "regulation_category": "Energy Efficiency",
        "building_type": ["Commercial", "Office", "Educational", "Institutional"],
        "land_use_category": "Commercial",
        "plot_category": "ALL",
        "plot_size_range_m2": {"min": 500, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "ECBC 2017 applies to new commercial buildings with connected load ≥100 kW or contract demand ≥500 kVA. Sets energy performance standards for envelope, HVAC, lighting, and water heating.",
        "required_value": 100,
        "unit": "kW connected load (applicability threshold)",
        "conditions": "Buildings meeting the threshold must comply with ECBC 2017 envelope, lighting, HVAC, and water heating requirements. BEE Star Rating encouraged.",
        "exceptions": "Residential buildings below the threshold are exempt. States have separate residential energy codes.",
        "effective_date": "2017-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "Energy Conservation Building Code 2017 — BEE",
        "official_source_url": "https://beeindia.gov.in/content/ecbc",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "ECBC 2017 is nationally applicable. State adoption status varies."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # GURUGRAM — Haryana RERA / HRERA / Haryana Government
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "GGN-FAR-RES-001",
        "location": "Gurugram",
        "state": "Haryana",
        "authority": "Haryana Urban Development Authority (HUDA) / GMDA",
        "authority_website": "https://gmda.gov.in",
        "regulation_name": "FAR — Residential (Gurugram)",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Individual Residential", "Apartment"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "FAR for residential plots in Gurugram depends on plot area and licence type.",
        "required_value": 1.75,
        "unit": "ratio",
        "conditions": "Typical FAR of 1.75 for independent plots. Group housing colony licences may have different FAR. Verify with DGTCP Haryana.",
        "exceptions": "Plotted colonies, group housing, and mixed-use have different FAR. Also varies by sector.",
        "effective_date": "2017-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "DGTCP Haryana Building Code / GMDA Regulations",
        "official_source_url": "https://tcpharyana.gov.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "Haryana's FAR is complex and project-specific. Must be confirmed with DGTCP or GMDA."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # MUMBAI — Municipal Corporation of Greater Mumbai (MCGM / BMC)
    # Source: Maharashtra Regional and Town Planning Act / DCR 2034
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "MUM-FSI-RES-001",
        "location": "Mumbai",
        "state": "Maharashtra",
        "authority": "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
        "authority_website": "https://mcgm.gov.in",
        "regulation_name": "Floor Space Index (FSI) — Residential Island City",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Apartment"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "Base FSI for residential plots in Mumbai Island City (MCGM jurisdiction) as per DCR 2034.",
        "required_value": 1.33,
        "unit": "ratio (base FSI)",
        "conditions": "Base FSI 1.33 for Island City. Suburbs: 1.0 base. Fungible FSI available on payment. Road-width premiums apply.",
        "exceptions": "Transit-oriented development zones, redevelopment projects (33/7), cluster development, and slum rehabilitation have different FSI.",
        "effective_date": "2018-09-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "Development Control & Promotion Regulations 2034 — MCGM",
        "official_source_url": "https://mcgm.gov.in/irj/portal/anonymous?NavigationTarget=navurl://f60fc55c2c9ce44e80c7a2a1e8945c8f",
        "verification_status": "VERIFIED",
        "confidence": "HIGH",
        "notes": "DCPR 2034 is the applicable regulation. Fungible FSI significantly increases permissible built-up area."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # BENGALURU — BBMP / BDA
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "BLR-FAR-RES-001",
        "location": "Bengaluru",
        "state": "Karnataka",
        "authority": "Bruhat Bengaluru Mahanagara Palike (BBMP) / Bangalore Development Authority (BDA)",
        "authority_website": "https://bbmp.gov.in",
        "regulation_name": "FAR — Residential (Bengaluru)",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Apartment"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "FAR for residential plots in Bengaluru (BBMP jurisdiction) depends on plot area and road width.",
        "required_value": 2.25,
        "unit": "ratio",
        "conditions": "FAR of 2.25 for residential plots with road width ≥12m and plot area >400 m². Smaller plots or narrower roads may have lower FAR.",
        "exceptions": "Revised Master Plan 2031 zones may have different FAR.",
        "effective_date": "2015-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "BBMP Building Bylaws 2020 / Revised Master Plan 2031",
        "official_source_url": "https://bbmp.gov.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "BBMP bylaws are complex. Verify with BBMP ward office or BDA for specific plot."
    },

    # ─────────────────────────────────────────────────────────────────────────
    # CHANDIGARH — Chandigarh Administration / GMADA
    # ─────────────────────────────────────────────────────────────────────────

    {
        "id": "CHD-FAR-RES-001",
        "location": "Chandigarh",
        "state": "Punjab",
        "authority": "Chandigarh Administration / Estate Office",
        "authority_website": "https://chandigarh.gov.in",
        "regulation_name": "FAR — Residential (Chandigarh)",
        "regulation_category": "FAR / FSI",
        "building_type": ["Residential", "Individual Residential"],
        "land_use_category": "Residential",
        "plot_category": "Residential",
        "plot_size_range_m2": {"min": 0, "max": 9999999},
        "road_width_condition": "Any",
        "rule_description": "FAR for residential plots in Chandigarh planned sectors.",
        "required_value": 1.75,
        "unit": "ratio",
        "conditions": "FAR varies by sector type and plot category. Chandigarh has strict heritage zone restrictions.",
        "exceptions": "Heritage zones and conservation areas have stricter norms.",
        "effective_date": "2017-01-01",
        "last_verified_date": "2024-01-01",
        "official_source_name": "Chandigarh Administration Building Rules",
        "official_source_url": "https://chandigarh.gov.in",
        "verification_status": "REQUIRES_CONFIRMATION",
        "confidence": "MEDIUM",
        "notes": "Chandigarh's planned city regulations are strict. Verify with Estate Office."
    },
]


def get_regulations_for_location(location: str, building_type: str = None) -> List[Dict[str, Any]]:
    """
    Returns a filtered list of regulations applicable to a given location and building type.
    Also returns nationally applicable regulations (location == "ALL").
    """
    results = []
    location_lower = location.lower().strip()
    for reg in REGULATORY_DATABASE:
        reg_loc = reg["location"].lower()
        if reg_loc == "all" or reg_loc == location_lower:
            if building_type is None:
                results.append(reg)
            else:
                bt_list = [b.lower() for b in reg.get("building_type", [])]
                if "all" in bt_list or building_type.lower() in bt_list:
                    results.append(reg)
    return results


def get_authority_for_location(location: str) -> Dict[str, str]:
    """
    Returns the primary authority for a given city location.
    Returns 'REQUIRES_USER_CONFIRMATION' if multiple or unknown.
    """
    AUTHORITY_MAP = {
        "noida": {
            "authority": "New Okhla Industrial Development Authority (NOIDA Authority)",
            "website": "https://noidaauthorityonline.in",
            "state": "Uttar Pradesh",
            "confidence": "HIGH"
        },
        "greater noida": {
            "authority": "Greater Noida Industrial Development Authority (GNIDA)",
            "website": "https://www.greaternoidaauthority.in",
            "state": "Uttar Pradesh",
            "confidence": "HIGH"
        },
        "ghaziabad": {
            "authority": "Ghaziabad Development Authority (GDA)",
            "website": "https://www.gdaonline.in",
            "state": "Uttar Pradesh",
            "confidence": "HIGH"
        },
        "delhi": {
            "authority": "Delhi Development Authority (DDA) / Municipal Corporation of Delhi (MCD)",
            "website": "https://dda.gov.in",
            "state": "Delhi",
            "confidence": "HIGH"
        },
        "new delhi": {
            "authority": "New Delhi Municipal Council (NDMC) / DDA",
            "website": "https://ndmc.gov.in",
            "state": "Delhi",
            "confidence": "HIGH"
        },
        "delhi ncr": {
            "authority": "NCR Planning Board / DDA / NOIDA / GMDA (Requires user confirmation)",
            "website": "http://ncrpb.nic.in",
            "state": "Delhi / Haryana / UP",
            "confidence": "MEDIUM"
        },
        "gurugram": {
            "authority": "Gurugram Metropolitan Development Authority (GMDA) / DTCP Haryana",
            "website": "https://gmda.gov.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "bahadurgarh": {
            "authority": "Municipal Council Bahadurgarh / HSVP Haryana",
            "website": "https://hsvp.org.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "sonipat": {
            "authority": "Municipal Corporation Sonipat / HSVP Haryana",
            "website": "https://hsvp.org.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "panipat": {
            "authority": "Municipal Corporation Panipat / HSVP Haryana",
            "website": "https://hsvp.org.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "rohtak": {
            "authority": "Municipal Corporation Rohtak / HSVP Haryana",
            "website": "https://hsvp.org.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "manesar": {
            "authority": "HSIIDC / Municipal Corporation Manesar / GMDA",
            "website": "https://hsiidc.org.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "gurgaon": {
            "authority": "Gurugram Metropolitan Development Authority (GMDA) / DTCP Haryana",
            "website": "https://gmda.gov.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "faridabad": {
            "authority": "Faridabad Municipal Corporation / DTCP Haryana",
            "website": "https://tcpharyana.gov.in",
            "state": "Haryana",
            "confidence": "HIGH"
        },
        "mumbai": {
            "authority": "Municipal Corporation of Greater Mumbai (MCGM / BMC)",
            "website": "https://mcgm.gov.in",
            "state": "Maharashtra",
            "confidence": "HIGH"
        },
        "pune": {
            "authority": "Pune Municipal Corporation (PMC) / Pimpri-Chinchwad MC (PCMC)",
            "website": "https://pmc.gov.in",
            "state": "Maharashtra",
            "confidence": "HIGH"
        },
        "bengaluru": {
            "authority": "Bruhat Bengaluru Mahanagara Palike (BBMP) / BDA",
            "website": "https://bbmp.gov.in",
            "state": "Karnataka",
            "confidence": "HIGH"
        },
        "bangalore": {
            "authority": "Bruhat Bengaluru Mahanagara Palike (BBMP) / BDA",
            "website": "https://bbmp.gov.in",
            "state": "Karnataka",
            "confidence": "HIGH"
        },
        "chennai": {
            "authority": "Chennai Metropolitan Development Authority (CMDA) / Greater Chennai Corporation",
            "website": "https://cmdachennai.gov.in",
            "state": "Tamil Nadu",
            "confidence": "HIGH"
        },
        "hyderabad": {
            "authority": "Hyderabad Metropolitan Development Authority (HMDA) / GHMC",
            "website": "https://hmda.gov.in",
            "state": "Telangana",
            "confidence": "HIGH"
        },
        "kolkata": {
            "authority": "Kolkata Municipal Corporation (KMC) / KMDA",
            "website": "https://www.kmcgov.in",
            "state": "West Bengal",
            "confidence": "HIGH"
        },
        "ahmedabad": {
            "authority": "Ahmedabad Municipal Corporation (AMC) / AUDA",
            "website": "https://ahmedabadcity.gov.in",
            "state": "Gujarat",
            "confidence": "HIGH"
        },
        "surat": {
            "authority": "Surat Municipal Corporation (SMC) / SUDA",
            "website": "https://www.suratmunicipal.gov.in",
            "state": "Gujarat",
            "confidence": "HIGH"
        },
        "jaipur": {
            "authority": "Jaipur Development Authority (JDA) / Jaipur Municipal Corporation",
            "website": "https://jda.urban.rajasthan.gov.in",
            "state": "Rajasthan",
            "confidence": "HIGH"
        },
        "lucknow": {
            "authority": "Lucknow Development Authority (LDA) / Lucknow Municipal Corporation",
            "website": "https://lda.up.nic.in",
            "state": "Uttar Pradesh",
            "confidence": "HIGH"
        },
        "chandigarh": {
            "authority": "Chandigarh Administration — Estate Office",
            "website": "https://chandigarh.gov.in",
            "state": "Chandigarh",
            "confidence": "HIGH"
        },
        "kochi": {
            "authority": "Greater Cochin Development Authority (GCDA) / Kochi Corporation",
            "website": "https://gcda.kerala.gov.in",
            "state": "Kerala",
            "confidence": "HIGH"
        },
        "bhopal": {
            "authority": "Bhopal Municipal Corporation / Bhopal Development Authority",
            "website": "https://bmcbhopal.com",
            "state": "Madhya Pradesh",
            "confidence": "HIGH"
        },
        "indore": {
            "authority": "Indore Municipal Corporation / IDA",
            "website": "https://www.imcindore.org",
            "state": "Madhya Pradesh",
            "confidence": "HIGH"
        },
        "bhubaneswar": {
            "authority": "Bhubaneswar Development Authority (BDA) / Bhubaneswar Municipal Corporation",
            "website": "https://bda.gov.in",
            "state": "Odisha",
            "confidence": "HIGH"
        },
        "nagpur": {
            "authority": "Nagpur Municipal Corporation (NMC) / NMRDA",
            "website": "https://nagpuronline.com",
            "state": "Maharashtra",
            "confidence": "HIGH"
        },
        "dehradun": {
            "authority": "Dehradun Municipal Corporation / Mussoorie Dehradun Development Authority (MDDA)",
            "website": "https://mdda.uk.gov.in",
            "state": "Uttarakhand",
            "confidence": "HIGH"
        },
        "shimla": {
            "authority": "Shimla Municipal Corporation / TCP Himachal Pradesh",
            "website": "https://tcp.hp.gov.in",
            "state": "Himachal Pradesh",
            "confidence": "HIGH"
        },
        "amritsar": {
            "authority": "Amritsar Municipal Corporation / PUDA",
            "website": "https://puda.gov.in",
            "state": "Punjab",
            "confidence": "HIGH"
        },
        "patna": {
            "authority": "Patna Municipal Corporation / Patna Regional Development Authority (PRDA)",
            "website": "https://prda.bih.nic.in",
            "state": "Bihar",
            "confidence": "HIGH"
        },
        "ranchi": {
            "authority": "Ranchi Municipal Corporation / RUDA",
            "website": "https://ranchi.nic.in",
            "state": "Jharkhand",
            "confidence": "MEDIUM"
        },
        "guwahati": {
            "authority": "Guwahati Metropolitan Development Authority (GMDA)",
            "website": "https://gmda.assam.gov.in",
            "state": "Assam",
            "confidence": "HIGH"
        },
    }

    loc = location.lower().strip()
    if loc in AUTHORITY_MAP:
        return AUTHORITY_MAP[loc]
    return {
        "authority": "Authority Requires User Confirmation",
        "website": "",
        "state": "Unknown",
        "confidence": "LOW",
        "message": f"Could not identify a single authoritative body for '{location}'. Please specify the development authority or municipal body."
    }
