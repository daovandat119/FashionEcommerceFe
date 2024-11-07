
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    colors: {
      lightGray: '#e9e9e9',
    },
    keyframes: {
      heartBeat: {
        '0%': { transform: 'scale(1)' },
        '14%': { transform: 'scale(1.3)' },
        '28%': { transform: 'scale(1)' },
        '42%': { transform: 'scale(1.3)' },
        '70%': { transform: 'scale(1)' },
      }
    },
    animation: {
      heartBeat: 'heartBeat 1s ease-in-out',
    }
  },
};
export const plugins = [];
