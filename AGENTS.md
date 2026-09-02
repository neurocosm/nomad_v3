# NOMAD Project Directives & Guidelines

## Core Operating Discipline: One Step at a Time
1. **Single-Step Execution**: Address one feature or fix at a time. Test and verify completely before touching secondary systems.
2. **Never Stack Unverified Edits**: Always validate vector map layers, styles, and kinetic engine canvases against strict runtime specifications.
3. **Triple-Check Work**: Verify styles for missing or mismatched paint properties (e.g. `fill-color` on lines, `line-color` on symbols, `background-color` on rasters) before deploying.
4. **Preserve PWA & Navigation Foundations**: Core HUD navigation, speed signs, compass, and vector map viewports must always remain responsive and functional.

---

## Active Evening Projects & Roadmap Registry

### Project 1: Navigation Vector Maps & Street Typography [COMPLETED]
- **Status**: Completed & Verified.
- **Achievements**:
  - OpenFreeMap vector style rendering with strict zero-error layer validation.
  - Large, high-visibility street names (`text-size` up to 17–20pt with 2.5px bold contrast halos).
  - Clean daylight (crisp white pavement, sky-blue water, spring mint parks) and midnight dark (deep charcoal pavement, luminous cyan waterways, pine emerald green).

### Project 2: Savannah Wildlife Console (Animal Direction & Scale) [COMPLETED]
- **Status**: Completed & Verified.
- **Achievements**:
  - Inverted Z-axis so wildlife runs away from the vehicle towards the vanishing horizon rim.
  - Enlarged scale (~35% larger) and added anatomical silhouettes (shaggy coats, branching elk racks, curl horns, markings, forked tongues).
  - Staggered queue pool: 2–3 active animals at once, smoothly respawning new random species from the full 7-animal roster.

### Project 3: Synthomatic Circuit Board Sensor Coupling [COMPLETED]
- **Status**: Completed & Verified.
- **Achievements**:
  - Multi-layer physical parallax depth engine: Substrate (Z = -0.35), Copper traces & Solder vias (Z = 0.0), SMT Hardware ICs (Z = +0.55), and Floating Cyber Orbit HUD Bezel (Z = +1.15).
  - Sensor coupling with device accelerometer/gyroscope tilt (`deviceorientation` gamma roll & beta pitch, `devicemotion` gravity) and desktop mouse/touch hover tilt.
  - Realistic metallic specular glint on 36 gold-plated annular through-hole solder vias shifting dynamically with light reflection angles.
  - SMT hardware package models: Central QFP-32 DSP chip (`SYNTH-DSP 8800`), SOIC-8 EEPROM, brushed aluminum quartz oscillator (16 MHz), DPAK regulator, choke coil, bulk capacitor, and 0805 passives with drop shadows.
  - GPS speed and acceleration current pulses: conductive packets accelerate along 45° traces, surging during acceleration and dissipating reverse energy into bulk reservoir during regenerative braking.

### Project 4: Cracker Jack Tilt Maze Fidget Console [NEXT - STEP 4]
- **Status**: Queued.
- **Goals**:
  - Vintage pocket prize labyrinth with physics-driven chrome ball bearing.
  - Responsive device orientation / gyro tilt rolling with haptic wall feedback.
  - Added to kinetic console fidget cycle.
