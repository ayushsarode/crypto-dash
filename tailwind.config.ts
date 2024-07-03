import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        custom1: '#0f0c29',
        custom2: '#302b63',
        custom3: '#24243e',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
