/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#15201B',
          soft: '#1E2B24',
        },
        paper: {
          DEFAULT: '#FAF7F0',
          dim: '#F0EBDD',
        },
        sage: {
          50: '#EEF3EF',
          100: '#D7E3DA',
          200: '#AFC7B5',
          300: '#87AB8F',
          400: '#5E8F6A',
          500: '#3D7349',
          600: '#2F4A3C',
          700: '#26392F',
          800: '#1C2922',
          900: '#121A16',
        },
        amber: {
          50: '#FFF3EC',
          100: '#FFE2CF',
          200: '#FFC299',
          300: '#FF9F61',
          400: '#FF7A33',
          500: '#F4621A',
          600: '#D14F11',
        },
        mist: {
          DEFAULT: '#7C8B82',
          light: '#A9B5AD',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '22px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(21,32,27,0.06), 0 8px 24px -8px rgba(21,32,27,0.10)',
        lift: '0 4px 12px rgba(21,32,27,0.10), 0 16px 40px -12px rgba(21,32,27,0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        tick: 'tick 0.4s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        tick: {
          '0%': { transform: 'scale(0.96)', opacity: 0.5 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
