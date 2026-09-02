/**
 * ====================================================================
 * NOMAD HUD & Telemetry Navigation System
 * 
 * Proprietary & Created by BostonyFX
 * Instagram: https://instagram.com/neurocosm
 * All rights reserved.
 * ====================================================================
 * 
 * Nomad Roadtrip - Kinetic Sensory Starfield & Underwater Ocean Console
 * High-Performance Decoupled Canvas & Fluid Simulation Physics Engine
 * Weather-Reactive Stellar Spectrum & Marine Caustic Particle System
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.KineticConsole = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Base Stellar Palette with Vibrant Weather Morphs
  const STAR_PALETTES = {
    warm: [
      '#ffffff', // Pure Diamond Starlight
      '#fef08a', // Brilliant Sunny Yellow
      '#fde047', // Supernova Gold
      '#fb923c', // Solar Flare Amber
      '#f43f5e', // Coronal Rose
      '#ffffff'
    ],
    temperate: [
      '#ffffff', // Diamond White
      '#38bdf8', // Electric Plasma Cyan
      '#4ade80', // Emerald Aurora
      '#fde047', // Solar Gold
      '#a855f7', // Cosmic Violet
      '#ffffff'
    ],
    cool: [
      '#ffffff', // Pure Ice Diamond
      '#38bdf8', // Glacial Cyan
      '#60a5fa', // Cobalt Star
      '#818cf8', // Deep Indigo Pulse
      '#c084fc', // Nebula Lavender
      '#ffffff'
    ]
  };

  class KineticEngine {
    constructor() {
      this.container = null;
      this.canvas = null;
      this.ctx = null;
      this.rafId = null;
      this.isActive = false;
      this.isVisible = false;
      this.mode = 'starfield'; // 'starfield' | 'underwater' | 'kitt'

      // Canvas dimensions & scaling
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.centerX = 0;
      this.centerY = 0;

      // Telemetry state
      this.speedMph = 0;
      this.targetSpeedMph = 0;
      this.heading = 0;
      this.targetHeading = 0;
      this.altitude = 0;
      this.pitch = 58;

      // K.I.T.T. Internal State for Map Embedding
      this.kittScannerPos = 0;
      this.kittScannerDir = 1;
      this.kittScannerTrails = [0, 0, 0, 0, 0, 0, 0, 0];
      this.kittVoiceLevels = [0, 0, 0];
      this.kittCadencePhase = 0;
      this.circuitNodes = [];
      this.circuitTraces = [];
      this.dataPackets = [];
      this.spmPhase = 0;

      // Live Weather Reactive State
      this.tempF = 72;
      this.humidity = 45;
      this.uvIndex = 2.5;

      // Fidget & Inertia Physics
      this.manualRotation = 0;
      this.angularVelocity = 0;
      this.isDragging = false;
      this.lastPointerX = 0;
      this.lastPointerY = 0;
      this.lastPointerAngle = 0;
      this.dragFriction = 0.94;
      this.returnSpringStrength = 0.05;

      // Ripple & Shockwave particles
      this.ripples = [];

      // Starfield population (3D spherical coordinates)
      this.numStars = 340;
      this.stars = [];

      // Underwater Ocean Population
      this.numBubbles = 110;
      this.bubbles = [];
      this.numFishes = 14;
      this.fishes = [];
      this.causticPhase = 0;

      // Orbital Rings rotation state
      this.ringRotation = 0;
      this.pulsePhase = 0;

      // Stampede Canyon Wildlife state
      this.stampedeDust = [];
      this.stampedeAnimals = [];
      this.stampedeTrees = [];
      this.stampedeGrassTufts = [];
      this.stampedeStars = [];
      this.stampedeEagles = [];
      this.stampedePhase = 0;
      this.sensorTiltX = 0;
      this.targetTiltX = 0;
      this.lastHeading = 0;
      this.swayAngle = 0;

      // Bound event listeners
      this._onResize = this._onResize.bind(this);
      this._onPointerDown = this._onPointerDown.bind(this);
      this._onPointerMove = this._onPointerMove.bind(this);
      this._onPointerUp = this._onPointerUp.bind(this);
      this._onDeviceOrientation = this._onDeviceOrientation.bind(this);
      this._onDeviceMotion = this._onDeviceMotion.bind(this);
      this._loop = this._loop.bind(this);
    }

    init(containerEl) {
      if (!containerEl) return;
      this.container = containerEl;

      // Create canvas if not already in DOM
      let canvas = this.container.querySelector('#kinetic-console-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'kinetic-console-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'none';
        canvas.style.zIndex = '1';
        canvas.style.touchAction = 'none';
        canvas.style.cursor = 'grab';
        this.container.appendChild(canvas);
      }
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');

      this._initStarfield();
      this._initUnderwater();
      this._bindEvents();
      this._updateDimensions();
    }

    setMode(mode) {
      if (mode === 'kitt') {
        this.mode = 'kitt';
        this._initKitt();
      } else if (mode === 'underwater') {
        this.mode = 'underwater';
        this._initUnderwater();
      } else if (mode === 'stampede') {
        this.mode = 'stampede';
        this._initStampede();
      } else {
        this.mode = 'starfield';
        this._initStarfield();
      }
    }

    _initStampede() {
      this.stampedeDust = [];
      this.stampedeAnimals = [];
      this.stampedeFlora = []; // Trees and Giant Saguaro Cacti
      this.stampedeGrassTufts = [];
      this.stampedeStars = [];
      this.stampedeEagles = [];
      this.stampedePhase = 0;

      const w = this.canvas ? this.canvas.width : 400;
      const h = this.canvas ? this.canvas.height : 300;

      // 1. Canyon Night Stars (Twinkling celestial dome)
      for (let i = 0; i < 65; i++) {
        this.stampedeStars.push({
          x: Math.random(),
          y: Math.random() * 0.44, // Upper sky dome above horizon
          size: Math.random() * 1.8 + 0.6,
          twinkleSpeed: Math.random() * 0.04 + 0.015,
          phase: Math.random() * Math.PI * 2,
          colorVar: Math.random() > 0.7 ? '#bae6fd' : (Math.random() > 0.5 ? '#fed7aa' : '#ffffff')
        });
      }

      // 2. Roadside Saguaro Cacti & Swaying Trees (Pines, Junipers, Acacias, Giant Saguaro)
      const floraTypes = ['cactus', 'pine', 'cactus', 'juniper', 'cactus', 'acacia', 'pine', 'cactus'];
      for (let i = 0; i < 22; i++) {
        const side = (i % 2 === 0) ? -1 : 1;
        const z = 0.08 + (i / 22) * 0.88 + (Math.random() - 0.5) * 0.04;
        const fType = floraTypes[i % floraTypes.length];
        this.stampedeFlora.push({
          side: side,
          xOffset: 0.58 + Math.random() * 0.48, // Along roadside margins
          z: Math.max(0.08, Math.min(0.96, z)),
          type: fType,
          height: fType === 'cactus' ? (32 + Math.random() * 22) : (36 + Math.random() * 28),
          width: fType === 'cactus' ? (18 + Math.random() * 12) : (22 + Math.random() * 14),
          arms: Math.floor(Math.random() * 3 + 1), // Saguaro arms
          swayPhase: Math.random() * Math.PI * 2,
          flexibility: fType === 'cactus' ? (Math.random() * 0.2 + 0.45) : (Math.random() * 0.4 + 0.8)
        });
      }

      // 3. Prairie Terrain Swaying Grass Tufts
      for (let i = 0; i < 45; i++) {
        this.stampedeGrassTufts.push({
          x: (Math.random() - 0.5) * 2.1,
          z: Math.random() * 0.92 + 0.08,
          blades: Math.floor(Math.random() * 5 + 4),
          height: Math.random() * 8 + 5,
          swayOffset: Math.random() * Math.PI * 2
        });
      }

      // 4. ARK STAMPEDE Wildlife Ecosystem ("2 of every animal party" scattered across roadway)
      // Paired species scattered in joyous celebration
      const arkSpecies = [
        'giraffe', 'giraffe',       // Towering Giraffes
        'snake', 'snake',           // Slithering Desert Snakes
        'bison', 'bison',           // American Bison
        'mustang', 'mustang',       // Wild Mustangs
        'pronghorn', 'pronghorn',   // Pronghorn Antelopes
        'elk', 'elk',               // Majestic Antlered Elk
        'ram', 'ram'                // Bighorn Rams
      ];

      this.stampedeAnimals = [];
      for (let i = 0; i < arkSpecies.length; i++) {
        const species = arkSpecies[i];
        this.stampedeAnimals.push({
          species: species,
          x: (Math.random() - 0.5) * 1.55, // scattered across roadway (-0.78 to 0.78)
          grazeBaseX: (Math.random() - 0.5) * 1.45,
          z: Math.random() * 0.9 + 0.08,   // depth 0.08 (far) to 1.0 (near)
          speedOffset: Math.random() * 0.35 + 0.85,
          gallopPhase: Math.random() * Math.PI * 2,
          grazePhase: Math.random() * Math.PI * 2,
          grazeSpeed: Math.random() * 0.02 + 0.015,
          slitherPhase: Math.random() * Math.PI * 2,
          size: species === 'giraffe' ? (Math.random() * 0.2 + 1.1) : (species === 'snake' ? (Math.random() * 0.2 + 0.85) : (Math.random() * 0.25 + 0.9)),
          tailFlickTimer: Math.random() * 100,
          coatVariant: Math.floor(Math.random() * 3)
        });
      }

      // 5. Soaring Night Eagles & Birds (Pair circling in the heavens)
      this.stampedeEagles = [];
      for (let e = 0; e < 2; e++) {
        this.stampedeEagles.push({
          angle: (e * Math.PI) + (Math.random() - 0.5) * 0.5,
          radiusX: 0.26 + e * 0.08,
          radiusY: 0.07 + e * 0.03,
          speed: (Math.random() * 0.01 + 0.008) * (e % 2 === 0 ? 1 : -1),
          height: 0.13 + e * 0.08,
          wingSpan: 16 + e * 3,
          wingFlap: 0
        });
      }

      // 6. Ambient Desert Dust Motes
      const numDust = 60;
      for (let i = 0; i < numDust; i++) {
        this.stampedeDust.push({
          x: (Math.random() - 0.5) * (w || 400) * 1.4,
          y: (Math.random() * 0.6 + 0.38) * (h || 300),
          z: Math.random() * 0.9 + 0.1,
          size: Math.random() * 14 + 6,
          alpha: Math.random() * 0.3 + 0.08,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -Math.random() * 0.6 - 0.2,
          life: Math.random() * 100
        });
      }
    }

    _initKitt() {
      this.circuitNodes = [];
      this.circuitTraces = [];
      this.dataPackets = [];
      const w = this.canvas ? this.canvas.width : 400;
      const h = this.canvas ? this.canvas.height : 300;

      const cols = 5;
      const rows = 4;
      const gridW = w / cols;
      const gridH = h / rows;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (Math.random() > 0.4) {
            this.circuitNodes.push({
              x: c * gridW + (Math.random() * 20 - 10),
              y: r * gridH + (Math.random() * 20 - 10),
              radius: Math.random() > 0.7 ? 3.0 : 1.8,
              glow: Math.random() * 0.5 + 0.2
            });
          }
        }
      }

      for (let i = 0; i < this.circuitNodes.length; i++) {
        for (let j = i + 1; j < this.circuitNodes.length; j++) {
          const dx = this.circuitNodes[i].x - this.circuitNodes[j].x;
          const dy = this.circuitNodes[i].y - this.circuitNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < gridW * 1.4 && (Math.abs(dx) < 15 || Math.abs(dy) < 15 || Math.random() > 0.6)) {
            this.circuitTraces.push({
              p1: this.circuitNodes[i],
              p2: this.circuitNodes[j],
              alpha: Math.random() * 0.18 + 0.05
            });
          }
        }
      }

      for (let k = 0; k < 12; k++) {
        if (this.circuitTraces.length > 0) {
          const trace = this.circuitTraces[Math.floor(Math.random() * this.circuitTraces.length)];
          this.dataPackets.push({
            trace: trace,
            t: Math.random(),
            speed: (Math.random() * 0.018 + 0.008)
          });
        }
      }
    }

    _getActiveStarPalette() {
      if (this.tempF >= 80) return STAR_PALETTES.warm;
      if (this.tempF <= 55) return STAR_PALETTES.cool;
      return STAR_PALETTES.temperate;
    }

    _initStarfield() {
      this.stars = [];
      const palette = this._getActiveStarPalette();
      for (let i = 0; i < this.numStars; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 160 + Math.random() * 700;
        const color = palette[Math.floor(Math.random() * palette.length)];

        this.stars.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          baseSize: 0.9 + Math.random() * 2.6,
          color: color,
          pulseSpeed: 0.02 + Math.random() * 0.05,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    }

    _initUnderwater() {
      this.numBubbles = 36;
      this.bubbles = [];
      for (let i = 0; i < this.numBubbles; i++) {
        this.bubbles.push({
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          size: 1.8 + Math.random() * 5.0,
          speedY: 0.7 + Math.random() * 1.8,
          wobbleSpeed: 0.03 + Math.random() * 0.05,
          wobbleOffset: Math.random() * Math.PI * 2,
          opacity: 0.20 + Math.random() * 0.45
        });
      }

      this.creatures = [];

      // 1. Sea Turtles (2 gentle gliders)
      for (let i = 0; i < 2; i++) {
        this.creatures.push({
          type: 'turtle',
          x: Math.random() * 800,
          y: 70 + Math.random() * 320,
          speed: (0.35 + Math.random() * 0.4) * (i % 2 === 0 ? 1 : -1),
          scale: 1.25 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          depth: 0.85 + Math.random() * 0.15
        });
      }

      // 2. Manta Rays (2 majestic gliders)
      for (let i = 0; i < 2; i++) {
        this.creatures.push({
          type: 'ray',
          x: Math.random() * 800,
          y: 60 + Math.random() * 260,
          speed: (0.45 + Math.random() * 0.45) * (i % 2 === 0 ? 1 : -1),
          scale: 1.35 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          depth: 0.90 + Math.random() * 0.1
        });
      }

      // 3. Bioluminescent Jellyfish (3 vertical drifters)
      for (let i = 0; i < 3; i++) {
        this.creatures.push({
          type: 'jelly',
          x: 60 + Math.random() * 700,
          y: 80 + Math.random() * 400,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: -(0.25 + Math.random() * 0.35),
          scale: 1.1 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          color: i === 0 ? '#38bdf8' : (i === 1 ? '#f472b6' : '#c084fc'),
          depth: 0.8 + Math.random() * 0.2
        });
      }

      // 4. Vibrant Clownfish (3 striped swimmers)
      for (let i = 0; i < 3; i++) {
        this.creatures.push({
          type: 'clownfish',
          x: Math.random() * 800,
          y: 80 + Math.random() * 380,
          speed: (0.8 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1),
          scale: 1.1 + Math.random() * 0.25,
          phase: Math.random() * Math.PI * 2,
          depth: 0.75 + Math.random() * 0.25
        });
      }

      // 5. Regal Blue Tangs & Golden Angelfish (5 tropical beauties)
      const tropicalTypes = ['tang', 'angelfish', 'tang', 'angelfish', 'tang'];
      for (let i = 0; i < tropicalTypes.length; i++) {
        this.creatures.push({
          type: tropicalTypes[i],
          x: Math.random() * 800,
          y: 50 + Math.random() * 420,
          speed: (0.7 + Math.random() * 0.9) * (Math.random() > 0.5 ? 1 : -1),
          scale: 1.15 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
          depth: 0.7 + Math.random() * 0.3
        });
      }
    }

    _bindEvents() {
      window.addEventListener('resize', this._onResize, { passive: true });
      window.addEventListener('deviceorientation', this._onDeviceOrientation, { passive: true });
      window.addEventListener('devicemotion', this._onDeviceMotion, { passive: true });

      if (this.canvas) {
        this.canvas.addEventListener('pointerdown', this._onPointerDown);
        window.addEventListener('pointermove', this._onPointerMove);
        window.addEventListener('pointerup', this._onPointerUp);
        window.addEventListener('pointercancel', this._onPointerUp);
      }
    }

    _onDeviceOrientation(e) {
      if (!this.isVisible) return;
      if (e.gamma !== null && !isNaN(e.gamma)) {
        // gamma is left-to-right tilt (-90 to 90 deg)
        this.targetTiltX = Math.max(-35, Math.min(35, e.gamma));
      }
    }

    _onDeviceMotion(e) {
      if (!this.isVisible) return;
      if (e.accelerationIncludingGravity && e.accelerationIncludingGravity.x !== null && !isNaN(e.accelerationIncludingGravity.x)) {
        const ax = e.accelerationIncludingGravity.x || 0;
        this.targetTiltX = Math.max(-35, Math.min(35, ax * 3.5));
      }
    }

    _updateDimensions() {
      if (!this.canvas || !this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;

      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.centerX = (this.width * this.dpr) / 2;
      this.centerY = (this.height * this.dpr) / 2;
    }

    _onResize() {
      if (this.isVisible) {
        this._updateDimensions();
      }
    }

    _getAngleFromCenter(x, y) {
      const rect = this.canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      return Math.atan2(y - cy, x - cx);
    }

    _onPointerDown(e) {
      if (!this.isVisible) return;
      this.isDragging = true;
      this.angularVelocity = 0;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.lastPointerAngle = this._getAngleFromCenter(e.clientX, e.clientY);
      if (this.canvas) this.canvas.style.cursor = 'grabbing';

      const rect = this.canvas.getBoundingClientRect();
      const tx = (e.clientX - rect.left) * this.dpr;
      const ty = (e.clientY - rect.top) * this.dpr;
      this.createShockwave(tx, ty);
    }

    _onPointerMove(e) {
      if (!this.isDragging || !this.isVisible) return;
      const currentAngle = this._getAngleFromCenter(e.clientX, e.clientY);
      let deltaAngle = currentAngle - this.lastPointerAngle;

      if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
      if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

      this.manualRotation += deltaAngle;
      this.angularVelocity = deltaAngle * 0.85;

      this.lastPointerAngle = currentAngle;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    }

    _onPointerUp() {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.canvas) this.canvas.style.cursor = 'grab';
    }

    createShockwave(x, y) {
      const isOcean = this.mode === 'underwater';
      const rippleColor = isOcean ? '#38bdf8' : (this.tempF >= 80 ? '#fb923c' : (this.tempF <= 55 ? '#38bdf8' : '#fde047'));
      this.ripples.push({
        x: x !== undefined ? x : this.centerX,
        y: y !== undefined ? y : this.centerY,
        radius: 10,
        maxRadius: Math.max(this.width, this.height) * 0.75 * this.dpr,
        opacity: 0.95,
        color: rippleColor
      });
    }

    updateTelemetry({ speedMph, heading, altitude, pitch, tempF, humidity, uvIndex }) {
      if (speedMph !== undefined && !isNaN(speedMph)) {
        this.targetSpeedMph = Math.max(0, speedMph);
      }
      if (heading !== undefined && !isNaN(heading)) {
        this.targetHeading = (heading % 360 + 360) % 360;
      }
      if (altitude !== undefined && !isNaN(altitude)) {
        this.altitude = altitude;
      }
      if (pitch !== undefined && !isNaN(pitch)) {
        this.pitch = pitch;
      }
      if (tempF !== undefined && !isNaN(tempF)) {
        const oldPalette = this._getActiveStarPalette();
        this.tempF = tempF;
        const newPalette = this._getActiveStarPalette();
        if (oldPalette !== newPalette && this.mode === 'starfield') {
          this._initStarfield();
        }
      }
      if (humidity !== undefined && !isNaN(humidity)) {
        this.humidity = humidity;
      }
      if (uvIndex !== undefined && !isNaN(uvIndex)) {
        this.uvIndex = uvIndex;
      }
    }

    show() {
      if (!this.canvas) return;
      this.isVisible = true;
      this.canvas.style.display = 'block';
      this._updateDimensions();
      this.start();
    }

    hide() {
      if (!this.canvas) return;
      this.isVisible = false;
      this.canvas.style.display = 'none';
      this.stop();
    }

    start() {
      if (this.isActive) return;
      this.isActive = true;
      this.rafId = requestAnimationFrame(this._loop);
    }

    stop() {
      this.isActive = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    _loop() {
      if (!this.isActive || !this.isVisible) return;

      this._updatePhysics();
      if (this.mode === 'kitt') {
        this._renderKittMode();
      } else if (this.mode === 'underwater') {
        this._renderUnderwater();
      } else if (this.mode === 'stampede') {
        this._renderStampedeMode();
      } else {
        this._renderStarfieldMode();
      }

      this.rafId = requestAnimationFrame(this._loop);
    }

    _updatePhysics() {
      this.speedMph += (this.targetSpeedMph - this.speedMph) * 0.08;

      let diffHeading = (this.targetHeading - this.heading);
      while (diffHeading < -180) diffHeading += 360;
      while (diffHeading > 180) diffHeading -= 360;
      this.heading += diffHeading * 0.06;

      if (!this.isDragging) {
        this.manualRotation += this.angularVelocity;
        this.angularVelocity *= this.dragFriction;

        if (this.speedMph > 3) {
          this.manualRotation *= (1 - this.returnSpringStrength);
        }
      }

      const baseRotationSpeed = 0.003 + (this.speedMph / 100) * 0.015;
      this.ringRotation += baseRotationSpeed;
      this.pulsePhase += 0.035;
      this.causticPhase += 0.02 + (this.speedMph / 100) * 0.04;

      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.radius += 5.5 * this.dpr;
        r.opacity *= 0.94;
        if (r.opacity < 0.01 || r.radius >= r.maxRadius) {
          this.ripples.splice(i, 1);
        }
      }
    }

    /* ------------------------------------------------------------- */
    /* VIBRANT & WEATHER-REACTIVE STARFIELD RENDERING                */
    /* ------------------------------------------------------------- */
    _renderStarfieldMode() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = this.centerX;
      const cy = this.centerY;

      ctx.clearRect(0, 0, w, h);

      // Thermal background atmosphere
      let bgTop = '#060308';
      let bgBottom = '#0d0714';
      let nebulaCol1 = 'rgba(56, 189, 248, 0.09)'; // Cyan
      let nebulaCol2 = 'rgba(168, 85, 247, 0.08)'; // Purple

      if (this.tempF >= 80) {
        bgTop = '#0a0301';
        bgBottom = '#180702';
        nebulaCol1 = 'rgba(251, 146, 60, 0.12)';
        nebulaCol2 = 'rgba(244, 63, 94, 0.09)';
      } else if (this.tempF <= 55) {
        bgTop = '#01050a';
        bgBottom = '#020e1c';
        nebulaCol1 = 'rgba(56, 189, 248, 0.14)';
        nebulaCol2 = 'rgba(99, 102, 241, 0.08)';
      }

      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h) * 0.85);
      bgGrad.addColorStop(0, bgBottom);
      bgGrad.addColorStop(1, bgTop);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Humidity-Driven Nebular Clouds
      const humidityFactor = Math.min(1.0, Math.max(0.2, this.humidity / 75));
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = humidityFactor;

      const nebGrad1 = ctx.createRadialGradient(cx + Math.sin(this.ringRotation * 0.5) * 80, cy - 40, 10, cx, cy, w * 0.6);
      nebGrad1.addColorStop(0, nebulaCol1);
      nebGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, w, h);

      const nebGrad2 = ctx.createRadialGradient(cx - 60, cy + Math.cos(this.ringRotation * 0.4) * 60, 10, cx, cy, w * 0.55);
      nebGrad2.addColorStop(0, nebulaCol2);
      nebGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Render 3D Rings & Starfield Particles
      this._renderOrbitalRings(ctx, cx, cy);
      this._renderStarfieldParticles(ctx, cx, cy);
      this._renderRipples(ctx);
    }

    _renderOrbitalRings(ctx, cx, cy) {
      ctx.save();
      const tilt = 0.52;
      const headingRad = (this.heading * Math.PI) / 180;
      const totalAngle = this.ringRotation + this.manualRotation + headingRad;

      // Center glowing core with UV-Index flare bloom
      const uvBloom = Math.min(1.8, Math.max(0.8, this.uvIndex / 3.0));
      const corePulse = (14 + Math.sin(this.pulsePhase) * 2.5) * uvBloom;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * this.dpr);
      
      const coreColor = this.tempF >= 80 ? 'rgba(251, 146, 60, 0.7)' : (this.tempF <= 55 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(253, 224, 71, 0.7)');
      coreGrad.addColorStop(0, coreColor);
      coreGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.25)');
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * this.dpr, 0, Math.PI * 2);
      ctx.fill();

      // Ring 1: Inner Segmented Radar Ring
      const r1 = Math.min(cx, cy) * 0.36;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r1, r1 * tilt, totalAngle * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = this.tempF >= 80 ? 'rgba(251, 146, 60, 0.55)' : 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.8 * this.dpr;
      ctx.setLineDash([8 * this.dpr, 14 * this.dpr]);
      ctx.stroke();

      // Ring 2: Mid Dynamic Orbit
      const r2 = Math.min(cx, cy) * 0.62;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r2, r2 * tilt, -totalAngle * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.3 * this.dpr;
      ctx.setLineDash([18 * this.dpr, 26 * this.dpr]);
      ctx.stroke();

      // Orbiting Telemetry Nodes (Pulsars)
      const numNodes = 3;
      for (let i = 0; i < numNodes; i++) {
        const nodeAngle = totalAngle * 0.6 + (i * Math.PI * 2) / numNodes;
        const nx = cx + r2 * Math.cos(nodeAngle);
        const ny = cy + r2 * tilt * Math.sin(nodeAngle);

        ctx.beginPath();
        ctx.arc(nx, ny, 3.8 * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8 * this.dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Ring 3: Outer Horizon Ring
      const r3 = Math.min(cx, cy) * 0.86;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r3, r3 * tilt, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1.4 * this.dpr;
      ctx.setLineDash([]);
      ctx.stroke();

      for (let a = 0; a < 4; a++) {
        const tickAngle = (a * Math.PI) / 2 + totalAngle * 0.2;
        const tx1 = cx + (r3 - 6 * this.dpr) * Math.cos(tickAngle);
        const ty1 = cy + (r3 - 6 * this.dpr) * tilt * Math.sin(tickAngle);
        const tx2 = cx + (r3 + 6 * this.dpr) * Math.cos(tickAngle);
        const ty2 = cy + (r3 + 6 * this.dpr) * tilt * Math.sin(tickAngle);

        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0 * this.dpr;
        ctx.stroke();
      }

      ctx.restore();
    }

    _renderStarfieldParticles(ctx, cx, cy) {
      const fov = 340 * this.dpr;
      const speedFactor = Math.max(0.7, this.speedMph * 0.14);
      const warpStreakLength = Math.min(85 * this.dpr, this.speedMph * 1.35 * this.dpr);
      const rotationAngle = (this.heading * Math.PI) / 180 + this.manualRotation;

      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];

        star.z -= speedFactor * (1.3 * this.dpr);
        if (star.z < 10) {
          star.z = 700;
          star.x = (Math.random() * 2 - 1) * 600;
          star.y = (Math.random() * 2 - 1) * 600;
        }

        const rotX = star.x * cosR - star.y * sinR;
        const rotY = star.x * sinR + star.y * cosR;

        const scale = fov / (fov + star.z);
        const px = cx + rotX * scale;
        const py = cy + rotY * scale;

        const twinkle = 0.65 + 0.35 * Math.sin(this.pulsePhase * star.pulseSpeed * 20 + star.pulseOffset);
        const alpha = Math.min(1, scale * 1.6) * twinkle;
        const size = star.baseSize * scale * this.dpr;

        if (px < -50 || px > this.canvas.width + 50 || py < -50 || py > this.canvas.height + 50) {
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        if (warpStreakLength > 2) {
          const streakFactor = (scale * warpStreakLength);
          const angleToCenter = Math.atan2(py - cy, px - cx);
          const sx = px + Math.cos(angleToCenter) * streakFactor;
          const sy = py + Math.sin(angleToCenter) * streakFactor;

          const streakGrad = ctx.createLinearGradient(px, py, sx, sy);
          streakGrad.addColorStop(0, star.color);
          streakGrad.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = Math.max(1.2, size * 1.1);
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, size * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 4 * this.dpr;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    /* ------------------------------------------------------------- */
    /* NEW LIGHT & RELAXING UNDERWATER OCEAN SIMULATION              */
    /* ------------------------------------------------------------- */
    _renderUnderwater() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = this.centerX;
      const cy = this.centerY;

      ctx.clearRect(0, 0, w, h);

      // Tropical Sunlit Marine Gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
      oceanGrad.addColorStop(0, '#38bdf8');   // Sunlit turquoise sky/surface
      oceanGrad.addColorStop(0.4, '#0ea5e9'); // Clear azure water
      oceanGrad.addColorStop(1, '#0369a1');   // Deep cobalt seafloor
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, w, h);

      // Caustic Shimmering Sunbeams
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let b = 0; b < 6; b++) {
        const beamAngle = -0.25 + (b * 0.1) + Math.sin(this.causticPhase + b) * 0.04;
        const beamX = cx + (b - 2.5) * (w * 0.18);
        const beamGrad = ctx.createLinearGradient(beamX, 0, beamX + Math.sin(beamAngle) * h, h);
        beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        beamGrad.addColorStop(0.6, 'rgba(224, 242, 254, 0.10)');
        beamGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(beamX - 30 * this.dpr, 0);
        ctx.lineTo(beamX + 30 * this.dpr, 0);
        ctx.lineTo(beamX + Math.sin(beamAngle) * h + 80 * this.dpr, h);
        ctx.lineTo(beamX + Math.sin(beamAngle) * h - 80 * this.dpr, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Render Marine Swimming Life
      const headingRad = (this.heading * Math.PI) / 180 + this.manualRotation;
      const speedOffset = (this.speedMph * 0.15) * this.dpr;

      ctx.save();
      const creatures = this.creatures || [];
      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        
        if (c.type === 'jelly') {
          c.x += (c.speedX * this.dpr);
          c.y += (c.speedY * this.dpr) - (this.speedMph * 0.05 * this.dpr);
          c.phase += 0.05;
          if (c.y < -80) { c.y = h + 80; c.x = 60 + Math.random() * (w - 120); }
          if (c.x < -60) c.x = w + 60;
          if (c.x > w + 60) c.x = -60;

          const scale = c.scale * this.dpr;
          const pulse = 1 + Math.sin(c.phase * 3) * 0.18;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(scale, scale);
          ctx.globalAlpha = c.depth * 0.75;

          // Jellyfish Bell (translucent dome)
          ctx.beginPath();
          ctx.arc(0, 0, 18 * pulse, Math.PI, 0, false);
          ctx.bezierCurveTo(18 * pulse, 12 / pulse, -18 * pulse, 12 / pulse, -18 * pulse, 0);
          ctx.fillStyle = c.color;
          ctx.shadowColor = c.color;
          ctx.shadowBlur = 10 * this.dpr;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner dome glow
          ctx.beginPath();
          ctx.arc(0, -2, 10 * pulse, Math.PI, 0, false);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = c.depth * 0.45;
          ctx.fill();

          // Undulating Tentacles
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 1.4;
          ctx.globalAlpha = c.depth * 0.6;
          for (let t = -3; t <= 3; t += 2) {
            const tx = t * 4 * pulse;
            ctx.beginPath();
            ctx.moveTo(tx, 6);
            ctx.quadraticCurveTo(tx + Math.sin(c.phase * 2 + t) * 8, 22, tx + Math.sin(c.phase * 2 + t * 0.5) * 6, 42);
            ctx.stroke();
          }
          ctx.restore();
          continue;
        }

        // Horizontal Swimming Creatures (Turtle, Ray, Clownfish, Tang, Angelfish)
        c.x += (c.speed * 1.5 * this.dpr) + (Math.sin(headingRad) * speedOffset * c.depth);
        c.phase += 0.08;

        if (c.x > w + 90) c.x = -90;
        if (c.x < -90) c.x = w + 90;

        const fy = c.y + Math.sin(c.phase * 0.7) * 7 * this.dpr;
        const scale = c.scale * this.dpr;
        const dir = c.speed > 0 ? 1 : -1;

        ctx.save();
        ctx.translate(c.x, fy);
        ctx.scale(dir * scale, scale);
        ctx.globalAlpha = c.depth * 0.90;

        if (c.type === 'turtle') {
          // --- SEA TURTLE ---
          const flipperFlap = Math.sin(c.phase * 1.4) * 0.35;
          
          // Front Flippers
          ctx.save();
          ctx.fillStyle = '#065f46';
          // Top flipper
          ctx.beginPath();
          ctx.ellipse(8, -16 + flipperFlap * 14, 18, 7, -0.4 + flipperFlap, 0, Math.PI * 2);
          ctx.fill();
          // Bottom flipper
          ctx.beginPath();
          ctx.ellipse(8, 16 - flipperFlap * 14, 18, 7, 0.4 - flipperFlap, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Rear Flippers
          ctx.fillStyle = '#047857';
          ctx.beginPath();
          ctx.ellipse(-18, -10, 9, 4, -0.6, 0, Math.PI * 2);
          ctx.ellipse(-18, 10, 9, 4, 0.6, 0, Math.PI * 2);
          ctx.fill();

          // Shell (Carapace)
          ctx.beginPath();
          ctx.ellipse(0, 0, 22, 16, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#0f766e';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#34d399';
          ctx.stroke();

          // Shell Scute Patterns
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Head
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.ellipse(24, 0, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Eye
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(26, -2, 1.4, 0, Math.PI * 2);
          ctx.fill();

        } else if (c.type === 'ray') {
          // --- MANTA RAY ---
          const wingWave = Math.sin(c.phase * 1.6) * 0.3;
          
          // Long Whip Tail
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-16, 0);
          ctx.quadraticCurveTo(-38, Math.sin(c.phase) * 6, -60, Math.sin(c.phase * 0.8) * 10);
          ctx.stroke();

          // Diamond Body & Wings
          ctx.beginPath();
          ctx.moveTo(20, 0);
          ctx.quadraticCurveTo(6, -28 + wingWave * 16, -14, -22 + wingWave * 14);
          ctx.quadraticCurveTo(-8, -4, -18, 0);
          ctx.quadraticCurveTo(-8, 4, -14, 22 - wingWave * 14);
          ctx.quadraticCurveTo(6, 28 - wingWave * 16, 20, 0);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();

          // Dorsal markings
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.ellipse(2, 0, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cephalic Horns/Fins
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(22, -6, 5, 2.5, -0.3, 0, Math.PI * 2);
          ctx.ellipse(22, 6, 5, 2.5, 0.3, 0, Math.PI * 2);
          ctx.fill();

        } else if (c.type === 'clownfish') {
          // --- CLOWNFISH (Nemo Striped) ---
          const tailWag = Math.sin(c.phase * 2.5) * 4;
          
          // Tail
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-22, -8 + tailWag);
          ctx.lineTo(-18, 0);
          ctx.lineTo(-22, 8 + tailWag);
          ctx.closePath();
          ctx.fill();

          // Main Orange Body
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // White Vertical Stripes with Black Edges
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.2;

          // Head stripe
          ctx.beginPath();
          ctx.ellipse(6, 0, 3, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Mid stripe
          ctx.beginPath();
          ctx.ellipse(-2, 0, 3.2, 9.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Tail stripe
          ctx.beginPath();
          ctx.ellipse(-10, 0, 2.2, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Eye
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(10, -3, 1.8, 0, Math.PI * 2);
          ctx.fill();

        } else if (c.type === 'angelfish') {
          // --- TROPICAL ANGELFISH ---
          const tailWag = Math.sin(c.phase * 2.2) * 4;

          // Tall Top & Bottom Fin streamers
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.moveTo(2, -8);
          ctx.lineTo(-8, -26);
          ctx.lineTo(-10, -6);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(2, 8);
          ctx.lineTo(-8, 26);
          ctx.lineTo(-10, 6);
          ctx.closePath();
          ctx.fill();

          // Diamond Body
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
          ctx.fill();

          // Black Vertical Stripes
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.ellipse(4, 0, 2.2, 11, 0, 0, Math.PI * 2);
          ctx.ellipse(-3, 0, 2.5, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail fin
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(-12, 0);
          ctx.lineTo(-24, -10 + tailWag);
          ctx.lineTo(-18, 0);
          ctx.lineTo(-24, 10 + tailWag);
          ctx.closePath();
          ctx.fill();

          // Eye
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(8, -2, 1.6, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // --- REGAL BLUE TANG ---
          const tailWag = Math.sin(c.phase * 2.4) * 4;

          // Body Oval
          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Black Swirl Pattern
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.ellipse(-2, -2, 8, 4, 0.3, 0, Math.PI * 2);
          ctx.fill();

          // Yellow Tail and dorsal fin
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-22, -9 + tailWag);
          ctx.lineTo(-18, 0);
          ctx.lineTo(-22, 9 + tailWag);
          ctx.closePath();
          ctx.fill();

          // Eye
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(9, -2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
      ctx.restore();

      // Rising Air Bubbles & Hydrodynamic Slipstream
      const bubbleSpeedFactor = 1 + (this.speedMph / 25);
      ctx.save();
      for (let i = 0; i < this.bubbles.length; i++) {
        const b = this.bubbles[i];
        b.y -= (b.speedY * bubbleSpeedFactor * this.dpr);
        b.wobbleOffset += b.wobbleSpeed;
        const bx = b.x + Math.sin(b.wobbleOffset) * 4 * this.dpr;

        if (b.y < -20) {
          b.y = h + 20;
          b.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(bx, b.y, b.size * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.strokeStyle = `rgba(224, 242, 254, ${b.opacity + 0.2})`;
        ctx.lineWidth = 1 * this.dpr;
        ctx.fill();
        ctx.stroke();

        // Little bubble specular glint
        ctx.beginPath();
        ctx.arc(bx - b.size * 0.3 * this.dpr, b.y - b.size * 0.3 * this.dpr, b.size * 0.25 * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      ctx.restore();

      // Shockwave Water Rings
      this._renderRipples(ctx);
    }

    _renderRipples(ctx) {
      if (this.ripples.length === 0) return;
      ctx.save();
      for (let i = 0; i < this.ripples.length; i++) {
        const r = this.ripples[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = r.opacity;
        ctx.lineWidth = 2.4 * this.dpr;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = r.opacity * 0.6;
        ctx.lineWidth = 1.2 * this.dpr;
        ctx.stroke();
      }
      ctx.restore();
    }

    /* ------------------------------------------------------------- */
    /* CYBER ORBIT SYNTH & TRAVELING COMPASS HALO (MAP EMBED)       */
    /* ------------------------------------------------------------- */
    _renderKittMode() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = this.centerX;
      const cy = this.centerY;
      const speed = Math.round(this.speedMph);
      const isSpm = speed >= 65;

      ctx.clearRect(0, 0, w, h);

      // Deep automotive background
      ctx.fillStyle = '#030206';
      ctx.fillRect(0, 0, w, h);

      // 1. Automotive Circuit Traces & Solder Nodes (Emerald Green & Gold PCB traces)
      ctx.save();
      ctx.lineWidth = 1.2 * this.dpr;
      for (let i = 0; i < this.circuitTraces.length; i++) {
        const t = this.circuitTraces[i];
        ctx.beginPath();
        ctx.moveTo(t.p1.x, t.p1.y);
        ctx.lineTo(t.p2.x, t.p2.y);
        ctx.strokeStyle = `rgba(34, 197, 94, ${t.alpha * (speed > 25 ? 1.6 : 1.1)})`;
        ctx.stroke();
      }

      for (let i = 0; i < this.circuitNodes.length; i++) {
        const n = this.circuitNodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 179, 8, ${n.glow * 1.2})`;
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 4 * this.dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Traveling micro-data packets (Gold & Yellow)
      for (let i = 0; i < this.dataPackets.length; i++) {
        const p = this.dataPackets[i];
        p.t += p.speed * (1 + speed * 0.04);
        if (p.t > 1) p.t = 0;
        const px = p.trace.p1.x + (p.trace.p2.x - p.trace.p1.x) * p.t;
        const py = p.trace.p1.y + (p.trace.p2.y - p.trace.p1.y) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.2 * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 6 * this.dpr;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // 2. Hyper-Drive (S.P.M.) Warp Rays
      if (isSpm) {
        this.spmPhase += 0.08;
        ctx.save();
        ctx.lineWidth = 2.0 * this.dpr;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + this.spmPhase * 0.15;
          const dist1 = 60 * this.dpr + ((this.spmPhase * 70 + i * 20) % (Math.max(w, h) * 0.6));
          const dist2 = dist1 + 50 * this.dpr;
          const x1 = cx + Math.cos(angle) * dist1;
          const y1 = cy + Math.sin(angle) * dist1;
          const x2 = cx + Math.cos(angle) * dist2;
          const y2 = cy + Math.sin(angle) * dist2;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(255, 234, 0, ${0.18 + Math.sin(this.spmPhase + i) * 0.1})`;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Center Cyber Orbit Equalizer + Traveling Compass Halo
      this.kittCadencePhase += 0.08 + (speed > 25 ? 0.05 : 0);
      const rawVoice = Math.pow(Math.abs(Math.sin(this.kittCadencePhase * 2.5) * Math.cos(this.kittCadencePhase * 1.3)), 1.5);
      const amp = Math.max(0.15, Math.min(1.0, rawVoice + (speed > 0 ? 0.25 : 0.08)));

      const targetLevels = [
        amp * (0.75 + Math.sin(this.kittCadencePhase * 3) * 0.2),
        amp,
        amp * (0.75 + Math.cos(this.kittCadencePhase * 3) * 0.2)
      ];

      for (let c = 0; c < 3; c++) {
        this.kittVoiceLevels[c] += (targetLevels[c] - this.kittVoiceLevels[c]) * 0.35;
      }

      ctx.save();
      // Scaled up box size for high visibility on dashboards
      const boxW = Math.min(300 * this.dpr, w * 0.84);
      const boxH = Math.min(170 * this.dpr, h * 0.68);
      const boxX = cx - boxW / 2;
      const boxY = cy - boxH / 2;
      const cornerR = 14 * this.dpr;

      // Compass responsive orbital traveling speed & direction
      const turnVel = (this.heading - (this._prevHeading || this.heading));
      this._prevHeading = this.heading;
      let travelDir = 1; // 1 = clockwise, -1 = counter-clockwise
      if (turnVel < -0.2) travelDir = -1;
      else if (turnVel > 0.2) travelDir = 1;

      const orbitSpeed = (0.005 + Math.min(0.015, speed * 0.0003) + Math.abs(turnVel) * 0.002) * travelDir;
      this.kittScannerPos = ((this.kittScannerPos + orbitSpeed) % 1 + 1) % 1;

      // Background Bezel
      ctx.fillStyle = 'rgba(8, 1, 3, 0.94)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, cornerR);
      ctx.fill();
      ctx.shadowColor = isSpm ? '#ffd700' : '#ff0033';
      ctx.shadowBlur = 18 * this.dpr;
      ctx.strokeStyle = isSpm ? '#ffd700' : '#ff0033';
      ctx.lineWidth = 2.0 * this.dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Traveling Halo Beads around the rounded rectangle frame
      const numBeads = 28;
      for (let b = 0; b < numBeads; b++) {
        const beadT = b / numBeads;
        let diff = Math.abs(beadT - this.kittScannerPos);
        if (diff > 0.5) diff = 1.0 - diff;

        // Perimeter Point calculation
        const beadPt = this._getRoundedRectPt(beadT, boxX, boxY, boxW, boxH, cornerR);

        if (diff < 0.12) {
          const intensity = 1.0 - (diff / 0.12);
          ctx.beginPath();
          ctx.arc(beadPt.x, beadPt.y, 4.0 * this.dpr, 0, Math.PI * 2);
          ctx.fillStyle = isSpm ? '#ffd700' : '#ff3344';
          ctx.shadowColor = isSpm ? '#ffd700' : '#ff0033';
          ctx.shadowBlur = intensity * 12 * this.dpr;
          ctx.fill();

          if (intensity > 0.7) {
            ctx.beginPath();
            ctx.arc(beadPt.x, beadPt.y, 1.8 * this.dpr, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(beadPt.x, beadPt.y, 1.6 * this.dpr, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 30, 40, 0.25)';
          ctx.fill();
        }
      }

      // Title header (Clear, readable font)
      ctx.font = `900 ${Math.round(13.5 * this.dpr)}px "Courier New", monospace`;
      ctx.fillStyle = isSpm ? '#ffd700' : '#ffffff';
      ctx.shadowColor = isSpm ? '#ffd700' : '#22c55e';
      ctx.shadowBlur = 8 * this.dpr;
      ctx.textAlign = 'center';
      ctx.fillText('SYNTHOMATIC', cx, boxY + 22 * this.dpr);
      ctx.shadowBlur = 0;

      // 3 Columns: Left, Center, Right
      const numCols = 3;
      const colWidth = (boxW - 60 * this.dpr) / numCols;
      const colGap = 12 * this.dpr;
      const leftStartX = cx - (numCols * colWidth + (numCols - 1) * colGap) / 2;

      const segmentsPerCol = [10, 12, 10];
      const segH = 6 * this.dpr;
      const segG = 3 * this.dpr;

      for (let c = 0; c < numCols; c++) {
        const colX = leftStartX + c * (colWidth + colGap);
        const totalSegs = segmentsPerCol[c];
        const activeCount = Math.round(this.kittVoiceLevels[c] * (totalSegs / 2));
        const midIndex = totalSegs / 2;

        const colTotalHeight = totalSegs * segH + (totalSegs - 1) * segG;
        const colStartY = boxY + 28 * this.dpr + (boxH - 48 * this.dpr - colTotalHeight) / 2;

        for (let s = 0; s < totalSegs; s++) {
          const sy = colStartY + s * (segH + segG);
          const distFromMid = Math.abs(s - (midIndex - 0.5));
          const isActive = distFromMid < activeCount;

          if (isActive) {
            ctx.fillStyle = isSpm ? '#ffd700' : '#ff0033';
            ctx.shadowColor = isSpm ? '#ffd700' : '#ff0033';
            ctx.shadowBlur = 10 * this.dpr;
            ctx.fillRect(colX, sy, colWidth, segH);

            // Core Hot White Center
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(colX + 4 * this.dpr, sy + 1.5 * this.dpr, colWidth - 8 * this.dpr, segH - 3 * this.dpr);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = 'rgba(50, 6, 12, 0.45)';
            ctx.fillRect(colX, sy, colWidth, segH);
          }
        }
      }

      // Footer state label (Large, clear typography)
      let stateLabel = 'STANDBY';
      let stateColor = '#22c55e';
      if (speed > 64) { stateLabel = 'HYPER-DRIVE'; stateColor = '#ffd700'; }
      else if (speed > 25) { stateLabel = 'PURSUIT MODE'; stateColor = '#ff3344'; }
      else if (speed > 0) { stateLabel = 'CRUISE VECTOR'; stateColor = '#eab308'; }

      ctx.font = `900 ${Math.round(13 * this.dpr)}px "Courier New", monospace`;
      ctx.fillStyle = stateColor;
      ctx.shadowColor = stateColor;
      ctx.shadowBlur = 6 * this.dpr;
      ctx.textAlign = 'center';
      ctx.fillText(stateLabel, cx, boxY + boxH - 12 * this.dpr);
      ctx.shadowBlur = 0;

      ctx.restore();

      // Ripples
      this._renderRipples(ctx);
    }

    _renderStampedeMode() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = this.centerX;
      const cy = this.centerY;
      const speed = this.speedMph || 0;
      const isStopped = speed < 0.5;

      ctx.clearRect(0, 0, w, h);

      // 1. Animation phase & Kinetic Sensor Physics progression
      const gallopRate = isStopped ? 0.015 : (0.08 + Math.min(0.24, speed * 0.004));
      this.stampedePhase += gallopRate;

      // Smooth sensor tilt tracking
      this.sensorTiltX += (this.targetTiltX - this.sensorTiltX) * 0.14;

      // Heading steering delta (rotational momentum)
      let headingDelta = (this.heading - this.lastHeading);
      if (headingDelta > 180) headingDelta -= 360;
      if (headingDelta < -180) headingDelta += 360;
      this.lastHeading = this.heading;

      // Combined kinetic sway angle from device tilt, steering turns, touch drag, and speed wind gusts
      const windGust = Math.sin(this.stampedePhase * 0.7) * 0.06 + Math.sin(this.stampedePhase * 1.6) * 0.03;
      const turnSway = Math.max(-0.25, Math.min(0.25, -headingDelta * 0.03));
      const tiltSway = (this.sensorTiltX / 35) * 0.22;
      const dragSway = this.angularVelocity * 0.22;
      const speedBreeze = (speed / 80) * 0.06;
      this.swayAngle = tiltSway + windGust + turnSway + dragSway + speedBreeze;

      const horizonY = cy * 0.76;

      // 2. Scenic Night-Time Atmosphere (Midnight Obsidian to Deep Indigo Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#04010a');    // Midnight obsidian zenith
      skyGrad.addColorStop(0.35, '#0c0517'); // Deep celestial indigo
      skyGrad.addColorStop(0.72, '#190d28'); // Starlit canyon twilight
      skyGrad.addColorStop(1, '#2c1538');    // Moonlit atmospheric horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);

      // Twinkling Canyon Night Stars
      if (this.stampedeStars) {
        ctx.save();
        for (let star of this.stampedeStars) {
          star.phase += star.twinkleSpeed;
          const alpha = 0.35 + Math.sin(star.phase) * 0.45;
          ctx.fillStyle = star.colorVar;
          ctx.globalAlpha = Math.max(0.12, Math.min(1.0, alpha));
          ctx.beginPath();
          ctx.arc(star.x * w, star.y * horizonY * 0.95, star.size * this.dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Glowing Silver Crescent Moon with Soft Luminous Halo
      this._drawCrescentMoon(ctx, cx + w * 0.28, horizonY * 0.34, 16 * this.dpr);

      // 3. Distant Ark Vessel Silhouette & Horizon Beacon Light
      this._drawArkVessel(ctx, cx, horizonY);

      // Distant Dark Mesa & Canyon Ridge Silhouettes
      ctx.save();
      // Back Mesa Layer (Far)
      ctx.fillStyle = '#170b22';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w * 0.12, horizonY - 28 * this.dpr);
      ctx.lineTo(w * 0.26, horizonY - 28 * this.dpr);
      ctx.lineTo(w * 0.38, horizonY);
      ctx.lineTo(w * 0.62, horizonY);
      ctx.lineTo(w * 0.74, horizonY - 22 * this.dpr);
      ctx.lineTo(w * 0.88, horizonY - 22 * this.dpr);
      ctx.lineTo(w, horizonY);
      ctx.lineTo(w, horizonY + 10);
      ctx.lineTo(0, horizonY + 10);
      ctx.closePath();
      ctx.fill();

      // Front Canyon Rim Layer (Closer)
      ctx.fillStyle = '#0f0616';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w * 0.08, horizonY - 14 * this.dpr);
      ctx.lineTo(w * 0.20, horizonY - 17 * this.dpr);
      ctx.lineTo(w * 0.44, horizonY);
      ctx.lineTo(w * 0.58, horizonY);
      ctx.lineTo(w * 0.78, horizonY - 18 * this.dpr);
      ctx.lineTo(w * 0.94, horizonY - 10 * this.dpr);
      ctx.lineTo(w, horizonY);
      ctx.lineTo(w, horizonY + 10);
      ctx.lineTo(0, horizonY + 10);
      ctx.closePath();
      ctx.fill();

      // Mesa rim silver starlight highlight
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.25)';
      ctx.lineWidth = 1.0 * this.dpr;
      ctx.stroke();
      ctx.restore();

      // Soaring Night Eagles in the Sky
      if (this.stampedeEagles) {
        for (let eagle of this.stampedeEagles) {
          eagle.angle += eagle.speed;
          const ex = cx + Math.cos(eagle.angle) * (w * eagle.radiusX);
          const ey = (horizonY * eagle.height) + Math.sin(eagle.angle) * (horizonY * eagle.radiusY);
          const bankAngle = Math.cos(eagle.angle) * 0.25 * (eagle.speed > 0 ? 1 : -1) + (this.swayAngle * 0.3);
          this._drawEagle(ctx, ex, ey, eagle.wingSpan * this.dpr, bankAngle);
        }
      }

      // 4. Brightened Prairie Floor & Illuminated Roadway
      // Brightened warm sandstone & moonlit amber prairie ground (high contrast against dark animals)
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      groundGrad.addColorStop(0, '#583119');    // Canyon horizon base
      groundGrad.addColorStop(0.2, '#884a24');   // Moonlit sandstone slope
      groundGrad.addColorStop(0.55, '#bd763d');  // Brightened amber prairie
      groundGrad.addColorStop(1, '#db965c');    // Bright warm foreground
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Brightened Center Canyon Road / Highway Ribbon
      ctx.save();
      const roadTopW = w * 0.14;
      const roadBotW = w * 0.78;
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#d2965c');
      roadGrad.addColorStop(0.25, '#ebb179');
      roadGrad.addColorStop(0.65, '#fad5a4'); // Luminous bright sandstone roadway
      roadGrad.addColorStop(1, '#ffe3be');   // Luminous bright highway glow
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(cx - roadTopW * 0.5, horizonY);
      ctx.lineTo(cx + roadTopW * 0.5, horizonY);
      ctx.lineTo(cx + roadBotW * 0.5, h);
      ctx.lineTo(cx - roadBotW * 0.5, h);
      ctx.closePath();
      ctx.fill();

      // Road edge bright boundary lines
      ctx.strokeStyle = 'rgba(255, 245, 220, 0.6)';
      ctx.lineWidth = 1.6 * this.dpr;
      ctx.beginPath();
      ctx.moveTo(cx - roadTopW * 0.5, horizonY);
      ctx.lineTo(cx - roadBotW * 0.5, h);
      ctx.moveTo(cx + roadTopW * 0.5, horizonY);
      ctx.lineTo(cx + roadBotW * 0.5, h);
      ctx.stroke();

      // Subtle curved tyre ruts for depth
      ctx.strokeStyle = 'rgba(175, 95, 45, 0.24)';
      ctx.lineWidth = 3.5 * this.dpr;
      ctx.beginPath();
      ctx.moveTo(cx - roadTopW * 0.22, horizonY);
      ctx.lineTo(cx - roadBotW * 0.24, h);
      ctx.moveTo(cx + roadTopW * 0.22, horizonY);
      ctx.lineTo(cx + roadBotW * 0.24, h);
      ctx.stroke();
      ctx.restore();

      // Prairie contour lines (Brightened warm strokes)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 230, 190, 0.22)';
      ctx.lineWidth = 1.0 * this.dpr;
      for (let line = 0; line < 4; line++) {
        const ly = horizonY + (h - horizonY) * (0.22 + line * 0.24);
        ctx.beginPath();
        ctx.moveTo(0, ly);
        for (let lx = 0; lx < w; lx += 28 * this.dpr) {
          const wave = Math.sin(lx * 0.03 + line * 1.5) * 3 * this.dpr;
          ctx.lineTo(lx, ly + wave);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 5. Combined Z-Sorted 3D Rendering: Trees, Saguaro Cacti, Grass Tufts, and Wildlife Herd
      // Build render queue for accurate perspective depth layering (z: 0.08 far -> 1.0 near)
      const renderQueue = [];

      // Add Flora (Trees & Giant Saguaro Cacti)
      if (this.stampedeFlora) {
        for (let flora of this.stampedeFlora) {
          renderQueue.push({ type: 'flora', z: flora.z, data: flora });
        }
      }

      // Add Grass Tufts
      if (this.stampedeGrassTufts) {
        for (let tuft of this.stampedeGrassTufts) {
          renderQueue.push({ type: 'grass', z: tuft.z, data: tuft });
        }
      }

      // Add Wildlife Animals
      if (this.stampedeAnimals) {
        const herdThrust = isStopped ? 0 : (0.003 + (speed / 80) * 0.016);
        for (let animal of this.stampedeAnimals) {
          if (isStopped) {
            animal.grazePhase += animal.grazeSpeed;
            animal.x = animal.grazeBaseX + Math.sin(animal.grazePhase * 0.5) * 0.04;
          } else {
            animal.z += herdThrust * animal.speedOffset;
            if (animal.z > 1.06) {
              animal.z = 0.08;
              animal.x = (Math.random() - 0.5) * 1.55;
              animal.grazeBaseX = animal.x;
            }
            animal.gallopPhase += gallopRate * animal.speedOffset;
          }
          if (animal.species === 'snake') {
            animal.slitherPhase += isStopped ? 0.04 : (0.12 + Math.min(0.25, speed * 0.005));
          }
          renderQueue.push({ type: 'animal', z: Math.max(0.08, Math.min(1.0, animal.z)), data: animal });
        }
      }

      // Sort entire scene by depth (Z far to near)
      renderQueue.sort((a, b) => a.z - b.z);

      // Render items in depth order
      for (let item of renderQueue) {
        const pz = item.z;
        const groundSpread = (h - horizonY);
        const iy = horizonY + Math.pow(pz, 1.35) * groundSpread;

        if (item.type === 'flora') {
          const flora = item.data;
          const trackWidth = (w * 0.16) + pz * (w * 0.92);
          const tx = cx + (flora.side * flora.xOffset * trackWidth * 0.5);
          const fScale = (0.25 + Math.pow(pz, 1.4) * 0.95) * this.dpr;
          if (flora.type === 'cactus') {
            this._drawSaguaroCactus(ctx, tx, iy, fScale, flora, this.swayAngle);
          } else {
            this._drawSwayingTree(ctx, tx, iy, fScale, flora, this.swayAngle);
          }
        } else if (item.type === 'grass') {
          const tuft = item.data;
          const trackW = (w * 0.15) + pz * (w * 0.85);
          const gx = cx + tuft.x * trackW * 0.5;
          const gh = tuft.height * pz * this.dpr;
          this._drawSwayingGrass(ctx, gx, iy, gh, tuft, this.swayAngle);
        } else if (item.type === 'animal') {
          const animal = item.data;
          const trackWidth = (w * 0.12) + pz * (w * 0.82);
          const ax = cx + (animal.x * trackWidth * 0.5);
          const scale = (0.22 + Math.pow(pz, 1.5) * 1.05) * animal.size * this.dpr;

          let bounce = 0;
          if (animal.species === 'snake') {
            bounce = 0;
          } else if (isStopped) {
            bounce = Math.sin(animal.grazePhase * 2) * 1.2 * scale;
          } else {
            bounce = Math.abs(Math.sin(animal.gallopPhase)) * 7 * scale;
          }

          // Trailing dust particles while galloping
          if (!isStopped && pz > 0.3 && Math.random() < 0.35) {
            this.stampedeDust.push({
              x: ax + (Math.random() - 0.5) * 16 * scale,
              y: iy - bounce + 3 * scale,
              z: pz,
              size: (Math.random() * 10 + 5) * scale,
              alpha: 0.38 * pz,
              vx: (Math.random() - 0.5) * 1.4,
              vy: -Math.random() * 1.0 - 0.3,
              life: 50
            });
          }

          this._drawWildlifeAnimal(ctx, ax, iy - bounce, scale, pz, animal, isStopped, speed);
        }
      }

      // 6. Dust Storm & Wind Motes Simulation
      for (let i = this.stampedeDust.length - 1; i >= 0; i--) {
        const d = this.stampedeDust[i];
        d.x += d.vx + this.swayAngle * 1.8;
        d.y += d.vy;
        d.size += 0.35 * this.dpr;
        d.alpha *= 0.96;
        d.life--;

        if (d.alpha < 0.01 || d.life <= 0) {
          this.stampedeDust.splice(i, 1);
          continue;
        }

        ctx.save();
        const dustGrad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size);
        dustGrad.addColorStop(0, `rgba(255, 215, 150, ${d.alpha})`);
        dustGrad.addColorStop(0.6, `rgba(215, 140, 70, ${d.alpha * 0.5})`);
        dustGrad.addColorStop(1, 'rgba(120, 60, 20, 0)');
        ctx.fillStyle = dustGrad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Replenish ambient dust motes
      if (this.stampedeDust.length < (isStopped ? 25 : 60)) {
        this.stampedeDust.push({
          x: cx + (Math.random() - 0.5) * w * 1.1,
          y: horizonY + Math.random() * (h - horizonY),
          z: Math.random() * 0.8 + 0.2,
          size: Math.random() * 12 + 6,
          alpha: isStopped ? 0.12 : 0.25,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -Math.random() * 0.4 - 0.1,
          life: 70
        });
      }

      // 7. Interactive touch ripples
      this._renderRipples(ctx);
    }

    _drawCrescentMoon(ctx, x, y, radius) {
      ctx.save();
      // Soft outer moonlit glow
      const glowGrad = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 2.8);
      glowGrad.addColorStop(0, 'rgba(240, 246, 255, 0.45)');
      glowGrad.addColorStop(0.4, 'rgba(186, 230, 253, 0.18)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Silver Crescent Moon Disc
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Shadow cutout creating glowing crescent
      ctx.fillStyle = '#0e0618';
      ctx.beginPath();
      ctx.arc(x + radius * 0.55, y - radius * 0.2, radius * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _drawSwayingTree(ctx, x, y, scale, tree, swayAngle) {
      ctx.save();
      ctx.translate(x, y);

      const flexSway = swayAngle * tree.flexibility;
      const th = tree.height * scale;
      const tw = tree.width * scale;

      // Dark silhouette foliage color with depth
      const alpha = Math.min(1.0, 0.45 + tree.z * 0.55);
      const isPine = tree.treeType === 'pine' || tree.treeType === 'cypress';
      const treeColor = isPine ? `rgba(14, 28, 18, ${alpha})` : `rgba(22, 18, 12, ${alpha})`;
      const trunkColor = `rgba(28, 15, 8, ${alpha})`;

      // 1. Trunk with kinetic curvature
      ctx.beginPath();
      ctx.strokeStyle = trunkColor;
      ctx.lineWidth = Math.max(1.5 * this.dpr, 3.5 * scale);
      ctx.moveTo(0, 0);
      const midSway = flexSway * 12 * scale;
      const tipSway = flexSway * 26 * scale;
      ctx.quadraticCurveTo(midSway, -th * 0.5, tipSway, -th);
      ctx.stroke();

      // 2. Foliage Boughs (Pines, Junipers, Acacias)
      ctx.fillStyle = treeColor;
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.15 * tree.z})`;
      ctx.lineWidth = 0.8 * this.dpr;

      if (isPine) {
        // Multi-tiered evergreen pine boughs
        const tiers = 3;
        for (let t = 0; t < tiers; t++) {
          const tierY = -th * (0.35 + t * 0.28);
          const tierW = tw * (1.0 - t * 0.25);
          const tierH = th * 0.32;
          const tierSway = flexSway * (10 + t * 6) * scale;

          ctx.beginPath();
          ctx.moveTo(tierSway, tierY - tierH);
          ctx.lineTo(tierSway + tierW * 0.5, tierY);
          ctx.quadraticCurveTo(tierSway, tierY - 2 * scale, tierSway - tierW * 0.5, tierY);
          ctx.closePath();
          ctx.fill();
          if (tree.z > 0.4) ctx.stroke();
        }
      } else {
        // Broad desert juniper / acacia canopy clusters
        const clusters = [
          { ox: 0, oy: -th * 0.88, r: tw * 0.45, s: 1.0 },
          { ox: -tw * 0.35, oy: -th * 0.68, r: tw * 0.38, s: 0.8 },
          { ox: tw * 0.35, oy: -th * 0.68, r: tw * 0.38, s: 0.8 },
          { ox: 0, oy: -th * 0.55, r: tw * 0.48, s: 0.6 }
        ];

        for (let c of clusters) {
          const cSway = flexSway * (15 * c.s) * scale;
          ctx.beginPath();
          ctx.arc(c.ox + cSway, c.oy, c.r, 0, Math.PI * 2);
          ctx.fill();
          if (tree.z > 0.4) ctx.stroke();
        }
      }

      ctx.restore();
    }

    _drawSwayingGrass(ctx, x, y, height, tuft, swayAngle) {
      ctx.save();
      const alpha = Math.min(0.9, 0.28 + tuft.z * 0.65);
      ctx.strokeStyle = `rgba(55, 30, 14, ${alpha})`;
      ctx.lineWidth = Math.max(1.0 * this.dpr, 1.6 * tuft.z * this.dpr);

      for (let b = 0; b < tuft.blades; b++) {
        const bladeSpread = (b - tuft.blades / 2) * 2.5 * this.dpr;
        const bladeSway = (swayAngle * 18 * this.dpr) + Math.sin(this.stampedePhase * 1.5 + tuft.swayOffset + b * 0.4) * 3 * this.dpr;

        ctx.beginPath();
        ctx.moveTo(x + bladeSpread * 0.3, y);
        ctx.quadraticCurveTo(
          x + bladeSpread + bladeSway * 0.5,
          y - height * 0.55,
          x + bladeSpread * 1.6 + bladeSway,
          y - height
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    _drawEagle(ctx, x, y, span, bankAngle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(bankAngle);

      ctx.fillStyle = 'rgba(20, 7, 2, 0.92)';
      ctx.beginPath();
      // Eagle Body
      ctx.ellipse(0, 0, span * 0.15, span * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spread Wings
      ctx.beginPath();
      ctx.moveTo(-span * 0.9, -span * 0.1);
      ctx.quadraticCurveTo(-span * 0.4, -span * 0.35, 0, -span * 0.1);
      ctx.quadraticCurveTo(span * 0.4, -span * 0.35, span * 0.9, -span * 0.1);
      ctx.quadraticCurveTo(span * 0.5, span * 0.15, 0, span * 0.05);
      ctx.quadraticCurveTo(-span * 0.5, span * 0.15, -span * 0.9, -span * 0.1);
      ctx.fill();

      // Wingtip primary feathers
      ctx.strokeStyle = 'rgba(240, 130, 30, 0.4)';
      ctx.lineWidth = 1.0 * this.dpr;
      ctx.stroke();

      ctx.restore();
    }

    _drawWildlifeAnimal(ctx, x, y, scale, depth, animal, isStopped, speed) {
      switch (animal.species) {
        case 'giraffe':
          this._drawGiraffe(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'snake':
          this._drawSnake(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'mustang':
          this._drawMustang(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'pronghorn':
          this._drawPronghorn(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'elk':
          this._drawElk(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'ram':
          this._drawBighornRam(ctx, x, y, scale, depth, animal, isStopped);
          break;
        case 'bison':
        default:
          this._drawBison(ctx, x, y, scale, depth, animal, isStopped, speed);
          break;
      }
    }

    /* 1. AMERICAN BISON (BUFFALO) */
    _drawBison(ctx, x, y, scale, depth, b, isStopped, speed) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.42 + depth * 0.58);
      ctx.fillStyle = `rgba(26, 9, 3, ${alpha})`;
      ctx.strokeStyle = `rgba(245, 130, 30, ${0.25 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 18;
      const legPhase = isStopped ? 0 : b.gallopPhase;
      const grazeBob = isStopped ? Math.sin(b.grazePhase) : 0;

      // Leg swings
      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 12;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.85) * 12;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 14;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.85) * 14;

      ctx.beginPath();
      // Massive Shoulder Hump & Spine
      ctx.moveTo(-s * 0.7, -s * 0.1);
      ctx.quadraticCurveTo(-s * 0.4, -s * 0.85, 0, -s * 0.75); // Hump
      ctx.quadraticCurveTo(s * 0.5, -s * 0.45, s * 0.85, -s * 0.1); // Back slope
      ctx.lineTo(s * 0.85, s * 0.3); // Rump

      // Back legs
      ctx.lineTo(s * 0.65 + bLeg1 * 0.3, s * 0.85);
      ctx.lineTo(s * 0.45, s * 0.3);
      ctx.lineTo(s * 0.35 + bLeg2 * 0.3, s * 0.85);
      ctx.lineTo(s * 0.15, s * 0.3);

      // Belly
      ctx.lineTo(-s * 0.25, s * 0.35);

      // Front legs
      ctx.lineTo(-s * 0.45 + fLeg1 * 0.3, s * 0.9);
      ctx.lineTo(-s * 0.55, s * 0.3);
      ctx.lineTo(-s * 0.7 + fLeg2 * 0.3, s * 0.85);

      // Head: In grazing mode head reaches down towards ground (grazeBob)
      const headY = isStopped ? (s * 0.25 + grazeBob * s * 0.3) : s * 0.25;
      const snoutY = isStopped ? (s * 0.45 + grazeBob * s * 0.3) : -s * 0.1;
      const headTopY = isStopped ? (s * 0.05 + grazeBob * s * 0.3) : -s * 0.45;

      ctx.lineTo(-s * 0.85, headY);
      ctx.lineTo(-s * 1.05, snoutY);
      ctx.lineTo(-s * 0.95, headTopY);
      ctx.closePath();
      ctx.fill();
      if (depth > 0.35) ctx.stroke();

      // Curved Horns
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 215, 140, ${Math.min(1.0, depth * 1.2)})`;
      ctx.lineWidth = Math.max(1.2 * this.dpr, 2.2 * scale);
      ctx.moveTo(-s * 0.95, headTopY);
      ctx.quadraticCurveTo(-s * 1.15, headTopY - s * 0.3, -s * 0.95, headTopY - s * 0.35);
      ctx.stroke();

      ctx.restore();
    }

    /* 2. WILD MUSTANG (HORSE) */
    _drawMustang(ctx, x, y, scale, depth, h, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.42 + depth * 0.58);
      // Coat variants: Bay brown, Chestnut, Obsidian
      const coat = h.coatVariant === 0 ? `rgba(45, 16, 6, ${alpha})` : h.coatVariant === 1 ? `rgba(32, 10, 4, ${alpha})` : `rgba(18, 6, 2, ${alpha})`;
      ctx.fillStyle = coat;
      ctx.strokeStyle = `rgba(245, 150, 40, ${0.22 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 17;
      const legPhase = isStopped ? 0 : h.gallopPhase;
      const grazeBob = isStopped ? Math.sin(h.grazePhase) : 0;

      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 14;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.85) * 14;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 15;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.85) * 15;

      ctx.beginPath();
      // Athletic Horse Back & Barrel
      ctx.moveTo(-s * 0.5, -s * 0.35); // Base of neck
      ctx.quadraticCurveTo(0, -s * 0.42, s * 0.5, -s * 0.35); // Back
      ctx.quadraticCurveTo(s * 0.8, -s * 0.3, s * 0.95, 0); // Muscular rump
      ctx.lineTo(s * 0.9, s * 0.25);

      // Back legs (Slender athletic)
      ctx.lineTo(s * 0.75 + bLeg1 * 0.3, s * 0.88);
      ctx.lineTo(s * 0.55, s * 0.25);
      ctx.lineTo(s * 0.45 + bLeg2 * 0.3, s * 0.88);
      ctx.lineTo(s * 0.25, s * 0.2);

      // Lean belly
      ctx.lineTo(-s * 0.2, s * 0.2);

      // Front legs
      ctx.lineTo(-s * 0.35 + fLeg1 * 0.3, s * 0.9);
      ctx.lineTo(-s * 0.45, s * 0.2);
      ctx.lineTo(-s * 0.6 + fLeg2 * 0.3, s * 0.9);
      ctx.lineTo(-s * 0.65, s * 0.1);

      // Graceful Neck and Head
      if (isStopped) {
        // Grazing: Neck arches down to grass
        const neckDownY = s * 0.3 + grazeBob * s * 0.35;
        ctx.lineTo(-s * 0.95, neckDownY);
        ctx.lineTo(-s * 1.15, neckDownY + s * 0.15); // Muzzle on grass
        ctx.lineTo(-s * 0.95, neckDownY - s * 0.15); // Forehead
      } else {
        // Galloping: Neck held high with aerodynamic thrust
        ctx.lineTo(-s * 0.95, -s * 0.6); // Throat
        ctx.lineTo(-s * 1.2, -s * 0.75); // Snout
        ctx.lineTo(-s * 1.05, -s * 0.95); // Crown & ears
      }
      ctx.closePath();
      ctx.fill();
      if (depth > 0.35) ctx.stroke();

      // Flowing Windblown Mane & Tail
      ctx.beginPath();
      ctx.strokeStyle = `rgba(20, 5, 2, ${alpha})`;
      ctx.lineWidth = Math.max(1.5 * this.dpr, 2.5 * scale);
      // Tail
      ctx.moveTo(s * 0.95, 0);
      const tailWave = isStopped ? Math.sin(h.grazePhase * 3) * 3 : Math.sin(h.gallopPhase) * 6;
      ctx.quadraticCurveTo(s * 1.2, s * 0.2 + tailWave, s * 1.15, s * 0.7);
      ctx.stroke();

      ctx.restore();
    }

    /* 3. PRONGHORN ANTELOPE */
    _drawPronghorn(ctx, x, y, scale, depth, a, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.42 + depth * 0.58);
      ctx.fillStyle = `rgba(50, 20, 8, ${alpha})`;
      ctx.strokeStyle = `rgba(245, 160, 50, ${0.25 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 15;
      const legPhase = isStopped ? 0 : a.gallopPhase;
      const grazeBob = isStopped ? Math.sin(a.grazePhase) : 0;

      // High bounding leaps
      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 16;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.8) * 16;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 16;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.8) * 16;

      ctx.beginPath();
      // Compact, Slender Agile Body
      ctx.moveTo(-s * 0.4, -s * 0.3);
      ctx.quadraticCurveTo(0, -s * 0.35, s * 0.5, -s * 0.28);
      ctx.lineTo(s * 0.75, 0);

      // Back legs (Ultra-slender swift gazelle legs)
      ctx.lineTo(s * 0.6 + bLeg1 * 0.35, s * 0.92);
      ctx.lineTo(s * 0.45, s * 0.2);
      ctx.lineTo(s * 0.35 + bLeg2 * 0.35, s * 0.92);
      ctx.lineTo(s * 0.2, s * 0.15);

      // Belly
      ctx.lineTo(-s * 0.2, s * 0.15);

      // Front legs
      ctx.lineTo(-s * 0.3 + fLeg1 * 0.35, s * 0.92);
      ctx.lineTo(-s * 0.4, s * 0.15);
      ctx.lineTo(-s * 0.55 + fLeg2 * 0.35, s * 0.92);

      // Slender Neck & Head
      if (isStopped) {
        const neckDownY = s * 0.25 + grazeBob * s * 0.3;
        ctx.lineTo(-s * 0.8, neckDownY);
        ctx.lineTo(-s * 1.0, neckDownY + s * 0.1);
        ctx.lineTo(-s * 0.85, neckDownY - s * 0.15);
      } else {
        ctx.lineTo(-s * 0.8, -s * 0.65);
        ctx.lineTo(-s * 1.05, -s * 0.7);
        ctx.lineTo(-s * 0.9, -s * 0.95);
      }
      ctx.closePath();
      ctx.fill();

      // White flank rump patch
      ctx.fillStyle = `rgba(240, 220, 190, ${alpha * 0.85})`;
      ctx.beginPath();
      ctx.arc(s * 0.65, -s * 0.05, s * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Pronghorn Hooked Horns
      const hornBaseY = isStopped ? (s * 0.1 + grazeBob * s * 0.3) : -s * 0.95;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(20, 7, 2, ${alpha})`;
      ctx.lineWidth = Math.max(1.2 * this.dpr, 1.8 * scale);
      ctx.moveTo(-s * 0.85, hornBaseY);
      ctx.lineTo(-s * 0.82, hornBaseY - s * 0.35);
      ctx.lineTo(-s * 0.9, hornBaseY - s * 0.42); // Forward prong
      ctx.stroke();

      ctx.restore();
    }

    /* 4. MAJESTIC ELK (STAG) */
    _drawElk(ctx, x, y, scale, depth, elk, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.42 + depth * 0.58);
      ctx.fillStyle = `rgba(38, 14, 5, ${alpha})`;
      ctx.strokeStyle = `rgba(245, 130, 30, ${0.25 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 18;
      const legPhase = isStopped ? 0 : elk.gallopPhase;
      const grazeBob = isStopped ? Math.sin(elk.grazePhase) : 0;

      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 13;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.85) * 13;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 14;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.85) * 14;

      ctx.beginPath();
      // Proud Tall Body
      ctx.moveTo(-s * 0.5, -s * 0.4);
      ctx.quadraticCurveTo(0, -s * 0.48, s * 0.55, -s * 0.38);
      ctx.lineTo(s * 0.85, -s * 0.05);

      // Back legs
      ctx.lineTo(s * 0.7 + bLeg1 * 0.3, s * 0.9);
      ctx.lineTo(s * 0.5, s * 0.25);
      ctx.lineTo(s * 0.4 + bLeg2 * 0.3, s * 0.9);
      ctx.lineTo(s * 0.2, s * 0.2);

      // Belly
      ctx.lineTo(-s * 0.25, s * 0.25);

      // Front legs
      ctx.lineTo(-s * 0.4 + fLeg1 * 0.3, s * 0.92);
      ctx.lineTo(-s * 0.5, s * 0.2);
      ctx.lineTo(-s * 0.65 + fLeg2 * 0.3, s * 0.92);

      // Heavy maned chest & neck
      const crownY = isStopped ? (s * 0.15 + grazeBob * s * 0.35) : -s * 0.95;
      const snoutY = isStopped ? (s * 0.45 + grazeBob * s * 0.35) : -s * 0.75;
      ctx.lineTo(-s * 0.75, isStopped ? s * 0.3 : -s * 0.4);
      ctx.lineTo(-s * 1.1, snoutY);
      ctx.lineTo(-s * 0.95, crownY);
      ctx.closePath();
      ctx.fill();
      if (depth > 0.35) ctx.stroke();

      // Branching Grand Antler Crown
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 215, 150, ${Math.min(1.0, depth * 1.3)})`;
      ctx.lineWidth = Math.max(1.2 * this.dpr, 2.0 * scale);
      // Main beam
      ctx.moveTo(-s * 0.95, crownY);
      ctx.quadraticCurveTo(-s * 0.7, crownY - s * 0.6, -s * 0.4, crownY - s * 0.85);
      // Tines
      ctx.moveTo(-s * 0.85, crownY - s * 0.25);
      ctx.lineTo(-s * 1.05, crownY - s * 0.45); // Brow tine
      ctx.moveTo(-s * 0.75, crownY - s * 0.45);
      ctx.lineTo(-s * 0.85, crownY - s * 0.7); // Bez tine
      ctx.moveTo(-s * 0.55, crownY - s * 0.68);
      ctx.lineTo(-s * 0.6, crownY - s * 0.95); // Royal tine
      ctx.stroke();

      ctx.restore();
    }

    /* 5. DESERT BIGHORN RAM */
    _drawBighornRam(ctx, x, y, scale, depth, ram, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.42 + depth * 0.58);
      ctx.fillStyle = `rgba(32, 11, 4, ${alpha})`;
      ctx.strokeStyle = `rgba(245, 140, 40, ${0.25 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 15;
      const legPhase = isStopped ? 0 : ram.gallopPhase;
      const grazeBob = isStopped ? Math.sin(ram.grazePhase) : 0;

      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 11;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.85) * 11;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 12;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.85) * 12;

      ctx.beginPath();
      // Stout, Stocky Mountain Body
      ctx.moveTo(-s * 0.5, -s * 0.35);
      ctx.quadraticCurveTo(0, -s * 0.4, s * 0.5, -s * 0.3);
      ctx.lineTo(s * 0.75, 0);

      // Back legs
      ctx.lineTo(s * 0.6 + bLeg1 * 0.3, s * 0.85);
      ctx.lineTo(s * 0.45, s * 0.25);
      ctx.lineTo(s * 0.35 + bLeg2 * 0.3, s * 0.85);
      ctx.lineTo(s * 0.15, s * 0.2);

      // Belly
      ctx.lineTo(-s * 0.2, s * 0.25);

      // Front legs
      ctx.lineTo(-s * 0.35 + fLeg1 * 0.3, s * 0.85);
      ctx.lineTo(-s * 0.45, s * 0.2);
      ctx.lineTo(-s * 0.6 + fLeg2 * 0.3, s * 0.85);

      // Head
      const headY = isStopped ? (s * 0.2 + grazeBob * s * 0.3) : -s * 0.45;
      const snoutY = isStopped ? (s * 0.4 + grazeBob * s * 0.3) : -s * 0.35;
      ctx.lineTo(-s * 0.75, headY);
      ctx.lineTo(-s * 0.95, snoutY);
      ctx.lineTo(-s * 0.85, headY - s * 0.35);
      ctx.closePath();
      ctx.fill();
      if (depth > 0.35) ctx.stroke();

      // Massive Curled Spiral Horns
      const hornY = headY - s * 0.35;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 205, 130, ${Math.min(1.0, depth * 1.3)})`;
      ctx.lineWidth = Math.max(1.6 * this.dpr, 2.6 * scale);
      ctx.arc(-s * 0.7, hornY + s * 0.15, s * 0.35, Math.PI * 1.1, Math.PI * 2.8);
      ctx.stroke();

      ctx.restore();
    }

    /* 6. TOWERING GIRAFFE */
    _drawGiraffe(ctx, x, y, scale, depth, g, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.44 + depth * 0.56);
      ctx.fillStyle = `rgba(38, 16, 5, ${alpha})`;
      ctx.strokeStyle = `rgba(255, 180, 70, ${0.28 * depth})`;
      ctx.lineWidth = 1.0 * this.dpr;

      const s = scale * 19;
      const legPhase = isStopped ? 0 : g.gallopPhase;
      const grazeBob = isStopped ? Math.sin(g.grazePhase) : 0;

      // Stately, rhythmic long-legged gallop
      const fLeg1 = isStopped ? 0 : Math.sin(legPhase) * 16;
      const fLeg2 = isStopped ? 0 : Math.sin(legPhase + Math.PI * 0.85) * 16;
      const bLeg1 = isStopped ? 0 : Math.cos(legPhase) * 16;
      const bLeg2 = isStopped ? 0 : Math.cos(legPhase + Math.PI * 0.85) * 16;

      ctx.beginPath();
      // Sloping Back & Tall Shoulders
      ctx.moveTo(-s * 0.35, -s * 0.7); // High shoulders
      ctx.quadraticCurveTo(0, -s * 0.55, s * 0.5, -s * 0.35); // Steeply sloping spine
      ctx.lineTo(s * 0.65, -s * 0.05); // Rump

      // Long Stilted Back Legs
      ctx.lineTo(s * 0.55 + bLeg1 * 0.3, s * 1.15);
      ctx.lineTo(s * 0.4, 0);
      ctx.lineTo(s * 0.3 + bLeg2 * 0.3, s * 1.15);
      ctx.lineTo(s * 0.15, -s * 0.05);

      // Belly
      ctx.lineTo(-s * 0.15, -s * 0.05);

      // Long Stilted Front Legs
      ctx.lineTo(-s * 0.25 + fLeg1 * 0.3, s * 1.25);
      ctx.lineTo(-s * 0.35, -s * 0.1);
      ctx.lineTo(-s * 0.48 + fLeg2 * 0.3, s * 1.25);

      // Towering Long Neck
      // When stopped / grazing: neck reaches down towards tree/ground or stays arched high
      const neckAngle = isStopped ? (grazeBob * 0.35 + 0.3) : -0.15;
      const headX = -s * 0.75 + Math.sin(neckAngle) * s * 1.4;
      const headY = isStopped ? (-s * 0.85 + grazeBob * s * 0.9) : -s * 2.1;

      ctx.lineTo(-s * 0.52, -s * 0.8);
      ctx.lineTo(headX, headY);
      ctx.lineTo(headX - s * 0.28, headY + s * 0.15); // Snout
      ctx.lineTo(headX - s * 0.15, headY - s * 0.15); // Crown
      ctx.closePath();
      ctx.fill();
      if (depth > 0.35) ctx.stroke();

      // Giraffe Ossicones (Crown Horns)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 210, 110, ${Math.min(1.0, depth * 1.4)})`;
      ctx.lineWidth = Math.max(1.2 * this.dpr, 2.0 * scale);
      ctx.moveTo(headX - s * 0.08, headY - s * 0.12);
      ctx.lineTo(headX - s * 0.08, headY - s * 0.32);
      ctx.moveTo(headX - s * 0.16, headY - s * 0.1);
      ctx.lineTo(headX - s * 0.16, headY - s * 0.3);
      ctx.stroke();

      // Distinctive Giraffe Coat Patch Dots along neck & flanks
      if (depth > 0.35) {
        ctx.fillStyle = `rgba(215, 130, 45, ${0.45 * depth})`;
        for (let p = 0; p < 4; p++) {
          const py = -s * 0.6 - p * s * 0.32;
          const px = -s * 0.35 + (headX + s * 0.35) * (p / 4);
          ctx.beginPath();
          ctx.arc(px, py, 2.4 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    /* 7. SLITHERING DESERT SNAKE */
    _drawSnake(ctx, x, y, scale, depth, sn, isStopped) {
      ctx.save();
      ctx.translate(x, y);

      const alpha = Math.min(1.0, 0.45 + depth * 0.55);
      ctx.strokeStyle = `rgba(28, 14, 5, ${alpha})`;
      ctx.lineWidth = Math.max(2.4 * this.dpr, 4.5 * scale);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const length = 38 * scale;
      const wavePhase = sn.slitherPhase || 0;
      const numSegments = 16;

      ctx.beginPath();
      for (let i = 0; i < numSegments; i++) {
        const u = i / (numSegments - 1);
        const segX = (u - 0.5) * length;
        const segY = Math.sin(wavePhase + u * Math.PI * 3.5) * (4.5 * scale * (1 - u * 0.3));
        if (i === 0) {
          ctx.moveTo(segX, segY);
        } else {
          ctx.lineTo(segX, segY);
        }
      }
      ctx.stroke();

      // Snake Head & Golden Eyes
      const headX = -length * 0.5;
      const headY = Math.sin(wavePhase) * (4.5 * scale);
      ctx.fillStyle = `rgba(32, 16, 6, ${alpha})`;
      ctx.beginPath();
      ctx.arc(headX, headY, 2.8 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Slender flicking tongue while moving
      if (!isStopped && Math.sin(wavePhase * 2) > 0.4) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 1.0 * this.dpr;
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX - 6 * scale, headY);
        ctx.stroke();
      }

      ctx.restore();
    }

    /* 8. GIANT SAGUARO CACTUS */
    _drawSaguaroCactus(ctx, x, y, scale, cactus, swayAngle) {
      ctx.save();
      ctx.translate(x, y);

      const flexSway = swayAngle * cactus.flexibility;
      const ch = cactus.height * scale;
      const cw = Math.max(4.5 * this.dpr, 7.5 * scale);

      const alpha = Math.min(1.0, 0.46 + cactus.z * 0.54);
      ctx.fillStyle = `rgba(16, 28, 14, ${alpha})`;
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.18 * cactus.z})`;
      ctx.lineWidth = 0.9 * this.dpr;

      // 1. Central Saguaro Column (Rounded vertical trunk)
      const topSway = flexSway * 18 * scale;
      ctx.beginPath();
      ctx.moveTo(-cw * 0.5, 0);
      ctx.lineTo(-cw * 0.5 + topSway, -ch);
      ctx.arc(topSway, -ch, cw * 0.5, Math.PI, 0);
      ctx.lineTo(cw * 0.5, 0);
      ctx.closePath();
      ctx.fill();
      if (cactus.z > 0.35) ctx.stroke();

      // 2. Iconic Raised Saguaro Arms
      const armCount = cactus.arms || 2;
      for (let a = 0; a < armCount; a++) {
        const armSide = (a % 2 === 0) ? -1 : 1;
        const armY = -ch * (0.38 + a * 0.22);
        const armLength = 12 * scale;
        const armHeight = 14 * scale;
        const armSway = flexSway * (12 + a * 5) * scale;

        ctx.beginPath();
        ctx.moveTo(armSway, armY);
        ctx.lineTo(armSway + armSide * armLength, armY);
        ctx.lineTo(armSway + armSide * armLength, armY - armHeight);
        ctx.arc(armSway + armSide * armLength, armY - armHeight, cw * 0.35, 0, Math.PI, true);
        ctx.lineTo(armSway + armSide * (armLength - cw * 0.6), armY + cw * 0.6);
        ctx.lineTo(armSway, armY + cw * 0.6);
        ctx.closePath();
        ctx.fill();
        if (cactus.z > 0.35) ctx.stroke();
      }

      ctx.restore();
    }

    /* 9. DISTANT ARK VESSEL HORIZON BEACON */
    _drawArkVessel(ctx, cx, horizonY) {
      ctx.save();
      const arkW = 44 * this.dpr;
      const arkH = 14 * this.dpr;
      const arkX = cx;
      const arkY = horizonY - 2 * this.dpr;

      // Warm Golden Horizon Beacon Glow
      const beaconGrad = ctx.createRadialGradient(arkX, arkY - 4 * this.dpr, 2 * this.dpr, arkX, arkY - 4 * this.dpr, 36 * this.dpr);
      beaconGrad.addColorStop(0, 'rgba(255, 235, 160, 0.7)');
      beaconGrad.addColorStop(0.35, 'rgba(245, 150, 40, 0.3)');
      beaconGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beaconGrad;
      ctx.beginPath();
      ctx.arc(arkX, arkY - 4 * this.dpr, 36 * this.dpr, 0, Math.PI * 2);
      ctx.fill();

      // Distant Ark Hull Silhouette
      ctx.fillStyle = '#1e0c06';
      ctx.beginPath();
      ctx.moveTo(arkX - arkW * 0.5, arkY);
      ctx.lineTo(arkX - arkW * 0.4, arkY - arkH * 0.6);
      ctx.lineTo(arkX + arkW * 0.4, arkY - arkH * 0.6);
      ctx.lineTo(arkX + arkW * 0.5, arkY);
      ctx.closePath();
      ctx.fill();

      // Upper Cabin / Deck House
      ctx.fillStyle = '#140603';
      ctx.beginPath();
      ctx.rect(arkX - arkW * 0.28, arkY - arkH * 1.15, arkW * 0.56, arkH * 0.58);
      ctx.fill();

      // Pitched Roof
      ctx.beginPath();
      ctx.moveTo(arkX - arkW * 0.32, arkY - arkH * 1.15);
      ctx.lineTo(arkX, arkY - arkH * 1.55);
      ctx.lineTo(arkX + arkW * 0.32, arkY - arkH * 1.15);
      ctx.closePath();
      ctx.fill();

      // Luminous Lantern on the Ark Mast
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(arkX, arkY - arkH * 1.6, 2.2 * this.dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    _getRoundedRectPt(t, x, y, w, h, r) {
      t = ((t % 1) + 1) % 1;
      const straightW = w - 2 * r;
      const straightH = h - 2 * r;
      const cornerArc = 0.5 * Math.PI * r;
      const totalPerimeter = 2 * straightW + 2 * straightH + 4 * cornerArc;

      const topSeg = straightW / totalPerimeter;
      const trCornerSeg = cornerArc / totalPerimeter;
      const rightSeg = straightH / totalPerimeter;
      const brCornerSeg = cornerArc / totalPerimeter;
      const botSeg = straightW / totalPerimeter;
      const blCornerSeg = cornerArc / totalPerimeter;
      const leftSeg = straightH / totalPerimeter;
      const tlCornerSeg = cornerArc / totalPerimeter;

      let cur = 0;

      if (t < cur + topSeg) {
        const u = (t - cur) / topSeg;
        return { x: x + r + u * straightW, y: y };
      }
      cur += topSeg;

      if (t < cur + trCornerSeg) {
        const u = (t - cur) / trCornerSeg;
        const theta = -Math.PI / 2 + u * (Math.PI / 2);
        return { x: x + w - r + Math.cos(theta) * r, y: y + r + Math.sin(theta) * r };
      }
      cur += trCornerSeg;

      if (t < cur + rightSeg) {
        const u = (t - cur) / rightSeg;
        return { x: x + w, y: y + r + u * straightH };
      }
      cur += rightSeg;

      if (t < cur + brCornerSeg) {
        const u = (t - cur) / brCornerSeg;
        const theta = 0 + u * (Math.PI / 2);
        return { x: x + w - r + Math.cos(theta) * r, y: y + h - r + Math.sin(theta) * r };
      }
      cur += brCornerSeg;

      if (t < cur + botSeg) {
        const u = (t - cur) / botSeg;
        return { x: x + w - r - u * straightW, y: y + h };
      }
      cur += botSeg;

      if (t < cur + blCornerSeg) {
        const u = (t - cur) / blCornerSeg;
        const theta = Math.PI / 2 + u * (Math.PI / 2);
        return { x: x + r + Math.cos(theta) * r, y: y + h - r + Math.sin(theta) * r };
      }
      cur += blCornerSeg;

      if (t < cur + leftSeg) {
        const u = (t - cur) / leftSeg;
        return { x: x, y: y + h - r - u * straightH };
      }
      cur += leftSeg;

      const u = (t - cur) / tlCornerSeg;
      const theta = Math.PI + u * (Math.PI / 2);
      return { x: x + r + Math.cos(theta) * r, y: y + r + Math.sin(theta) * r };
    }
  }

  const instance = new KineticEngine();
  return instance;
});
