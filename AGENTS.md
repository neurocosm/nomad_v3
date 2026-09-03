# NOMAD Project Directives & Guidelines

## Core Operating Discipline: One Step at a Time
1. **Single-Step Execution**: Address one feature or fix at a time. Test and verify completely before touching secondary systems.
2. **Never Stack Unverified Edits**: Always validate vector map layers, styles, and kinetic engine canvases against strict runtime specifications.
3. **Triple-Check Work**: Verify styles for missing or mismatched paint properties (e.g. `fill-color` on lines, `line-color` on symbols, `background-color` on rasters) before deploying.
4. **Preserve PWA & Navigation Foundations**: Core HUD navigation, speed signs, compass, and vector map viewports must always remain responsive and functional.

---

## Active Evening Projects & Roadmap Registry

### Step 3: Vehicle Chevron & Galaga Fighter 3D Perspective Tilt [COMPLETED]
- **Status**: Completed & Verified.
- **Achievements**:
  - Pitch alignment in 3D Perspective Mode: Applied complementary 3D CSS transform (`perspective(600px) rotateX(42deg) rotate(...)`) to the center vehicle Chevron and Galaga fighter so they lie along the plane of the angled road (pitch: 58°).
  - Flat alignment in 2D Mode: Smooth reset to flat overhead rendering (`perspective(600px) rotateX(0deg)`) in 2D Overview Track and North-Up modes.
  - Seamless 0.35s cubic-bezier transform animation when transitioning camera modes or toggling Galaga fighter mode.

### Step 4: Vehicle Horn Audio (Chevron Horn & Galaga Laser) [COMPLETED]
- **Status**: Completed & Verified.
- **Achievements**:
  - Restored clean, standard Web Audio routing with zero echo or duplicate triggers.
  - Kept hardware A2DP link pre-warming and sub-audible keep-alive for zero-latency Bluetooth/system audio responsiveness.
  - Placed experimental silent-switch speaker redirection on future wishlist to ensure 100% stable single-trigger playback.

### Step 5: Synthomatic Console Redesign (Square Ratio & Declutter) [IN-PROGRESS / TESTING]
- **Status**: Implemented & Ready for User Testing.
- **Achievements**:
  - **1:1 Square Aspect Ratio**: Re-anchored the Synthomatic PCB canvas and coordinate space to `Math.min(w, h) * 0.90` so the board stays a crisp, non-distorted square centered inside the map viewport.
  - **Clean 3-Component Layout**: Stripped micro-component clutter down to the central hero `SYNTH-DSP 8800` chip flanked by 2 iconic secondary components: the `16.000 MHz` brushed aluminum Quartz Crystal Oscillator and the `24C512` SOIC-8 Sound ROM.
  - **Streamlined Geometric Buses**: Cleaned up erratic wiring into 8 balanced, 45-degree chamfered gold/copper/cyan traces connecting the central DSP to the crystal clock, ROM bus, and stereo audio DAC outputs.
  - **Precision Mounting Pads**: Replaced cluttered test points with 4 corner gold annular mounting pads with metallic specular glints and central drill holes.
  - **Smooth Kinetic Flow**: Replaced 22 random points with 8 rhythmic glowing data packets pulsing down active hero traces, with central DSP energy discharge upon regenerative braking.

### Step 6: Die Long-Press Auto-Cycling (Fidget Screen Saver)
- **Status**: Implemented & Ready for User Testing.
- **Achievements**:
  - **Long-Press Activation**: 700ms long-press on the lower-right `#route-badge-container` Die button toggles Auto-Cycle screen saver mode.
  - **Spinning Die Indicator (Every 2 Seconds)**: Replaced static/breathing glow with a crisp 360-degree snap spin every 2 seconds (`@keyframes diceSpinEvery2s`) on the die icon to indicate active Auto-Cycle mode.
  - **HUD Integration**: Integrated directly into `renderRouteBadges()` so periodic route flippers and GPS location updates never strip away the auto-cycling indicator or die icon.
  - **Timed 2-Minute Rotation**: Rotates to the next kinetic fidget console every 2 minutes.
  - **Manual Skip with Timer Reset**: Short-tapping the Die advances to the next fidget console immediately and restarts the 2-minute timer for the chosen console.
  - **Route Badge Zero-Spin Guarantee**: Route shields, state highway badges, and interstate shields are strictly locked against spinning or animation (`animation: none !important`). Only the Die icon during active fidget console screensaver mode can spin every 2 seconds.
  - **Instant Dismissal**: Long-pressing the Die pauses Auto-Cycle; tapping the lower-left Map button instantly halts Auto-Cycle and returns to navigation.

### Step 7: Map Feature Legend & POI Essential Services Filter in features.html
- **Status**: Queued.
- **Goals**:
  - Map Feature Legend in features.html: Color-coded reference for waterways, parks/forests, building footprints, road hierarchy, and POI icons.
  - Essential Highway Services POI Filter: Tile style filter to optionally hide non-essential commercial POIs while retaining gas stations, coffee, and rest stops.
