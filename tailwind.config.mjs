/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#61AAE1',
          hover: '#4d92c7',
          light: '#eef7fe',
        },
        secondary: '#054A91',
        accent: '#FF8B1F',
        success: '#22c55e',
        header: '#DBE4EE',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
