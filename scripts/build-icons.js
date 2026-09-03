import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

function getNomadIconSVG(size = 512, isMaskable = false) {
  // Center is (256, 256) on a 512x512 canvas
  // Safe circle for maskable has radius = 204.8px (diameter = 409.6px)
  // Our visual center is placed at (256, 222) with max radius 162px (outer radar)
  // Text and HUD pills are placed at y=362..374 with max radius 164px from (256, 256).
  // Everything is cleanly buffered by at least 40px inside the mask safe zone.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#00d4ff" />
      </linearGradient>
      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff7b00" />
        <stop offset="100%" stop-color="#ff3b00" />
      </linearGradient>
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="radarFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- True Deep Black Obsidian Bleed Canvas -->
    <rect width="512" height="512" fill="#000000" />
    
    <!-- Concentric Neon Radar Telemetry Rings -->
    <g filter="url(#radarFilter)">
      <!-- Outer Dash Ring -->
      <circle cx="256" cy="222" r="158" fill="none" stroke="#00d4ff" stroke-width="2.6" stroke-opacity="0.25" stroke-dasharray="10 7" />
      <!-- Inner Precision Ring -->
      <circle cx="256" cy="222" r="108" fill="none" stroke="#00d4ff" stroke-width="2.8" stroke-opacity="0.40" />
      <!-- Core Targeting Ring -->
      <circle cx="256" cy="222" r="54" fill="none" stroke="#00d4ff" stroke-width="1.8" stroke-opacity="0.20" />
      
      <!-- Telemetry Crosshair Ticks -->
      <line x1="256" y1="56" x2="256" y2="70" stroke="#00d4ff" stroke-width="2.5" stroke-opacity="0.6" stroke-linecap="round" />
      <line x1="256" y1="374" x2="256" y2="388" stroke="#00d4ff" stroke-width="2.5" stroke-opacity="0.3" stroke-linecap="round" />
      <line x1="90" y1="222" x2="104" y2="222" stroke="#00d4ff" stroke-width="2.5" stroke-opacity="0.6" stroke-linecap="round" />
      <line x1="408" y1="222" x2="422" y2="222" stroke="#00d4ff" stroke-width="2.5" stroke-opacity="0.6" stroke-linecap="round" />
    </g>
    
    <!-- Navigation Chevron with Dynamic 45-deg Heading -->
    <g transform="translate(256, 222) rotate(-45)" filter="url(#neonGlow)">
      <!-- Left Wing (Cyan) -->
      <polygon points="0,-102 -70,80 0,32" fill="url(#cyanGrad)" />
      <!-- Right Wing (Racing Orange) -->
      <polygon points="0,-102 70,80 0,32" fill="url(#orangeGrad)" />
      <!-- Center Ridge Divider Line (Pure Crisp White) -->
      <line x1="0" y1="-102" x2="0" y2="32" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
      <!-- Forward Beacon Tip -->
      <circle cx="0" cy="-100" r="3.2" fill="#ffffff" />
    </g>
    
    <!-- "NOMAD" Hero Title Typography (Safe-Zone Bounded) -->
    <g>
      <!-- Green Accent Status Indicators (Snug to text) -->
      <rect x="134" y="356" width="16" height="8" rx="4" fill="#4cd964" />
      <rect x="362" y="356" width="16" height="8" rx="4" fill="#4cd964" />
      
      <text x="256" y="370" 
            text-anchor="middle" 
            fill="#ffffff" 
            font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            font-size="44" 
            font-weight="900" 
            letter-spacing="5">NOMAD</text>
    </g>
  </svg>`;
}

const iconsDir = path.resolve('icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const targets = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-192.png', size: 192, maskable: true },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'nomad_icon_192x192.png', size: 192, maskable: false },
  { file: 'nomad_icon_512x512.png', size: 512, maskable: false }
];

console.log('Rendering NOMAD Safe-Zone compliant icons...');

for (const target of targets) {
  const svg = getNomadIconSVG(target.size, target.maskable);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: target.size } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const dest = path.join(iconsDir, target.file);
  fs.writeFileSync(dest, pngBuffer);
  console.log(`✓ Generated ${target.file} (${target.size}x${target.size}) -> ${pngBuffer.length} bytes`);
}

console.log('All icons built successfully!');
