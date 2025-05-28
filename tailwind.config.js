/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-cyan': '#00ffff',
        'primary-blue': '#0080ff',
        'primary-purple': '#8000ff',
        'accent-pink': '#ff0080',
        'accent-orange': '#ff8000',
        'error-red': '#ff4444',
        'dark-bg': '#0a0a0f',
        'darker-bg': '#050508',
        'card-bg': 'rgba(15, 25, 40, 0.8)',
        'border-glow': 'rgba(0, 255, 255, 0.3)',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a9c0',
        'text-accent': '#00ffff',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
} 