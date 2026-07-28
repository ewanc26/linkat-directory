// ── robots.txt ─────────────────────────────────────────────────────────
// Served from a route rather than static/ because the Sitemap line has to
// carry an absolute URL, and this directory is self-hosted under whatever
// origin the operator configures via PUBLIC_ORIGIN.

import { env } from "$env/dynamic/public";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
  // url.origin is the prerender origin, which svelte.config.js already seeds
  // from PUBLIC_ORIGIN; the env var is preferred when both are available.
  const origin = (env.PUBLIC_ORIGIN || url.origin).replace(/\/$/, "");

  const body = `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
