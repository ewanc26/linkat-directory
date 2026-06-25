// ── User Page Layout Load ──────────────────────────────────────────────
// Fetches a single user's Bluesky profile and their Linkat board records.

import type { LayoutLoad } from "./$types";

/**
 * Resolve a DID to its PDS endpoint via the Slingshot identity service.
 * Required so we know which PDS to query for AT Protocol records.
 */
async function resolveIdentity(identifier: string, fetch: typeof globalThis.fetch): Promise<{ did: string; handle: string; pds: string }> {
  const response = await fetch(
    `https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${encodeURIComponent(identifier)}`
  );
  if (!response.ok) {
    throw new Error(`Failed to resolve identifier via Slingshot: ${response.status}`);
  }
  const data = await response.json();
  if (!data.did || !data.pds) {
    throw new Error("Invalid response from identity resolver");
  }
  return { did: data.did, handle: data.handle || data.did, pds: data.pds };
}

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { did } = params;

  try {
    // Step 1: fetch the user's Bluesky profile from the public API
    const profileResponse = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`
    );

    if (!profileResponse.ok) {
      return {
        did,
        profile: null,
        dynamicLinks: undefined,
        error: "User not found"
      };
    }

    const profile = await profileResponse.json();

    // Step 2: resolve the user's PDS and fetch their link board records
    let dynamicLinks = undefined;
    try {
      const resolved = await resolveIdentity(did, fetch);
      const linksResponse = await fetch(
        `${resolved.pds}/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=blue.linkat.board&rkey=self`
      );

      if (linksResponse.ok) {
        const result = await linksResponse.json();
        if (result.records && result.records.length > 0) {
          dynamicLinks = result.records[0].value;
        }
      }
    } catch (error) {
      console.error("Error fetching dynamic links:", error);
    }

    return {
      did,
      profile,
      dynamicLinks,
      error: null
    };
  } catch (error) {
    return {
      did,
      profile: null,
      dynamicLinks: undefined,
      error: error instanceof Error ? error.message : "An error occurred"
    };
  }
};