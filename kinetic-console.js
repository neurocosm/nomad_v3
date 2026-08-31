/**
 * Nomad Roadtrip - Kinetic Sensory Starfield Console
 * Decoupled High-Performance Canvas & Physics Engine
 * Warm Amber / Cosmic Spectrum Sensory Visualizer & Fidget Spinner
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

  // Warm Amber & Cosmic Spectrum Colors
  const PALETTE = {
    bgTop: '#080402',
    bgBottom: '#140803',
    nebulaAmber: 'rgba(251, 133, 0, 0.08)',
    nebulaRose: 'rgba(255, 123, 84, 0.06)',
    ringInner: 'rgba(255, 183, 3, 0.45)',
    ringMid: 'rgba(251, 133, 0, 0.3)',
    ringOuter: 'rgba(255, 232, 214, 0.2)',
    starColors: [
      '#ffe8d6', // Champagne White
      '#ffb703', // Amber Gold
      '#fb8500', // Solar Amber
      '#ffdd00', // Bright Warm Yellow
      '#ff7b54', // Cosmic Terracotta Rose
      '#ffffff'  // Pure Starlight
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

      // Fidget & Inertia Physics
      this.manualRotation = 0;
      this.angularVelocity = 0;
      this.isDragging = false;
      this.lastPointerX = 0;
      this.lastPointerY = 0;
      this.lastPointerAngle = 0;
      this.dragFriction = 0.94;
      this.returnSpringStrength = 0.05;

      // Ripple shockwaves
      this.ripples = [];

      // Starfield population (3D spherical coordinates)
      this.numStars = 320;
      this.stars = [];

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
      this._bindEvents();
      this._updateDimensions();
    }

    _initStarfield() {
      this.stars = [];
      for (let i = 0; i < this.numStars; i++) {
        // Random spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 180 + Math.random() * 650;
        const color = PALETTE.starColors[Math.floor(Math.random() * PALETTE.starColors.length)];

        this.stars.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta),
          z: radius * Math.cos(phi),
          baseSize: 0.8 + Math.random() * 2.2,
          color: color,
          pulseSpeed: 0.02 + Math.random() * 0.04,
          pulseOffset: Math.random() * Math.PI * 2
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

      // Spawn a subtle celestial ripple at touch coordinates
      const rect = this.canvas.getBoundingClientRect();
      const tx = (e.clientX - rect.left) * this.dpr;
      const ty = (e.clientY - rect.top) * this.dpr;
      this.createShockwave(tx, ty);
    }

    _onPointerMove(e) {
      if (!this.isDragging || !this.isVisible) return;
      const currentAngle = this._getAngleFromCenter(e.clientX, e.clientY);
      let deltaAngle = currentAngle - this.lastPointerAngle;

      // Handle wraparound
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
      this.ripples.push({
        x: x !== undefined ? x : this.centerX,
        y: y !== undefined ? y : this.centerY,
        radius: 10,
        maxRadius: Math.max(this.width, this.height) * 0.7 * this.dpr,
        opacity: 0.9,
        color: PALETTE.starColors[Math.floor(Math.random() * 3)]
      });
    }

    updateTelemetry({ speedMph, heading, altitude, pitch }) {
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

    _loop(timestamp) {
      if (!this.isActive || !this.isVisible) return;

      this._updatePhysics();
      this._render();

      this.rafId = requestAnimationFrame(this._loop);
    }

    _updatePhysics() {
      // Smooth speed interpolation
      this.speedMph += (this.targetSpeedMph - this.speedMph) * 0.08;

      // Heading interpolation
      let diffHeading = (this.targetHeading - this.heading);
      while (diffHeading < -180) diffHeading += 360;
      while (diffHeading > 180) diffHeading -= 360;
      this.heading += diffHeading * 0.06;

      // Free manual rotation physics (fidget spinner momentum)
      if (!this.isDragging) {
        this.manualRotation += this.angularVelocity;
        this.angularVelocity *= this.dragFriction;

        // When moving (> 3 mph), gently snap back to vehicle forward direction
        if (this.speedMph > 3) {
          this.manualRotation *= (1 - this.returnSpringStrength);
        }
      }

      // Orbital rings animation
      const baseRotationSpeed = 0.003 + (this.speedMph / 100) * 0.015;
      this.ringRotation += baseRotationSpeed;
      this.pulsePhase += 0.035;

      // Update Shockwaves
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.radius += 5.5 * this.dpr;
        r.opacity *= 0.94;
        if (r.opacity < 0.01 || r.radius >= r.maxRadius) {
          this.ripples.splice(i, 1);
        }
      }
    }

    _render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const cx = this.centerX;
      const cy = this.centerY;

      // Clear & Background Cosmic Gradient
      ctx.clearRect(0, 0, w, h);

      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h) * 0.8);
      bgGrad.addColorStop(0, '#1c0c04');
      bgGrad.addColorStop(0.5, '#0e0602');
      bgGrad.addColorStop(1, '#050201');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Warm Nebula Clouds
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const nebGrad1 = ctx.createRadialGradient(cx + Math.sin(this.ringRotation * 0.5) * 80, cy - 40, 10, cx, cy, w * 0.55);
      nebGrad1.addColorStop(0, PALETTE.nebulaAmber);
      nebGrad1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, w, h);

      const nebGrad2 = ctx.createRadialGradient(cx - 60, cy + Math.cos(this.ringRotation * 0.4) * 60, 10, cx, cy, w * 0.5);
      nebGrad2.addColorStop(0, PALETTE.nebulaRose);
      nebGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Render 3D Perspective Orbital & Telemetry Rings
      this._renderOrbitalRings(ctx, cx, cy);

      // Render 3D Velocity-Coupled Starfield
      this._renderStarfield(ctx, cx, cy);

      // Render Shockwave Ripples
      this._renderRipples(ctx);
    }

    _renderOrbitalRings(ctx, cx, cy) {
      ctx.save();
      const tilt = 0.52; // 3D oblique perspective
      const headingRad = (this.heading * Math.PI) / 180;
      const totalAngle = this.ringRotation + this.manualRotation + headingRad;

      // Center glowing amber core
      const corePulse = 14 + Math.sin(this.pulsePhase) * 2.5;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * this.dpr);
      coreGrad.addColorStop(0, 'rgba(255, 183, 3, 0.6)');
      coreGrad.addColorStop(0.6, 'rgba(251, 133, 0, 0.25)');
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * this.dpr, 0, Math.PI * 2);
      ctx.fill();

      // Ring 1: Inner Segmented Radar Ring
      const r1 = Math.min(cx, cy) * 0.36;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r1, r1 * tilt, totalAngle * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = PALETTE.ringInner;
      ctx.lineWidth = 1.6 * this.dpr;
      ctx.setLineDash([8 * this.dpr, 14 * this.dpr]);
      ctx.stroke();

      // Ring 2: Mid Dynamic Orbit with Telemetry Nodes
      const r2 = Math.min(cx, cy) * 0.62;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r2, r2 * tilt, -totalAngle * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = PALETTE.ringMid;
      ctx.lineWidth = 1.2 * this.dpr;
      ctx.setLineDash([18 * this.dpr, 26 * this.dpr]);
      ctx.stroke();

      // Orbiting Telemetry Nodes (Pulsars)
      const numNodes = 3;
      for (let i = 0; i < numNodes; i++) {
        const nodeAngle = totalAngle * 0.6 + (i * Math.PI * 2) / numNodes;
        const nx = cx + r2 * Math.cos(nodeAngle);
        const ny = cy + r2 * tilt * Math.sin(nodeAngle);

        ctx.beginPath();
        ctx.arc(nx, ny, 3.5 * this.dpr, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb703';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 7 * this.dpr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
        ctx.lineWidth = 1 * this.dpr;
        ctx.setLineDash([]);
        ctx.stroke();
      }

      // Ring 3: Outer Horizon Ring with Cardinal Ticks
      const r3 = Math.min(cx, cy) * 0.86;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r3, r3 * tilt, 0, 0, Math.PI * 2);
      ctx.strokeStyle = PALETTE.ringOuter;
      ctx.lineWidth = 1.4 * this.dpr;
      ctx.setLineDash([]);
      ctx.stroke();

      // 4 Cardinal Axis Ticks on Outer Ring
      for (let a = 0; a < 4; a++) {
        const tickAngle = (a * Math.PI) / 2 + totalAngle * 0.2;
        const tx1 = cx + (r3 - 6 * this.dpr) * Math.cos(tickAngle);
        const ty1 = cy + (r3 - 6 * this.dpr) * tilt * Math.sin(tickAngle);
        const tx2 = cx + (r3 + 6 * this.dpr) * Math.cos(tickAngle);
        const ty2 = cy + (r3 + 6 * this.dpr) * tilt * Math.sin(tickAngle);

        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.strokeStyle = '#ffe8d6';
        ctx.lineWidth = 1.8 * this.dpr;
        ctx.stroke();
      }

      ctx.restore();
    }

    _renderStarfield(ctx, cx, cy) {
      const fov = 340 * this.dpr;
      const speedFactor = Math.max(0.6, this.speedMph * 0.12);
      const warpStreakLength = Math.min(65 * this.dpr, this.speedMph * 1.1 * this.dpr);
      const rotationAngle = (this.heading * Math.PI) / 180 + this.manualRotation;

      const cosR = Math.cos(rotationAngle);
      const sinR = Math.sin(rotationAngle);

      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];

        // Move stars forward along Z axis based on velocity
        star.z -= speedFactor * (1.2 * this.dpr);
        if (star.z < 10) {
          star.z = 700;
          star.x = (Math.random() * 2 - 1) * 600;
          star.y = (Math.random() * 2 - 1) * 600;
        }

        // Apply angular rotation around Center Z
        const rotX = star.x * cosR - star.y * sinR;
        const rotY = star.x * sinR + star.y * cosR;

        // 3D Perspective projection
        const scale = fov / (fov + star.z);
        const px = cx + rotX * scale;
        const py = cy + rotY * scale;

        // Twinkle factor
        const twinkle = 0.7 + 0.3 * Math.sin(this.pulsePhase * star.pulseSpeed * 20 + star.pulseOffset);
        const alpha = Math.min(1, scale * 1.5) * twinkle;
        const size = star.baseSize * scale * this.dpr;

        if (px < -50 || px > this.canvas.width + 50 || py < -50 || py > this.canvas.height + 50) {
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        if (warpStreakLength > 2) {
          // Speed Warp Filament / Streak
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
          ctx.lineWidth = Math.max(1, size * 0.9);
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Point Star with Starlight Glow
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }

        ctx.restore();
      }
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
        ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
        ctx.globalAlpha = r.opacity * 0.6;
        ctx.lineWidth = 1.2 * this.dpr;
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Singleton Instance
  const instance = new KineticEngine();
  return instance;
});
