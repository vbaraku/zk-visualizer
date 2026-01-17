/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dual-tone design system colors
        primary: '#137fec',
        'accent-cyan': '#22d3ee',

        // Light side (notebook panel)
        'background-light': '#f6f7f8',
        'text-light-primary': '#0d141b',
        'text-light-secondary': '#4c739a',

        // Dark side (canvas panel)
        'background-dark-canvas': '#0f172a',
        background: '#0F172A', // Keep for compatibility
        surface: '#1e293b',
        'dark-border': '#334155',
        'dark-border-light': '#475569',
        'text-dark-primary': '#f1f5f9',
        'text-dark-secondary': '#94a3b8',

        // Legacy colors (keep for backward compatibility during migration)
        'border-subtle': '#334155', // slate-700
        'text-primary': '#F8FAFC',   // slate-50
        'text-secondary': '#94A3B8', // slate-400
        'accent-primary': '#22d3ee',   // Updated to cyan
        'accent-secondary': '#8B5CF6', // purple-500

        // Signal colors (used throughout the app)
        'signal-private': '#FBBF24',  // amber-400
        'signal-public': '#22C55E',   // green-500
        'signal-processing': '#3B82F6', // blue-500
        'signal-error': '#EF4444',    // red-500
        'signal-success': '#22C55E',  // green-500
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
