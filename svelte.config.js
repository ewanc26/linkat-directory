// ── SvelteKit Configuration ─────────────────────────────────────────────
// Deploys to Vercel; prerenders all routes; custom paths for ergonomic imports.

import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // The runtime is pinned rather than inferred: adapter-vercel derives
    // its default from the *building* machine's Node version and hard-fails
    // on anything outside the versions it knows, so an unpinned build
    // breaks on newer local Node installs and silently drifts when Vercel
    // bumps its default.
    adapter: adapter({ runtime: "nodejs22.x" }),

    // Prerender everything — this is a static directory, not a dynamic app.
    // origin defaults to localhost:5713 so local dev previews work without
    // needing PUBLIC_ORIGIN set every time.
    prerender: {
      entries: ["*"],
      origin: process.env.PUBLIC_ORIGIN || "http://localhost:5713",
    },

    // Short import aliases for common source directories
    alias: {
      $components: "./src/lib/components",
      $css: "./src/lib/css",
      $services: "./src/lib/services",
      $utils: "./src/lib/utils",
    },

    // No public prefix — env vars are accessed without PUBLIC_ prefix
    env: {
      publicPrefix: "",
    },
  },
};

export default config;
