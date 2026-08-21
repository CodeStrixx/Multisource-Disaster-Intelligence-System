/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Tactical Dark Theme (Ops-Center with High-Contrast Text) ──
        ops: {
          // Backgrounds
          'bg':         '#081425',   // deep obsidian canvas
          'surface':    '#040e1f',   // lowest panel surface
          'low':        '#111c2d',   // low card surface
          'container':  '#152031',   // standard container
          'high':       '#1f2a3c',   // container high
          'highest':    '#2a3548',   // container highest / surface variant
          // High-Visibility Text Tokens
          'text':       '#f8fafc',   // ultra-crisp white/slate-50 primary text
          'muted':      '#cbd5e1',   // high-contrast slate-300 secondary text (addresses, body, notes)
          'outline':    '#94a3b8',   // crisp slate-400 metadata labels & coordinates
          'divider':    '#334155',   // clear slate-700 panel borders
          'tint':       '#93c5fd',   // sky-300 primary accent tint
        },
        // ── Light Theme (Clean Professional) ──
        day: {
          'bg':         '#f5f8ff',
          'surface':    '#ffffff',
          'low':        '#eef2f9',
          'container':  '#e2e8f0',
          'high':       '#cbd5e1',
          'text':       '#0f172a',
          'muted':      '#334155',   // slate-700 readable secondary text
          'outline':    '#64748b',   // slate-500 metadata
          'divider':    '#cbd5e1',
          'tint':       '#2563eb',
        },
        // ── Semantic Status Accents ──
        status: {
          'critical':   '#ef4444',
          'critical-bg':'#93000a',
          'critical-muted': '#fca5a5',
          'warning':    '#f59e0b',
          'warning-bg': '#78350f',
          'warning-muted': '#fde68a',
          'info':       '#38bdf8',
          'info-bg':    '#0c4a6e',
          'success':    '#22c55e',
          'success-bg': '#14532d',
          'success-muted': '#86efac',
        },
        // ── Legacy tokens ──
        brand: {
          900: '#123B5D',
          700: '#155A85',
          500: '#1976A8',
          100: '#E7F3F9',
          50:  '#F5FAFC',
        },
        risk: {
          low:      '#18864B',
          moderate: '#C88719',
          high:     '#D65A1F',
          critical: '#C62828',
        },
        textMain: {
          primary:   '#f8fafc',
          secondary: '#cbd5e1',
          muted:     '#94a3b8',
        },
        surface: {
          bg:     '#081425',
          card:   '#152031',
          border: '#334155',
        }
      },
      fontFamily: {
        'mono':  ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        'sans':  ['"Hanken Grotesk"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'sm':   '6px',
        'md':   '10px',
        'lg':   '14px',
        'xl':   '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm':     '0 1px 3px rgba(15,23,42,.08)',
        'md':     '0 4px 12px rgba(15,23,42,.10)',
        'lg':     '0 10px 30px rgba(15,23,42,.12)',
        'ops':    '0 4px 24px rgba(0,0,0,.55)',
        'glow-red': '0 0 12px rgba(239,68,68,.35)',
        'glow-blue':'0 0 12px rgba(59,130,246,.30)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline':   'scanlineMove 8s linear infinite',
        'fadeIn':     'fadeIn 0.3s ease-out forwards',
        'slideUp':    'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        scanlineMove: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
