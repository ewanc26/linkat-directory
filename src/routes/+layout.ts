// ── Root Layout Load ───────────────────────────────────────────────────
// Fetches profiles and link boards for all configured users at the root
// level so child routes have them without refetching.

import { getProfile, safeFetch } from "$components/profile/profile";
import type { Profile, LinkBoard } from "$components/shared";
import { LINKAT_USERS } from "$lib/config/linkat-users";
import { env } from "$env/dynamic/public";

// Module-level cache so route transitions don't re-fetch the same data
let profile: Profile | undefined;
let dynamicLinks: LinkBoard | undefined;

/**
 * Resolve a DID to its PDS endpoint via Slingshot.
 * Slingshot returns { did, handle, pds } from a lightweight identity document.
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

export async function load({ fetch }) {
  const userDids = LINKAT_USERS;

  if (userDids.length === 0) {
    return {
      profile: null,
      pdsUrl: null,
      did: null,
      posts: new Map(),
      dynamicLinks: null,
      userLinkBoards: {},
      linkatUsers: [],
      noUsersConfigured: true,
    };
  }

  // ── Primary user profile ────────────────────────────────────────────
  const primaryUserDid = userDids[0];
  if (!profile || profile.did !== primaryUserDid) {
    try {
      // Temporarily override so getProfile reads the right env var
      const originalEnv = env.DIRECTORY_OWNER;
      env.DIRECTORY_OWNER = primaryUserDid;
      profile = await getProfile(fetch);
      if (originalEnv) env.DIRECTORY_OWNER = originalEnv;
    } catch (error) {
      console.error("Error fetching primary user profile:", error);
      // Fallback profile so the UI renders something even when Bluesky is down
      profile = {
        avatar: "",
        banner: "",
        displayName: "Linkat User",
        did: primaryUserDid,
        handle: primaryUserDid,
        description: "Linkat directory user",
        pds: "https://bsky.social",
      };
    }
  }

  // ── Link boards for all users ───────────────────────────────────────
  const userLinkBoards: { [did: string]: LinkBoard | undefined } = {};

  for (const userDid of userDids) {
    try {
      // Each user may be on a different PDS — resolve per-user
      const resolved = await resolveIdentity(userDid, fetch);

      const rawResponse = await fetch(
        `${resolved.pds}/xrpc/com.atproto.repo.listRecords?repo=${userDid}&collection=blue.linkat.board&rkey=self`
      );
      const response = await rawResponse.json();
      if (response && response.records && response.records.length > 0) {
        userLinkBoards[userDid] = response.records[0].value as LinkBoard;
      }
    } catch (error) {
      console.error(`Error fetching dynamic links for ${userDid}:`, error);
    }
  }

  // Legacy single-user fallback
  dynamicLinks = profile ? userLinkBoards[profile.did] : undefined;

  return {
    profile,
    pdsUrl: profile?.pds,
    did: profile?.did,
    posts: new Map(),
    dynamicLinks,
    userLinkBoards,
    // Optionally hide the owner's own card so they don't see themselves listed
    linkatUsers: userDids.filter(did => {
       const hideOwnerCard = env.HIDE_OWNER_CARD === 'true';
      if (hideOwnerCard && did === primaryUserDid) {
        return false;
      }
      return true;
    }),
    noUsersConfigured: false,
    primaryUserDid,
    displayUserBanner: env.DISPLAY_USER_BANNER === 'true',
    displayUserDescription: env.DISPLAY_USER_DESCRIPTION === 'true',
  };
}