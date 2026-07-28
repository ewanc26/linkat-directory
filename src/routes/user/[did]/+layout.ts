// ── User Page Layout Load ──────────────────────────────────────────────
// Fetches a single user's Bluesky profile and their Linkat board records.

import type { LayoutLoad } from "./$types";
import {
  isDid,
  parseLinkBoard,
  safeMediaUrl,
  safePdsOrigin,
} from "$utils/untrusted";

/**
 * Resolve a DID to its PDS endpoint via the Slingshot identity service.
 * Required so we know which PDS to query for AT Protocol records.
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
  // Third-party resolver output is untrusted; reject anything that is not a
  // bare https origin before it becomes the base of a request URL.
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

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { did } = params;

  // The route parameter is arbitrary visitor input. Reject non-DIDs here so a
  // crafted value can never be interpolated into an upstream query string.
  if (!isDid(did)) {
    return {
      did,
      profile: null,
      dynamicLinks: undefined,
      error: "User not found",
    };
  }

  try {
    // Step 1: fetch the user's Bluesky profile from the public API
    const profileResponse = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
    );

    if (!profileResponse.ok) {
      return {
        did,
        profile: null,
        dynamicLinks: undefined,
        error: "User not found",
      };
    }

    const raw = await profileResponse.json();
    const profile =
      typeof raw === "object" && raw !== null
        ? {
            did: typeof raw.did === "string" ? raw.did : did,
            handle: typeof raw.handle === "string" ? raw.handle : did,
            displayName:
              typeof raw.displayName === "string" ? raw.displayName : undefined,
            description:
              typeof raw.description === "string" ? raw.description : undefined,
            // Scheme-checked so the value cannot become a non-http img src.
            avatar: safeMediaUrl(raw.avatar),
            banner: safeMediaUrl(raw.banner),
          }
        : null;

    // Step 2: resolve the user's PDS and fetch their link board records
    let dynamicLinks = undefined;
    try {
      const resolved = await resolveIdentity(did, fetch);
      const linksResponse = await fetch(
        `${resolved.pds}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=blue.linkat.board&rkey=self`,
      );

      if (linksResponse.ok) {
        const result = await linksResponse.json();
        if (Array.isArray(result?.records) && result.records.length > 0) {
          dynamicLinks = parseLinkBoard(result.records[0]?.value);
        }
      }
    } catch (error) {
      console.error("Error fetching dynamic links:", error);
    }

    return {
      did,
      profile,
      dynamicLinks,
      error: null,
    };
  } catch (error) {
    return {
      did,
      profile: null,
      dynamicLinks: undefined,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
