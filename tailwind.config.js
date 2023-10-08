module.exports = {
  mode: 'jit',
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
  theme: {
    fontFamily: {
      'tf':['TT_Firs_Neue_Trl'],
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['"Open Sans"'],
    }
  }
}