/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pb: {
          base:      '#09090B',
          surface:   '#111114',
          overlay:   '#18181B',
          border:    'rgba(255, 255, 255, 0.08)',
          accent:    '#8B5CF6',
          'accent-hover': '#7C3AED',
          'accent-dim': 'rgba(139, 92, 246, 0.1)',
          text:      '#F4F4F5',
          'text-secondary': '#A1A1AA',
          'text-muted': '#71717A',
          'text-tag': '#C084FC',
        },
        // Revised Prompt Colors
        'pb-slate':   '#64748B',
        'pb-blue':    '#3B82F6',
        'pb-emerald': '#10B981',
        'pb-amber':   '#F59E0B',
        'pb-rose':    '#F43F5E',
        'pb-indigo':  '#6366F1',
        'pb-cyan':    '#06B6D4',
        'pb-orange':  '#F97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'pb': '8px',
        'pb-sm': '4px',
        'pb-md': '6px',
      },
      animation: {
        "popup-enter": "popup-enter 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "card-enter": "card-enter 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }
    },
  },
  plugins: [],
}
