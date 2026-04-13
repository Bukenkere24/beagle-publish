/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        beagle: {
          primary: '#4552FF',
          'primary-hover': '#5B6CFF',
          'primary-ghost': '#4552FF26',
          bg: '#050505',
          surface: '#0A0A0A',
          border: '#252525',
          'border-hover': '#3F3F46',
          'border-section': '#212121',
          'text-heading': '#E7E6D9',
          'text-sub': '#E7E6D999',
          'text-body': '#ECECECBF',
          'text-secondary': '#D0D0D0',
          'text-muted': '#B0B0B0',
          'text-dimmed': '#909090',
          'text-faint': '#71717A',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        beagle: '6px',
        'beagle-btn': '2px',
      },
      maxWidth: {
        beagle: '1280px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
