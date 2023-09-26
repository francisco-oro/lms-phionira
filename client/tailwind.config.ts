import { light } from '@mui/material/styles/createPalette'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily:{
        Poppins: ["var(--font-Poppins)"],
        Josefin: ["var(--font-Josefin)"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens:{
        "1000px": "1000px",
        "1100px": "1100px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1500px": "1500px",
        "800px": "800px",
        "400px": "400px",
      },
      colors: {
        primary: { //oxford blue
          100: "#e8e9eb",
          200: "#dcdde1",
          300: '#b6bac2',
          400: '#151f39',
          500: "#131c33",
          600: "#11192e",
          700: "#10172b",
          8000: "#0d1322",
          1000: "#090e1a",
          1100: "#070b14",
        },
        secondary: { //munsell blue
          100: "#ebf3f5",
          200: "#e1edef",
          300: '#c1d9df',
          400: '#388697',
          500: "#327988",
          600: "#2d6b79",
          700: "#2a6571",
          8000: "#22505b",
          1000: "#193c44",
          1100: "#142f35",
        },
        thertiary: { // pink
          100: "#fdeff5",
          200: "fce7f0",
          300: '#f9cedf',
          400: '#e96199',
          500: "#d2578a",
          600: "#ba4e7a",
          700: "#af4973",
          8000: "#8c3a5c",
          1000: "#692c45",
          1100: "#522236",
        }
      },
    },
  },
  plugins: [],
}
export default config
