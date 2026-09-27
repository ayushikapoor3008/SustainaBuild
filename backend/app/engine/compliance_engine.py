"""
compliance_engine.py — Legal & Preliminary Building Compliance Engine
SustainaBuild AI — Powered by EcoBuild AI

This engine evaluates user-entered building parameters against verified regulatory data.
Status values:
  PASS          — Proposed value satisfies the verified rule
  WARNING       — Proposed value may not satisfy the rule, or data is incomplete
  NOT_VERIFIED  — No reliable official source found; no determination made

DISCLAIMER: This is a preliminary planning tool. Results are NOT legal approvals,
sanctioned plans, or substitutes for verification by the relevant authority.
"""

from typing import List, Dict, Any, Optional
from app.data.regulatory_db import get_regulations_for_location, get_authority_for_location


def _compliance_status(proposed, required, rule_type: str, verification_status: str) -> str:
    """Determine PASS / WARNING / NOT_VERIFIED status."""
    if verification_status == "NOT_VERIFIED":
        return "NOT_VERIFIED"
    if proposed is None:
        return "WARNING"
    if rule_type == "max":
        if proposed <= required:
            return "PASS" if verification_status == "VERIFIED" else "WARNING"
        return "WARNING"
    elif rule_type == "min":
        if proposed >= required:
            return "PASS" if verification_status == "VERIFIED" else "WARNING"
        return "WARNING"
    elif rule_type == "threshold":
        return "WARNING"
    return "NOT_VERIFIED"


def calculate_compliance(
    location: str,
    building_type: str,
    plot_area_m2: float,
    built_up_area_m2: float,
    num_floors: int,
    building_height_m: float,
    road_width_m: float,
    ground_coverage_pct: float,
    proposed_green_pct: float,
    parking_ecs: Optional[float] = None,
    dwelling_units: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Returns a structured compliance report for the given building parameters.
    """
    authority_info = get_authority_for_location(location)
    regulations = get_regulations_for_location(location, building_type)

    results = []

    for reg in regulations:
        cat = reg["regulation_category"]
        req_val = reg["required_value"]
        verif = reg["verification_status"]
        unit = reg["unit"]
        proposed_val = None
        status = "NOT_VERIFIED"
        proposed_label = "Not provided"
        difference = None

        # ── FAR / FSI ───────────────────────────────────────────────────────
        if cat == "FAR / FSI":
            if plot_area_m2 > 0:
                proposed_far = round(built_up_area_m2 / plot_area_m2, 2)
                proposed_val = proposed_far
                proposed_label = f"{proposed_far:.2f}"
                difference = round(req_val - proposed_far, 2)
                status = _compliance_status(proposed_far, req_val, "max", verif)
            else:
                status = "WARNING"
                proposed_label = "Plot area not provided"

        # ── Ground Coverage ──────────────────────────────────────────────────
        elif cat == "Ground Coverage":
            proposed_val = ground_coverage_pct
            proposed_label = f"{ground_coverage_pct:.1f}%"
            difference = round(req_val - ground_coverage_pct, 1)
            status = _compliance_status(ground_coverage_pct, req_val, "max", verif)

        # ── Green / Open Space ───────────────────────────────────────────────
        elif cat == "Green / Open Space":
            proposed_val = proposed_green_pct
            proposed_label = f"{proposed_green_pct:.1f}%"
            required_green_m2 = round(plot_area_m2 * req_val / 100, 1)
            proposed_green_m2 = round(plot_area_m2 * proposed_green_pct / 100, 1)
            difference = round(proposed_green_m2 - required_green_m2, 1)
            status = _compliance_status(proposed_green_pct, req_val, "min", verif)
            results.append({
                "regulation_id": reg["id"],
                "regulation_name": reg["regulation_name"],
                "category": cat,
                "authority": reg["authority"],
                "required_value": req_val,
                "required_label": f"{req_val}% of plot = {required_green_m2} m²",
                "proposed_value": proposed_val,
                "proposed_label": f"{proposed_green_pct:.1f}% = {proposed_green_m2} m²",
                "required_green_m2": required_green_m2,
                "proposed_green_m2": proposed_green_m2,
                "difference_m2": difference,
                "unit": unit,
                "status": status,
                "conditions": reg.get("conditions", ""),
                "exceptions": reg.get("exceptions", ""),
                "official_source_name": reg.get("official_source_name", ""),
                "official_source_url": reg.get("official_source_url", ""),
                "last_verified_date": reg.get("last_verified_date", ""),
                "verification_status": verif,
                "confidence": reg.get("confidence", "MEDIUM"),
                "notes": reg.get("notes", ""),
            })
            continue

        # ── Building Height ──────────────────────────────────────────────────
        elif cat == "Building Height":
            proposed_val = building_height_m
            proposed_label = f"{building_height_m:.1f} m"
            difference = round(req_val - building_height_m, 1)
            status = _compliance_status(building_height_m, req_val, "max", verif)

        # ── Fire Safety ──────────────────────────────────────────────────────
        elif cat == "Fire Safety":
            is_high_rise = building_height_m > req_val
            proposed_label = f"Height {building_height_m:.1f} m — {'HIGH-RISE: Fire NOC Required' if is_high_rise else 'Not High-Rise'}"
            status = "WARNING" if is_high_rise else "PASS"
            proposed_val = building_height_m

        # ── Parking ──────────────────────────────────────────────────────────
        elif cat == "Parking":
            if dwelling_units is not None and parking_ecs is not None:
                required_ecs = req_val * dwelling_units
                proposed_label = f"{parking_ecs} ECS provided vs {required_ecs:.0f} required"
                proposed_val = parking_ecs
                difference = round(parking_ecs - required_ecs, 1)
                status = _compliance_status(parking_ecs, required_ecs, "min", verif)
            else:
                status = "WARNING"
                proposed_label = "Dwelling unit count or parking count not provided"

        # ── Water Supply ─────────────────────────────────────────────────────
        elif cat == "Water Supply":
            status = "NOT_VERIFIED"
            proposed_label = "Refer to NBC standard"

        # ── Energy Efficiency ────────────────────────────────────────────────
        elif cat == "Energy Efficiency":
            status = "NOT_VERIFIED"
            proposed_label = "ECBC compliance requires detailed calculation"

        else:
            status = "NOT_VERIFIED"
            proposed_label = "Requires manual review"

        results.append({
            "regulation_id": reg["id"],
            "regulation_name": reg["regulation_name"],
            "category": cat,
            "authority": reg["authority"],
            "required_value": req_val,
            "required_label": f"{req_val} {unit}",
            "proposed_value": proposed_val,
            "proposed_label": proposed_label,
            "difference": difference,
            "unit": unit,
            "status": status,
            "conditions": reg.get("conditions", ""),
            "exceptions": reg.get("exceptions", ""),
            "official_source_name": reg.get("official_source_name", ""),
            "official_source_url": reg.get("official_source_url", ""),
            "last_verified_date": reg.get("last_verified_date", ""),
            "verification_status": verif,
            "confidence": reg.get("confidence", "MEDIUM"),
            "notes": reg.get("notes", ""),
        })

    # Summary counts
    pass_count = sum(1 for r in results if r["status"] == "PASS")
    warning_count = sum(1 for r in results if r["status"] == "WARNING")
    not_verified_count = sum(1 for r in results if r["status"] == "NOT_VERIFIED")

    return {
        "location": location,
        "authority": authority_info.get("authority", "Unknown"),
        "authority_website": authority_info.get("website", ""),
        "authority_confidence": authority_info.get("confidence", "LOW"),
        "building_type": building_type,
        "plot_area_m2": plot_area_m2,
        "built_up_area_m2": built_up_area_m2,
        "num_floors": num_floors,
        "building_height_m": building_height_m,
        "road_width_m": road_width_m,
        "regulations_checked": len(results),
        "pass_count": pass_count,
        "warning_count": warning_count,
        "not_verified_count": not_verified_count,
        "results": results,
        "disclaimer": (
            "This is a preliminary compliance assessment for planning and educational purposes only. "
            "It is NOT a legal approval, sanctioned building plan, or substitute for verification "
            "by the relevant authority or a licensed professional. "
            "Always verify with the applicable development authority before commencing construction."
        ),
        "data_quality_note": (
            "Regulatory data is sourced from official publications where available. "
            "Entries marked REQUIRES_CONFIRMATION or NOT_VERIFIED must be verified with the authority. "
            "Rules change frequently; always check for the latest notifications."
        )
    }
