// PostCSS pipeline: import resolution, Tailwind nesting, Tailwind, vendor prefixes
export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {}
  }
};
