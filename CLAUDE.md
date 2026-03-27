# Project: Blender + Three.js Portfolio Viewer

## Overview
Interactive 3D model viewer / portfolio carousel built with React + Three.js (react-three-fiber).
Supports GIF/PNG export with quality, resolution, FPS, and duration controls.

## Key directories
- `Web/three-template/src/` — React/TypeScript app
  - `components/slides/` — per-model slides (ThreeSlide, OesySlide); each wires up state + hooks
  - `components/scenes/` — Three.js Canvas wrappers (ThreeScene, OesyScene) + SceneControls panel
  - `components/models/` — r3f mesh components (ThreeModel, OesyModel)
  - `utils/useGifExport.ts` — GIF capture + encoding hook (gifenc, custom Floyd-Steinberg dither)
  - `context/PanelContext.tsx` — enforces single open panel at a time
- `Blender/` — source .blend files for the models

## Stack
- React 18, TypeScript, Vite
- @react-three/fiber + @react-three/drei
- gsap (panel animations)
- react-colorful (inline color picker)
- gifenc (GIF encoding)
- Tailwind CSS (utility classes)

## GIF export pipeline
1. `useGifExport` captures frames from the WebGL canvas at the chosen FPS for `duration` seconds
2. Builds a global palette (via `quantize`) sampled from `sampleEvery`-th frame
3. Encodes with optional Floyd-Steinberg dithering (high quality only)
4. Yields to browser every 6 frames to avoid UI freeze (`YIELD_EVERY = 6`)

## Dev
```bash
cd Web/three-template
npm install
npm run dev
```

## Conventions
- Each slide owns its own state (bgColor, material, GIF settings) — no global store
- `SceneControls` receives all GIF settings as controlled props — always pass ALL of them (quality, resolution, fps, duration, transparent)
- `PanelContext` prevents multiple panels from being open simultaneously
