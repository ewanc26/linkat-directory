// ── Shared Types ───────────────────────────────────────────────────────
// Type definitions used across the Linkat Directory frontend.

/**
 * Represents a single link card with a URL, text, and an emoji.
 */
export interface LinkCard {
  url: string;
  text: string;
  emoji: string;
}

/**
 * Properties for the DynamicHead component — covers Open Graph, Twitter Card,
 * and standard meta tags. Most fields have sensible fallbacks.
 */
export interface DynamicHeadProps {
  title: string;
  description: string;
  keywords: string;
  ogUrl?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  twitterCard?: string;
  twitterUrl?: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
}

/**
 * A Linkat board record from the AT Protocol (blue.linkat.board collection).
 * Each board contains zero or more link cards.
 */
export interface LinkBoard {
  $type: "blue.linkat.board";
  cards: LinkCard[];
}

/**
 * A theme identifier and display name (for future theme-switching support).
 */
export interface Theme {
  id: string;
  name: string;
}

/**
 * Public environment variables exposed to the client.
 */
export interface PublicEnv {
  DIRECTORY_OWNER: string;
}

/**
 * A Bluesky/AT Protocol user profile, as consumed by the directory.
 * PDS is resolved via Slingshot rather than hardcoded.
 */
export interface Profile {
  avatar: string;
  banner: string;
  displayName: string;
  did: string; // Decentralised Identifier
  handle: string;
  description: string;
  pds: string; // Personal Data Server URL, resolved at runtime
}

/**
 * Minimal user representation for directory card rendering.
 */
export interface User {
  did: string;
  handle?: string;
  displayName?: string;
  avatar?: string;
  description?: string;
}