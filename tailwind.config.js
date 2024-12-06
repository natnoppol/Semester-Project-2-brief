/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{html,js}",
    "!./node_modules/**/*"
  ],
  
  theme: {
    extend: {},
    screens: {
      'xs': '375px', // Custom breakpoint for extra small screens
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

  },
  plugins: [],
}
