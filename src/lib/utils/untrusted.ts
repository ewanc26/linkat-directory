// ── Untrusted Remote Input ────────────────────────────────────────────
// Everything this app renders (profiles, PDS URLs, `blue.linkat.board`
// records) comes from repositories other people control. Nothing in here
// trusts a remote string: URLs are parsed and scheme-checked before they
// reach an `href`, an `img src`, a CSS `url()`, or a `fetch()`.

import type { LinkBoard, LinkCard } from "$components/shared/interfaces";

/** Schemes that are safe to place in a user-facing link. */
const LINK_SCHEMES = new Set(["http:", "https:", "mailto:"]);

/** Schemes that are safe to load as an image or a CSS background. */
const MEDIA_SCHEMES = new Set(["http:", "https:"]);

function parse(value: unknown): URL | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed);
  } catch {
    return undefined;
  }
}

/**
 * Returns a link-safe absolute URL, or `undefined` when the value is missing,
 * relative, or uses a dangerous scheme.
 *
 * This is the defence against a `blue.linkat.board` card whose `url` is
 * `javascript:…` or `data:text/html,…`: such a card must never become a
 * clickable anchor, because the anchor would run in this site's origin.
 */
export function safeLinkUrl(value: unknown): string | undefined {
  const url = parse(value);
  return url && LINK_SCHEMES.has(url.protocol) ? url.href : undefined;
}

/** Returns an image-safe absolute http(s) URL, or `undefined`. */
export function safeMediaUrl(value: unknown): string | undefined {
  const url = parse(value);
  return url && MEDIA_SCHEMES.has(url.protocol) ? url.href : undefined;
}

/**
 * Returns a CSS `background-image` declaration for an untrusted URL, or an
 * empty string. The URL is scheme-checked and then quoted with `"` and `\`
 * escaped, so a crafted avatar/banner value cannot close `url()` and inject
 * further CSS declarations into the inline `style` attribute.
 */
export function safeBackgroundImage(value: unknown): string {
  const url = safeMediaUrl(value);
  if (!url) return "";
  return `background-image: url("${url.replace(/["\\]/g, "\\$&")}");`;
}

/**
 * Returns an https origin suitable for building AT Protocol request URLs,
 * or `undefined`. Resolver responses are untrusted, so a PDS value that is
 * plaintext, carries credentials, or embeds a path/query is rejected rather
 * than concatenated into a `fetch()` target.
 */
export function safePdsOrigin(value: unknown): string | undefined {
  const url = parse(value);
  if (!url) return undefined;
  const usable =
    url.protocol === "https:" &&
    !url.username &&
    !url.password &&
    (url.pathname === "" || url.pathname === "/") &&
    !url.search &&
    !url.hash;
  return usable ? url.origin : undefined;
}

/** Upper bound on cards rendered from one remote board record. */
const MAX_CARDS = 100;

/** Upper bound on characters kept from one remote text field. */
const MAX_TEXT = 500;

function text(value: unknown): string {
  return typeof value === "string" ? value.slice(0, MAX_TEXT) : "";
}

/**
 * Validates an untrusted `blue.linkat.board` record value.
 *
 * Returns `undefined` for anything that is not a board, and drops individual
 * cards whose URL is missing or uses an unsafe scheme. Callers previously
 * read `record.cards.length` straight off the remote value, which threw when
 * a repository held a board without a `cards` array.
 */
export function parseLinkBoard(value: unknown): LinkBoard | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.cards)) return undefined;

  const cards: LinkCard[] = [];
  for (const candidate of record.cards.slice(0, MAX_CARDS)) {
    if (typeof candidate !== "object" || candidate === null) continue;
    const card = candidate as Record<string, unknown>;
    const url = safeLinkUrl(card.url);
    if (!url) continue;
    cards.push({ url, text: text(card.text) || url, emoji: text(card.emoji) });
  }

  return { $type: "blue.linkat.board", cards };
}

/** Syntactic check only — a DID that passes this may still not resolve. */
export function isDid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 2048 &&
    /^did:[a-z]+:[A-Za-z0-9._:%-]+$/.test(value)
  );
}
