import sqlite3
import json
import uuid
import datetime
from typing import List, Dict, Any, Optional

DB_PATH = "ecobuild.db"

def init_sqlite_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            project_name TEXT NOT NULL,
            city TEXT NOT NULL,
            building_type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            overall_eco_score REAL NOT NULL,
            eui_kwh_m2_yr REAL NOT NULL,
            annual_co2_tons REAL NOT NULL,
            input_json TEXT NOT NULL,
            result_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_project_to_db(input_data: Dict[str, Any], result_data: Dict[str, Any], project_id: Optional[str] = None) -> str:
    init_sqlite_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    now_str = datetime.datetime.utcnow().isoformat()
    if not project_id:
        project_id = f"proj_{uuid.uuid4().hex[:10]}"
        created_at = now_str
    else:
        cursor.execute("SELECT created_at FROM projects WHERE id = ?", (project_id,))
        row = cursor.fetchone()
        created_at = row[0] if row else now_str

    project_name = input_data.get("project", {}).get("project_name", "Eco Residence")
    city = input_data.get("project", {}).get("location", "Delhi")
    building_type = input_data.get("project", {}).get("building_type", "Residential")
    
    eco_score = result_data.get("eco_scores", {}).get("overall_eco_score", 0.0)
    eui = result_data.get("energy", {}).get("energy_use_intensity_eui", 0.0)
    co2 = result_data.get("carbon", {}).get("operational_co2_annual_tons", 0.0)

    cursor.execute("""
        INSERT OR REPLACE INTO projects (
            id, project_name, city, building_type, created_at, updated_at,
            overall_eco_score, eui_kwh_m2_yr, annual_co2_tons, input_json, result_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        project_id, project_name, city, building_type, created_at, now_str,
        eco_score, eui, co2, json.dumps(input_data), json.dumps(result_data)
    ))
    conn.commit()
    conn.close()
    return project_id

def get_all_projects_from_db() -> List[Dict[str, Any]]:
    init_sqlite_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, project_name, city, building_type, created_at, updated_at, overall_eco_score, eui_kwh_m2_yr, annual_co2_tons, input_json, result_json FROM projects ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "project_name": r[1],
            "city": r[2],
            "building_type": r[3],
            "created_at": r[4],
            "updated_at": r[5],
            "overall_eco_score": r[6],
            "eui_kwh_m2_yr": r[7],
            "annual_co2_tons": r[8],
            "input_data": json.loads(r[9]),
            "analysis_result": json.loads(r[10])
        })
    return result

def get_project_by_id_from_db(project_id: str) -> Optional[Dict[str, Any]]:
    init_sqlite_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, project_name, city, building_type, created_at, updated_at, overall_eco_score, eui_kwh_m2_yr, annual_co2_tons, input_json, result_json FROM projects WHERE id = ?", (project_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None
    return {
        "id": row[0],
        "project_name": row[1],
        "city": row[2],
        "building_type": row[3],
        "created_at": row[4],
        "updated_at": row[5],
        "overall_eco_score": row[6],
        "eui_kwh_m2_yr": row[7],
        "annual_co2_tons": row[8],
        "input_data": json.loads(row[9]),
        "analysis_result": json.loads(row[10])
    }

def delete_project_from_db(project_id: str) -> bool:
    init_sqlite_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0
