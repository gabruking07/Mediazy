/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070b12',
        panel: 'rgba(15, 23, 42, 0.74)',
        brand: '#29d3a4',
        ember: '#ff6b4a',
        electric: '#54a7ff'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(41, 211, 164, 0.18)'
      }
    }
  },
  plugins: []
};
