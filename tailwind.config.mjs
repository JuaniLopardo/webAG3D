/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Azul principal
          hover: '#1d4ed8',
          light: '#dbeafe',
        },
        secondary: '#111827', // Gris oscuro/Negro
        accent: '#22c55e',    // Verde WhatsApp/Éxito
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}