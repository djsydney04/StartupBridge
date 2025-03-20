/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#666666',
      },
      fontFamily: {
        sans: ['Naava', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        naava: ['Naava', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 