import cadquery as cq

# 1. Load the 3D STEP file
model = cq.importers.importStep('public/SIH_Sample_Building.step')

# 2. Create a 2D horizontal slice at Z = 1.5 meters
floor_plan_2d = cq.Workplane("XY").workplane(offset=1.5).add(model).section()

# 3. Export to SVG vector format
cq.exporters.export(floor_plan_2d, 'public/SIH_Sample_Building_2D.svg')

print("Successfully exported 2D floor plan to public/SIH_Sample_Building_2D.svg!")