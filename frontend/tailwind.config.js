tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                },
                screens: {
                    '2xl': '1440px',
                },
            },
            fontFamily: {
                display: ['Manrope', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            colors: {
                'dark-bg': '#0d0c1b',
                'dark-card': '#16152a',
                'dark-border': 'rgba(96, 165, 250, 0.2)',
                'light-bg': '#f7f9fc',
                'light-card': '#ffffff',
                'light-border': '#e5e7eb',
                'accent-blue': '#60A5FA',
                'accent-indigo': '#4F46E5',
            },
            boxShadow: {
                'card': '0 4px 15px -2px var(--shadow-color-1), 0 2px 8px -2px var(--shadow-color-1)',
                'card-hover': '0 10px 25px -5px var(--shadow-color-2), 0 4px 10px -4px var(--shadow-color-2)',
            },
            animation: {
                'border-glow': 'border-glow 15s linear infinite',
                'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
                'favorite-pop': 'favorite-pop 0.3s ease-out',
                'twinkle': 'twinkle 5s infinite ease-in-out',
                'float': 'float 6s ease-in-out infinite',
                'success-checkmark': 'success-checkmark 0.3s ease-out forwards 0.2s',
            },
            keyframes: {
                'border-glow': {
                    '0%': { 'background-position': '0% 50%' },
                    '50%': { 'background-position': '100% 50%' },
                    '100%': { 'background-position': '0% 50%' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'favorite-pop': {
                    '0%': { transform: 'scale(0.95)', opacity: '1' },
                    '50%': { transform: 'scale(1.5) rotate(15deg)', opacity: '0.8' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
                'twinkle': {
                    '0%, 100%': { opacity: 'var(--star-min-opacity, 0.2)' },
                    '50%': { opacity: 'var(--star-max-opacity, 0.8)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'success-checkmark': {
                    '0%': { 'stroke-dashoffset': '100' },
                    '100%': { 'stroke-dashoffset': '0' },
                },
            },
        },
    },
    plugins: [],
}