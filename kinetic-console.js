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
      this.mode = 'starfield'; // 'starfield' | 'underwater'

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

      // Bound event listeners
      this._onResize = this._onResize.bind(this);
      this._onPointerDown = this._onPointerDown.bind(this);
      this._onPointerMove = this._onPointerMove.bind(this);
      this._onPointerUp = this._onPointerUp.bind(this);
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
      this.mode = mode === 'underwater' ? 'underwater' : 'starfield';
      if (this.mode === 'underwater') {
        this._initUnderwater();
      } else {
        this._initStarfield();
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
      this.bubbles = [];
      for (let i = 0; i < this.numBubbles; i++) {
        this.bubbles.push({
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          size: 1.5 + Math.random() * 6.5,
          speedY: 0.8 + Math.random() * 2.2,
          wobbleSpeed: 0.03 + Math.random() * 0.05,
          wobbleOffset: Math.random() * Math.PI * 2,
          opacity: 0.25 + Math.random() * 0.55
        });
      }

      this.fishes = [];
      const fishColors = ['#f59e0b', '#06b6d4', '#ec4899', '#3b82f6', '#10b981', '#fbbf24'];
      for (let i = 0; i < this.numFishes; i++) {
        this.fishes.push({
          x: Math.random() * 1000,
          y: 40 + Math.random() * 500,
          speed: (0.4 + Math.random() * 1.4) * (Math.random() > 0.5 ? 1 : -1),
          scale: 0.5 + Math.random() * 0.75,
          color: fishColors[Math.floor(Math.random() * fishColors.length)],
          finPhase: Math.random() * Math.PI * 2,
          depth: 0.3 + Math.random() * 0.7
        });
      }
    }

    _bindEvents() {
      window.addEventListener('resize', this._onResize, { passive: true });

      if (this.canvas) {
        this.canvas.addEventListener('pointerdown', this._onPointerDown);
        window.addEventListener('pointermove', this._onPointerMove);
        window.addEventListener('pointerup', this._onPointerUp);
        window.addEventListener('pointercancel', this._onPointerUp);
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
      if (this.mode === 'underwater') {
        this._renderUnderwater();
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
      for (let i = 0; i < this.fishes.length; i++) {
        const fish = this.fishes[i];
        fish.x += (fish.speed * 1.5 * this.dpr) + (Math.sin(headingRad) * speedOffset * fish.depth);
        fish.finPhase += 0.12;

        if (fish.x > w + 60) fish.x = -60;
        if (fish.x < -60) fish.x = w + 60;

        const fy = fish.y + Math.sin(fish.finPhase * 0.5) * 8 * this.dpr;
        const scale = fish.scale * this.dpr;
        const dir = fish.speed > 0 ? 1 : -1;

        ctx.save();
        ctx.translate(fish.x, fy);
        ctx.scale(dir * scale, scale);
        ctx.fillStyle = fish.color;
        ctx.globalAlpha = fish.depth * 0.85;

        // Fish Body Oval
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fish Tail with realistic flutter
        const tailWag = Math.sin(fish.finPhase) * 4;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-24, -8 + tailWag);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-24, 8 + tailWag);
        ctx.closePath();
        ctx.fill();

        // Eye Dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, -2, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(9, -2, 1.1, 0, Math.PI * 2);
        ctx.fill();

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
  }

  const instance = new KineticEngine();
  return instance;
});
