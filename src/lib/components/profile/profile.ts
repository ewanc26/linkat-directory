// ── Profile Fetching ──────────────────────────────────────────────────
// Bluesky profile retrieval with local caching and PDS resolution via Slingshot.

import { env } from "$lib/config/public-env";
import { getCache, setCache } from "$utils/cache";
import { safeMediaUrl, safePdsOrigin } from "$utils/untrusted";
import type { Profile } from "$components/shared";

/**
 * Wraps fetch with error normalisation for predictable failure handling.
 * Catches network errors (connection refused, timeout) and wraps them with
 * context about which URL failed.
 */
export async function safeFetch(url: string, fetch: typeof globalThis.fetch) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `HTTP error! status: ${response.status}, statusText: ${response.statusText}`,
      );
    return await response.json();
  } catch (error: unknown) {
    console.error(`Network error fetching ${url}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch ${url}: An unknown error occurred`);
    }
  }
}

/**
 * Resolve a DID or handle to its PDS endpoint via the Slingshot identity resolver.
 * Slingshot is a lightweight AT Protocol identity microservice that returns the
 * user's DID, handle, and PDS URL without requiring full PLC directory lookups.
 */
async function resolveIdentity(
  identifier: string,
  fetch: typeof globalThis.fetch,
): Promise<{ did: string; handle: string; pds: string }> {
  const response = await fetch(
    `https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${encodeURIComponent(identifier)}`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to resolve identifier via Slingshot: ${response.status}`,
    );
  }
  const data = await response.json();
  // Resolver responses are untrusted: only a bare https origin is usable as
  // the base of a later AT Protocol request URL.
  const pds = safePdsOrigin(data?.pds);
  if (typeof data?.did !== "string" || !pds) {
    throw new Error("Invalid response from identity resolver");
  }
  return {
    did: data.did,
    handle: typeof data.handle === "string" ? data.handle : data.did,
    pds,
  };
}

/**
 * Fetch a full Profile for the configured DIRECTORY_OWNER.
 *
 * 1. Check the local cache (1-hour TTL).
 * 2. Fetch profile metadata from the Bluesky public API.
 * 3. Resolve the user's PDS via Slingshot for AT Protocol operations.
 * 4. Cache and return the combined result.
 *
 * Throws if either the profile fetch or identity resolution fails.
 */
export async function getProfile(
  fetch: typeof globalThis.fetch,
): Promise<Profile> {
  const owner = env.DIRECTORY_OWNER ?? "";
  if (!owner) {
    throw new Error("DIRECTORY_OWNER is not configured");
  }
  const cacheKey = `profile_${owner}`;
  let profile: Profile | null = getCache<Profile>(cacheKey);

  if (profile) {
    return profile;
  }

  try {
    // Step 1: fetch profile from the Bluesky public API
    const fetchProfile = await safeFetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(owner)}`,
      fetch,
    );

    // Step 2: resolve PDS via Slingshot so we know where to send AT Protocol requests
    const resolved = await resolveIdentity(fetchProfile["did"], fetch);

    profile = {
      // Remote media URLs are scheme-checked before they can reach an img src
      // or a CSS background.
      avatar: safeMediaUrl(fetchProfile["avatar"]) ?? "",
      banner: safeMediaUrl(fetchProfile["banner"]) ?? "",
      displayName: fetchProfile["displayName"],
      did: fetchProfile["did"],
      handle: fetchProfile["handle"],
      description: fetchProfile["description"],
      pds: resolved.pds,
    };
    setCache(cacheKey, profile);
    return profile;
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while fetching profile");
    }
  }
}
