"""
waste_engine.py — Waste & Circular Resource Management Engine
SustainaBuild AI — Powered by EcoBuild AI

Calculates:
- Daily waste generation by category
- Composting potential and production
- Recycling potential and diversion
- Waste circularity metrics
Per-capita figures based on CPHEEO Manual on Solid Waste Management, India.
"""

from typing import Dict, Any


def calculate_waste(
    num_occupants: int,
    building_type: str = "Residential",
    composting_enabled: bool = True,
    recycling_enabled: bool = True,
    green_area_m2: float = 0.0,
) -> Dict[str, Any]:
    """
    Returns waste generation breakdown and circularity metrics.
    All values are engineering estimates based on Indian standards.
    """

    # ── Per-capita waste rates (kg/person/day) ───────────────────────────────
    # Source: CPHEEO Manual on Solid Waste Management, 2016
    WASTE_RATES = {
        "Residential":    {"organic": 0.22, "dry": 0.15, "residual": 0.13},
        "Commercial":     {"organic": 0.18, "dry": 0.25, "residual": 0.17},
        "Office":         {"organic": 0.10, "dry": 0.20, "residual": 0.10},
        "School":         {"organic": 0.12, "dry": 0.18, "residual": 0.10},
        "Hospital":       {"organic": 0.15, "dry": 0.20, "residual": 0.25},
        "Mixed-use":      {"organic": 0.20, "dry": 0.20, "residual": 0.15},
    }

    rates = WASTE_RATES.get(building_type, WASTE_RATES["Residential"])
    n = num_occupants

    # Daily waste per category (kg/day)
    organic_kg_day = round(rates["organic"] * n, 2)
    dry_kg_day = round(rates["dry"] * n, 2)
    residual_kg_day = round(rates["residual"] * n, 2)
    total_kg_day = round(organic_kg_day + dry_kg_day + residual_kg_day, 2)

    # Annual
    organic_kg_year = round(organic_kg_day * 365, 0)
    dry_kg_year = round(dry_kg_day * 365, 0)
    residual_kg_year = round(residual_kg_day * 365, 0)
    total_kg_year = round(total_kg_day * 365, 0)

    # ── Composting ──────────────────────────────────────────────────────────
    compost_conversion = 0.30  # ~30% weight reduction in compost production
    compost_production_kg_year = round(organic_kg_year * compost_conversion, 0) if composting_enabled else 0.0
    landscape_coverage_kg = round(green_area_m2 * 2.0, 0)  # ~2 kg compost needed per m² per year

    # ── Recycling ───────────────────────────────────────────────────────────
    dry_recyclable_pct = 0.70  # 70% of dry waste is recyclable
    recycled_kg_year = round(dry_kg_year * dry_recyclable_pct, 0) if recycling_enabled else 0.0

    # ── Diversion Rate ──────────────────────────────────────────────────────
    # Waste diverted = composted + recycled, out of total
    diverted_kg_year = (compost_production_kg_year / compost_conversion if composting_enabled else 0.0) + recycled_kg_year
    diverted_kg_year = min(diverted_kg_year, total_kg_year)
    waste_diversion_pct = round(diverted_kg_year / max(total_kg_year, 1) * 100, 1)

    residual_after_diversion_kg_year = round(total_kg_year - diverted_kg_year, 0)

    # Circularity score (0–100)
    diversion_score = min(50.0, waste_diversion_pct * 0.5)
    compost_score = min(30.0, (compost_production_kg_year / max(organic_kg_year, 1) * 100) * 0.3) if composting_enabled else 0.0
    recycle_score = min(20.0, (recycled_kg_year / max(dry_kg_year, 1) * 100) * 0.2) if recycling_enabled else 0.0
    waste_circularity_score = round(diversion_score + compost_score + recycle_score, 1)

    return {
        # Generation
        "num_occupants": n,
        "building_type": building_type,
        "total_waste_kg_day": total_kg_day,
        "organic_waste_kg_day": organic_kg_day,
        "dry_recyclable_kg_day": dry_kg_day,
        "residual_waste_kg_day": residual_kg_day,
        "total_waste_kg_year": total_kg_year,
        "organic_waste_kg_year": organic_kg_year,
        "dry_recyclable_kg_year": dry_kg_year,
        "residual_waste_kg_year": residual_kg_year,
        # Composting
        "composting_enabled": composting_enabled,
        "compost_production_kg_year": compost_production_kg_year,
        "landscape_compost_coverage_m2": round(compost_production_kg_year / max(landscape_coverage_kg / max(green_area_m2, 1), 1), 0) if green_area_m2 > 0 and composting_enabled else 0.0,
        # Recycling
        "recycling_enabled": recycling_enabled,
        "recycled_kg_year": recycled_kg_year,
        "recyclable_fraction_pct": dry_recyclable_pct * 100,
        # Diversion
        "waste_diversion_pct": waste_diversion_pct,
        "diverted_kg_year": round(diverted_kg_year, 0),
        "residual_to_landfill_kg_year": residual_after_diversion_kg_year,
        # Score
        "waste_circularity_score": waste_circularity_score,
        "recommendations": [
            "Segregate waste at source into 3 bins: Organic (Green), Dry Recyclables (Blue), Residual (Red).",
            "Compost organic waste on-site using a bin composter — saves disposal costs and enriches landscape soil.",
            "Tie up with certified recyclers for dry waste (paper, plastic, metal, e-waste).",
            "Organic waste processors (OWC) recommended for group housing with >50 households.",
            "Reduce residual waste by avoiding single-use plastics in material procurement.",
            "Consider biogas digester for large residential complexes (>100 households) to generate cooking gas from food waste.",
        ],
        "assumptions": [
            "Per-capita waste rates from CPHEEO Manual on Solid Waste Management 2016",
            f"Organic: {rates['organic']} kg/person/day, Dry: {rates['dry']} kg/person/day, Residual: {rates['residual']} kg/person/day",
            "Compost conversion: 30% weight (rest is moisture/gases lost during process)",
            "Dry waste recyclability: 70% of dry waste stream",
            "All values are estimates; actual waste depends on occupant behaviour and income level.",
        ],
        "data_quality": "ESTIMATED — Based on CPHEEO national averages. Actual waste may vary significantly."
    }
