/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/components/**/*.{js,jsx,ts,tsx}",
    "src/pages/**/*.{js,jsx,ts,tsx}",
    "src/App.{js,jsx,ts,tsx}",
    "src/index.{js,jsx,ts,tsx}",
    "public/index.html"
  ],
  theme: {
    extend: {
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 2px 6px rgba(0,0,0,0.1)',
      },
      colors: {
        primary: '#C62828',
        cream: '#FFF8F3',
        'text-main': '#333333',
        'text-light': '#777777',
        success: '#43A047',
        warning: '#FDD835',
        danger: '#E53935',
        background:"#FFF3D0",
        icon:"#C1121F",
        iconbackground:"#FFD60A",
        textcolor:"#990033",
        trbackground:"#FFA944",
        hover:"#FFE5E5",
       
      },

   
    },
   
  },
  plugins: [],
} 