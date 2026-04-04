/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        beagle: {
          primary: 'var(--beagle-primary)',
          'primary-hover': 'var(--beagle-primary-hover)',
          'primary-light': 'var(--beagle-primary-light)',
          bg: 'var(--beagle-bg)',
          surface: 'var(--beagle-surface)',
          border: 'var(--beagle-border)',
          'border-hover': 'var(--beagle-border-hover)',
          'text-heading': 'var(--beagle-text-heading)',
          'text-body': 'var(--beagle-text-body)',
          'text-muted': 'var(--beagle-text-muted)',
          success: 'var(--beagle-success)',
          warning: 'var(--beagle-warning)',
          error: 'var(--beagle-error)',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        beagle: '12px',
        'beagle-btn': '9999px',
      },
      maxWidth: {
        beagle: '1280px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
