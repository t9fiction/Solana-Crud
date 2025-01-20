import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: '#1D232A',   // Primary background color
        secondaryBg: '#A6ADBB', // Secondary background color
        primary: '#1E40AF',        // Main color
        secondary: '#64748B',   // Secondary color
      },
    },
  },
  plugins: [require('daisyui')],
};
export default config;
