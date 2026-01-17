/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: '#0F172A', // slate-900
        surface: '#1E293B',    // slate-800

        // Border colors
        'border-subtle': '#334155', // slate-700

        // Text colors
        'text-primary': '#F8FAFC',   // slate-50
        'text-secondary': '#94A3B8', // slate-400

        // Accent colors
        'accent-primary': '#6366F1',   // indigo-500
        'accent-secondary': '#8B5CF6', // purple-500

        // Signal colors (used throughout the app)
        'signal-private': '#FBBF24',  // amber-400
        'signal-public': '#22C55E',   // green-500
        'signal-processing': '#3B82F6', // blue-500
        'signal-error': '#EF4444',    // red-500
        'signal-success': '#22C55E',  // green-500
      },
    },
  },
  plugins: [],
}
