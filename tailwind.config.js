/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#123B5D",
          700: "#155A85",
          500: "#1976A8",
          100: "#E7F3F9",
          50: "#F5FAFC",
        },
        risk: {
          low: "#18864B",
          moderate: "#C88719",
          high: "#D65A1F",
          critical: "#C62828",
        },
        semantic: {
          success: "#18864B",
          warning: "#C88719",
          error: "#C62828",
          info: "#1976A8",
          neutral: "#64748B",
        },
        surface: {
          bg: "#F7F9FB",
          card: "#FFFFFF",
          border: "#D9E1E8",
        },
        textMain: {
          primary: "#17212B",
          secondary: "#52606D",
          muted: "#73808C",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(15,23,42,.08)',
        'md': '0 4px 12px rgba(15,23,42,.10)',
        'lg': '0 10px 30px rgba(15,23,42,.12)',
      }
    },
  },
  plugins: [],
}
