import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./inertia/**/*.vue', './resources/views/**/*.edge'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'on-primary': 'var(--on-primary)',
        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',
        
        'secondary': 'var(--secondary)',
        'on-secondary': 'var(--on-secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary-container': 'var(--on-secondary-container)',
        
        'surface': 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        'surface-variant': 'var(--surface-variant)',
        'on-surface-variant': 'var(--on-surface-variant)',
        
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        
        'outline': 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        
        'error': 'var(--error)',
        'on-error': 'var(--on-error)',
        'error-container': 'var(--error-container)',
        'on-error-container': 'var(--on-error-container)',
        
        'success': 'var(--success)',
        'on-success': 'var(--on-success)',
        'success-container': 'var(--success-container)',
        'on-success-container': 'var(--on-success-container)',
        
        'background': 'var(--background)',
        'on-background': 'var(--on-background)',
        
        // Keep these if still used or if they don't have direct variables yet
        'surface-bright': 'var(--surface)',
        'inverse-on-surface': 'var(--on-surface)',
        'surface-dim': 'var(--surface-container-high)',
        'inverse-surface': 'var(--on-surface)',
        'primary-fixed': 'var(--primary-container)',
        'primary-fixed-dim': 'var(--primary)',
        'secondary-fixed': 'var(--secondary-container)',
        'secondary-fixed-dim': 'var(--secondary)',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      fontFamily: {
        headline: ['Public Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [forms, containerQueries],
}
