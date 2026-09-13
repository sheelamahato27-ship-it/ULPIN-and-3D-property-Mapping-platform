import cadquery as cq

# 1. Load the STEP file from the public folder
model = cq.importers.importStep('public/SIH_Sample_Building.step')

# 2. Wrap in an Assembly (required for GLB/GLTF exports in CadQuery)
assy = cq.Assembly()
assy.add(model)

# 3. Save directly as GLB into the public folder
assy.save('public/SIH_Sample_Building.glb')

print("Successfully converted STEP to GLB in public/SIH_Sample_Building.glb!")