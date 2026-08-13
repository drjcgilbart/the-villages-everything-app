# Art Asset Pipeline — Golf Cart Hero

Photoreal albedo texture packs generated for Three.js materials.

## Packs (v1)

| Pack | Contents |
|------|----------|
| **Terrain** | asphalt, grass, fairway, sidewalk, water, curb |
| **Houses** | cream stucco, terracotta roof, wood door, glass |
| **Palms** | bark, frond foliage |
| **Carts** | Yamaha green paint, Evolution cyan, Hot Rod red |

## Paths

All files live under `public/assets/textures/...` and are served at `/assets/textures/...`.

See `manifest.json` for the full key map.

## How the game uses them

1. `src/game/assets/loader.ts` loads textures with `THREE.TextureLoader`
2. Builds `MeshStandardMaterial` maps (repeat-wrapping for tiles)
3. `World3D` applies materials to roads, lawns, homes, palms, carts

## Regenerating / extending

1. Generate new seamless tileable albedo maps (or hand-paint)
2. Drop into the matching folder with the same filename
3. Hard-refresh the game — no rebuild of models required for texture swaps

## Next pipeline steps

- Normal / roughness maps (PBR pack)
- GLB cart / house / palm models from Blender
- Atlas LODs for mobile
