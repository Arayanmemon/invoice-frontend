import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'
import lineClamp from '@tailwindcss/line-clamp'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx,mjs,cjs}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx,mjs,cjs}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx,mjs,cjs}',
  ],
  darkMode: 'class', // or 'media'
  theme: {
   extend: {
  borderRadius: {
    lg: '0.5rem',
    md: '0.375rem',
    sm: '0.25rem',
  },
  colors: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    indigo: {
      600: '#4f46e5',
      700: '#4338ca',
    },
    red: {
      600: '#dc2626',
    },
    green: {
      600: '#16a34a',
    },
  },
  dropShadow: {
    neon: '0 0 8px rgba(129, 140, 248, 0.8)',
    pink: '0 0 6px rgba(236, 72, 153, 0.9)',
    purple: '0 0 6px rgba(168, 85, 247, 0.9)',
  },
  boxShadow: {
    'indigo-700': '0 0 15px 2px #4f46e5',
    'indigo-600': '0 0 20px 4px #6366f1',
    'pink-700': '0 0 15px 2px #db2777',
    'pink-600': '0 0 20px 4px #ec4899',
    'green-700': '0 0 15px 2px #16a34a',
    'green-600': '0 0 20px 4px #22c55e',
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  backdropBlur: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  backgroundColor: {
    'glass-dark': 'rgba(255, 255, 255, 0.05)',
    'glass-light': 'rgba(255, 255, 255, 0.2)',
  },
},
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
    lineClamp,
  ],
}

export default config
