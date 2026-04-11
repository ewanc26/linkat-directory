import { getProfile, safeFetch } from "$components/profile/profile";
import type { Profile, LinkBoard } from "$components/shared";
import { LINKAT_USERS } from "$lib/config/linkat-users";
import { env } from "$env/dynamic/public";

// Profile data cache
let profile: Profile | undefined;
let dynamicLinks: LinkBoard | undefined;

// Resolve identity via Slingshot (matches @ewanc26/atproto pattern)
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

  // If no users configured, return empty state
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

  // Use the first user as primary if not already cached
  const primaryUserDid = userDids[0];
  if (!profile || profile.did !== primaryUserDid) {
    try {
      const originalEnv = env.DIRECTORY_OWNER;
      env.DIRECTORY_OWNER = primaryUserDid;
      profile = await getProfile(fetch);
      if (originalEnv) env.DIRECTORY_OWNER = originalEnv;
    } catch (error) {
      console.error("Error fetching primary user profile:", error);
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

  const userLinkBoards: { [did: string]: LinkBoard | undefined } = {};

  // Fetch dynamic links for all configured users
  for (const userDid of userDids) {
    try {
      // Resolve PDS via Slingshot (matches @ewanc26/atproto pattern)
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

  // For backward compatibility, keep the single dynamicLinks
  dynamicLinks = profile ? userLinkBoards[profile.did] : undefined;

  return {
    profile,
    pdsUrl: profile?.pds,
    did: profile?.did,
    posts: new Map(),
    dynamicLinks,
    userLinkBoards,
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