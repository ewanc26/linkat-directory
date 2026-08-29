// ── Sitemap ────────────────────────────────────────────────────────────
// robots.txt advertises /sitemap.xml, so it has to exist. The per-user pages
// live under /user/[did], which a crawler cannot enumerate, so each
// configured DID is listed explicitly.

import { env } from "$lib/config/public-env";
import { LINKAT_USERS } from "$lib/config/linkat-users";
import type { RequestHandler } from "./$types";

export const prerender = true;

/** Escape the five XML predefined entities. */
function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: RequestHandler = ({ url }) => {
  const origin = (env.PUBLIC_ORIGIN || url.origin).replace(/\/$/, "");

  const urls = [
    { loc: `${origin}/`, priority: "1.0" },
    ...LINKAT_USERS.map((did) => ({
      loc: `${origin}/user/${encodeURIComponent(did)}`,
      priority: "0.8",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) =>
      `  <url>
    <loc>${escapeXml(loc)}</loc>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
