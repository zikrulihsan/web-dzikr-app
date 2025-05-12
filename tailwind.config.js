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
        primary: 'rgb(var(--primary-color))',
        secondary: 'rgb(var(--secondary-color))',
        accent: '#FFC107',
        background: '#F5F5F5',
        text: '#333333',
      },
    },
  },
  plugins: [],
  safelist: [
    'line-clamp-2'
  ]
}
