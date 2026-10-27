/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF5EF',
          dark: '#F3EBDF',
        },
        espresso: {
          DEFAULT: '#2C1A12',
          soft: '#4A2F1F',
        },
        coffee: '#6F4E37',
        caramel: '#A85A2E',
        gold: '#C9973C',
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(44, 26, 18, 0.05), 0 8px 24px -12px rgba(44, 26, 18, 0.18)',
      },
    },
  },
  plugins: [],
}
