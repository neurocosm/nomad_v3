# NOMAD Project Directives & Guidelines

## Core Operating Discipline: One Step at a Time
1. **Single-Step Execution**: Address one feature or fix at a time. Test and verify completely before touching secondary systems.
2. **Never Stack Unverified Edits**: Always validate vector map layers, styles, and kinetic engine canvases against strict runtime specifications.
3. **Triple-Check Work**: Verify styles for missing or mismatched paint properties (e.g. `fill-color` on lines, `line-color` on symbols, `background-color` on rasters) before deploying.
4. **Preserve PWA & Navigation Foundations**: Core HUD navigation, speed signs, compass, and vector map viewports must always remain responsive and functional.
5. **Version Registry Timezone Rule (US Eastern Time / ET)**: When updating `NOMAD_VERSION` in `version.js`, the timestamp MUST strictly reflect US Eastern Time (ET: EDT/EST, UTC-4/UTC-5) as the user's local time, NOT Pacific container/sandbox time. Format: `v3.[MMDDYYYY].[HHMM]` in 24-hour Eastern Time.

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

### Step 5: Synthomatic Console Redesign & Engine Stability [COMPLETED & VERIFIED]
- **Status**: Completed & Verified.
- **Achievements**:
  - **1:1 Square Aspect Ratio**: Re-anchored the Synthomatic PCB canvas and coordinate space to `Math.min(w, h) * 0.90` so the board stays a crisp, non-distorted square centered inside the map viewport.
  - **Clean 3-Component Layout**: Stripped micro-component clutter down to the central hero `SYNTH-DSP 8800` chip flanked by 2 iconic secondary components: the `16.000 MHz` brushed aluminum Quartz Crystal Oscillator and the `24C512` SOIC-8 Sound ROM.
  - **Streamlined Geometric Buses**: Cleaned up erratic wiring into 8 balanced, 45-degree chamfered gold/copper/cyan traces connecting the central DSP to the crystal clock, ROM bus, and stereo audio DAC outputs.
  - **Precision Mounting Pads**: Replaced cluttered test points with 4 corner gold annular mounting pads with metallic specular glints and central drill holes.
  - **Smooth Kinetic Flow**: Replaced 22 random points with 8 rhythmic glowing data packets pulsing down active hero traces, with central DSP energy discharge upon regenerative braking.
  - **Circuit Crash Bug Fixed**: Fixed lexical declaration order of `boxW` before regenerative braking pulse surge; wrapped the kinetic loop in `try...catch...finally` so the animation loop can never permanently terminate.
  - **Instant Screen Swapping & Blank Prevention**: Removed redundant `map.setStyle()` calls on theme return so cached vector tiles and WebGL pipelines stay in GPU memory; added `visibilitychange` and `focus` wake-up hooks so returning from Notes never blanks the viewport.
  - **Stationary Speedometer Deadband**: Added hard zero-clamp filter for indoor GPS multipath drift and phone shaking (< 1.8 MPH), locking speed strictly to 0 MPH when stationary.

### Step 6: Die Auto-Cycling Fidget Screensaver & Countdown Mechanic [COMPLETED & VERIFIED]
- **Status**: Completed & Verified.
- **Achievements**:
  - **Die Face Pip Countdown (6 → 5 → 4 → 3 → 2 → 1)**: When in active auto-cycle fidget mode, the Die starts on face 6. Every 10 seconds, it transitions to the next lower face (6 → 5 → 4 → 3 → 2 → 1), and after reaching 1, rotates to the next kinetic fidget console!
  - **9th-Second Snap Spin Synchronizer**: Die spin triggers right on the 9th second of each 10s step (seconds 9, 19, 29, 39, 49, 59). At 420ms into the 0.85s snap spin (rotated 180° with elastic bounce), the pips smoothly morph into the next face value, landing and resting firmly on the new face right as the 10th second arrives.
  - **Clean Fidget Canvas**: Kept the bottom-center viewport completely uncluttered and open, removing intrusive pagination dots so the full kinetic canvas and horizon remain unobstructed.
  - **Stampede Cloud Formations & Golden Eagle**: Added slowly drifting, multi-lobed celestial clouds across the moonlit canyon twilight sky, and lightened the soaring eagles with warm desert tawny / golden plumage, white head/tail markings, and glowing golden wingtip feather accents.
  - **Manual Skip with Timer Reset**: Short-tapping the Die advances immediately to the next fidget console and restarts the countdown smoothly from face 6.
  - **Route Badge Zero-Spin Guarantee**: Route shields, state highway badges, and interstate shields are strictly locked against spinning (`animation: none !important`). Only the Die icon during active fidget mode spins on countdown steps.
  - **Instant Dismissal & Pause**: Long-pressing the Die toggles Auto-Cycle pause/resume; tapping the lower-left Map button returns instantly to navigation and pauses rotation.

### Post-v4 Wishlist / Deferred
- **Map Feature Legend & POI Essential Services Filter**: Deferred until after Version 4. Since NOMAD functions as a telemetry and kinetic road-trip HUD rather than a turn-by-turn POI directory, POI clutter filtering will be revisited in future phases.
