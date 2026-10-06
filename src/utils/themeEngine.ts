// Theme Engine: Calculates responsive harmonic palettes and dynamically updates CSS variables
// across the entire application in real-time.

export interface ThemePalette {
  950: string;
  900: string;
  850: string;
  800: string;
  700: string;
  600: string;
  500: string;
  400: string;
  300: string;
}

// Convert HEX to HSL
function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Preset color maps for perfect luxury tone
export const PRESET_THEMES: Record<string, ThemePalette> = {
  // New Default: Azul Safira Real / Oceano VIP
  blue: {
    950: '#030a17',
    900: '#07152b',
    850: '#0a1d3d',
    800: '#0e2954',
    700: '#143c7b',
    600: '#1b56a8',
    500: '#0284c7',
    400: '#38bdf8',
    300: '#7dd3fc'
  },
  // Classic Ruby
  ruby: {
    950: '#0d0407',
    900: '#17050c',
    850: '#220713',
    800: '#380a1c',
    700: '#5c0d29',
    600: '#881337',
    500: '#be123c',
    400: '#e11d48',
    300: '#fda4af'
  },
  // Black Onyx
  black: {
    950: '#040404',
    900: '#0a0a0a',
    850: '#121212',
    800: '#1c1c1c',
    700: '#2d2d2d',
    600: '#444444',
    500: '#666666',
    400: '#999999',
    300: '#cccccc'
  },
  // Emerald
  emerald: {
    950: '#020d09',
    900: '#041710',
    850: '#082319',
    800: '#0c3325',
    700: '#114f39',
    600: '#10b981',
    500: '#059669',
    400: '#34d399',
    300: '#6ee7b7'
  },
  // Purple Amethyst
  purple: {
    950: '#0a0312',
    900: '#140624',
    850: '#1e0936',
    800: '#2c0d4f',
    700: '#46147d',
    600: '#6d28d9',
    500: '#9333ea',
    400: '#c084fc',
    300: '#e9d5ff'
  }
};

export function generateShadesFromHex(baseHex: string): ThemePalette {
  if (!baseHex || !baseHex.startsWith('#')) {
    return PRESET_THEMES.blue;
  }

  // Check known presets first
  const cleanHex = baseHex.toLowerCase();
  if (cleanHex === '#07152b' || cleanHex === '#030a17' || cleanHex === '#0b192c') return PRESET_THEMES.blue;
  if (cleanHex === '#0d0407' || cleanHex === '#17050c') return PRESET_THEMES.ruby;
  if (cleanHex === '#070707' || cleanHex === '#040404') return PRESET_THEMES.black;
  if (cleanHex === '#041710' || cleanHex === '#020d09') return PRESET_THEMES.emerald;
  if (cleanHex === '#140624' || cleanHex === '#0a0312') return PRESET_THEMES.purple;

  const [h, s] = hexToHsl(baseHex);
  const safeSaturation = Math.max(s, 25);

  return {
    950: hslToHex(h, safeSaturation, 4),
    900: hslToHex(h, safeSaturation, 8),
    850: hslToHex(h, safeSaturation, 12),
    800: hslToHex(h, safeSaturation, 17),
    700: hslToHex(h, safeSaturation, 25),
    600: hslToHex(h, safeSaturation, 36),
    500: hslToHex(h, safeSaturation, 48),
    400: hslToHex(h, safeSaturation, 62),
    300: hslToHex(h, safeSaturation, 76)
  };
}

export function applyThemeToDocument(
  themeBgColor?: string,
  themeTextColor?: string,
  themePrimaryColor?: string
) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const bg = themeBgColor || '#07152b';
  const shades = generateShadesFromHex(bg);

  // 1. Update all ruby-* variables in root so all Tailwind bg-ruby-*, border-ruby-* change dynamically!
  root.style.setProperty('--color-ruby-950', shades[950]);
  root.style.setProperty('--color-ruby-900', shades[900]);
  root.style.setProperty('--color-ruby-850', shades[850]);
  root.style.setProperty('--color-ruby-800', shades[800]);
  root.style.setProperty('--color-ruby-700', shades[700]);
  root.style.setProperty('--color-ruby-600', shades[600]);
  root.style.setProperty('--color-ruby-500', shades[500]);
  root.style.setProperty('--color-ruby-400', shades[400]);
  root.style.setProperty('--color-ruby-300', shades[300]);

  // Also set custom theme variables for background and cards
  root.style.setProperty('--theme-bg', shades[950]);
  root.style.setProperty('--theme-surface', shades[900]);
  root.style.setProperty('--theme-border', shades[800]);
  root.style.setProperty('--theme-accent', shades[500]);
  root.style.setProperty('--theme-glass-panel', `rgba(${parseInt(shades[900].slice(1, 3), 16)}, ${parseInt(shades[900].slice(3, 5), 16)}, ${parseInt(shades[900].slice(5, 7), 16)}, 0.82)`);
  root.style.setProperty('--theme-glass-card', `rgba(${parseInt(shades[850].slice(1, 3), 16)}, ${parseInt(shades[850].slice(3, 5), 16)}, ${parseInt(shades[850].slice(5, 7), 16)}, 0.55)`);

  // 2. Primary button styling based on themePrimaryColor
  const primary = (themePrimaryColor || 'blue').toLowerCase();
  let primaryFrom = '#0284c7';
  let primaryTo = '#0369a1';
  let primaryHoverFrom = '#38bdf8';
  let primaryHoverTo = '#0284c7';
  let primaryGlow = 'rgba(2, 132, 199, 0.45)';

  if (primary === 'gold') {
    primaryFrom = '#f59e0b';
    primaryTo = '#d97706';
    primaryHoverFrom = '#fbbf24';
    primaryHoverTo = '#f59e0b';
    primaryGlow = 'rgba(245, 158, 11, 0.45)';
  } else if (primary === 'ruby') {
    primaryFrom = '#be123c';
    primaryTo = '#881337';
    primaryHoverFrom = '#e11d48';
    primaryHoverTo = '#be123c';
    primaryGlow = 'rgba(225, 29, 72, 0.45)';
  } else if (primary === 'emerald') {
    primaryFrom = '#059669';
    primaryTo = '#047857';
    primaryHoverFrom = '#10b981';
    primaryHoverTo = '#059669';
    primaryGlow = 'rgba(16, 185, 129, 0.45)';
  } else if (primary === 'purple') {
    primaryFrom = '#9333ea';
    primaryTo = '#7e22ce';
    primaryHoverFrom = '#a855f7';
    primaryHoverTo = '#9333ea';
    primaryGlow = 'rgba(147, 51, 234, 0.45)';
  }

  root.style.setProperty('--theme-primary-from', primaryFrom);
  root.style.setProperty('--theme-primary-to', primaryTo);
  root.style.setProperty('--theme-primary-hover-from', primaryHoverFrom);
  root.style.setProperty('--theme-primary-hover-to', primaryHoverTo);
  root.style.setProperty('--theme-primary-glow', primaryGlow);

  // 3. Body element colors
  document.body.style.backgroundColor = shades[950];
  if (themeTextColor) {
    document.body.style.color = themeTextColor;
    root.style.setProperty('--theme-text-color', themeTextColor);
  }
}
