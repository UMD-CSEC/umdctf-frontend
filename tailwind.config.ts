import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111',
        theme: '#c22026',
        'theme-dark': '#9A1B1F',
        'theme-bright': '#ff1e1e',
        primary: '#BABABA',
        secondary: '#757575',
        tertiary: '#404040'
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.75rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      }
    },
  },
  plugins: [],
}
export default config;
