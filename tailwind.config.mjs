/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#61AAE1', // Nuevo Azul AG3D
          hover: '#4d92c7',   // Variante más oscura para el hover
          light: '#eef7fe',   // Variante clara
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