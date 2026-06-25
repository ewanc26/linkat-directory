import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// Vite config: SvelteKit plugin with PostCSS for Tailwind, targeting modern JS.
export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    target: "esnext",
  },
});
