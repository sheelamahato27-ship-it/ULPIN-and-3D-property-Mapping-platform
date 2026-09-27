import os
import re
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="3D-ULPIN Cadastre In-Memory Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dynamically locate the CSV file in the same directory as server.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "3D ULPIN.csv")

# In-Memory Cache Maps
REGISTRY: dict = {}
ALL_RECORDS: list = []

def load_data():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found at: {CSV_PATH}")
        
    df = pd.read_csv(CSV_PATH)
    
    # Calculate statutory UDS % dynamically
    private_df = df[df["property_type"].str.contains("Private", case=False, na=False)]
    total_private_area = private_df["area_sqm"].sum()

    floor_map = {"F00": "1", "F01": "2", "F02": "3", "F03": "4"}
    unit_map = {"U01": "unit02_1", "U02": "unit02_2", "U03": "unit03_1", "U04": "unit03_2"}

    for _, row in df.iterrows():
        is_private = "Private" in str(row["property_type"])
        uds = round((float(row["area_sqm"]) / total_private_area) * 100.0, 2) if is_private else 0.0

        item = {
            "ulpin_3d": str(row["3d_ulpin"]),
            "floor_code": str(row["floor_code"]),
            "unit_code": str(row["unit_code"]),
            "property_type": str(row["property_type"]),
            "z_min_m": float(row["z_min_m"]),
            "z_max_m": float(row["z_max_m"]),
            "area_sqm": float(row["area_sqm"]),
            "uds_percentage": uds,
        }
        ALL_RECORDS.append(item)

        # Generate lookup aliases matching GLTF node variations
        fl = str(row["floor_code"])
        un = str(row["unit_code"])
        aliases = [f"{fl}_{un}".lower(), f"{fl}-{un}".lower(), item["ulpin_3d"].lower()]

        if fl in floor_map:
            gf = floor_map[fl]
            if un in unit_map:
                u_cad = unit_map[un]
                aliases.extend([
                    f"ground_floor_{gf}_{u_cad}",
                    f"ground_floor:{gf}_{u_cad.replace('_', ':')}",
                    f"{u_cad}_{gf}",
                    f"{u_cad}"
                ])
            elif un == "COMM":
                for part in ["corridor_g", "elevator_2", "stairs"]:
                    aliases.extend([
                        f"ground_floor_{gf}_{part}",
                        f"ground_floor:{gf}_{part}",
                        f"{part}_{gf}"
                    ])

        if fl == "B01":
            aliases.extend(["basement_1", "basement:1", "basement", "b01_base"])
        if fl == "RF01":
            aliases.extend(["roof_1", "roof:1", "roof", "rf01_roof"])

        for a in aliases:
            REGISTRY[a] = item

load_data()

@app.get("/api/v1/cadastre/unit/{mesh_id}")
def inspect_unit(mesh_id: str):
    raw = mesh_id.strip().lower()
    clean = re.sub(r"[:\.\s\-]+", "_", raw)

    # 1. Exact match
    if clean in REGISTRY:
        return REGISTRY[clean]
    if raw in REGISTRY:
        return REGISTRY[raw]

    # 2. Substring search for nested CAD nodes
    for key, data in REGISTRY.items():
        if key in clean or clean in key:
            return data

    raise HTTPException(status_code=404, detail=f"No record for mesh: '{mesh_id}'")

@app.get("/api/v1/cadastre/all")
def get_all():
    return {"parent_2d_ulpin": "FC0DC4F96C9094", "parcels": ALL_RECORDS}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)