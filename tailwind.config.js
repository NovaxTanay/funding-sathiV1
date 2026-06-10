/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card:      'var(--bg-card)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        accent: { blue: 'var(--accent-blue)' },
        status: {
          bankable:    'var(--status-bankable)',
          conditional: 'var(--status-conditional)',
          substandard: 'var(--status-substandard)',
        },
        nav: { bg: 'var(--nav-bg)' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm':      '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.02)',
        'glass-md':      '0 8px 32px 0 rgba(0,0,0,0.06)',
        'glass-dark-md': '0 8px 32px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
