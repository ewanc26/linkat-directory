import { getProfile, safeFetch } from "$components/profile/profile";
import type { Profile, LinkBoard } from "$components/shared";
import { LINKAT_USERS } from "$lib/config/linkat-users";
import { env } from "$env/dynamic/public";

// Profile data cache
let profile: Profile | undefined;
let dynamicLinks: LinkBoard | undefined;

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
    // Create a mock profile if we can't fetch the real one
    try {
      // Temporarily set env to the primary user for getProfile
      const originalEnv = env.DIRECTORY_OWNER;
      env.DIRECTORY_OWNER = primaryUserDid;
      profile = await getProfile(fetch);
      if (originalEnv) env.DIRECTORY_OWNER = originalEnv;
    } catch (error) {
      console.error("Error fetching primary user profile:", error);
      // Create fallback profile
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
      // Get user's PDS
      const split = userDid.split(":");
      let pdsurl;
      if (split[0] === "did") {
        if (split[1] === "plc") {
          const diddoc = await safeFetch(`https://plc.directory/${userDid}`, fetch);
          for (const service of diddoc["service"]) {
            if (service["id"] === "#atproto_pds") {
              pdsurl = service["serviceEndpoint"];
              break;
            }
          }
        } else if (split[1] === "web") {
          pdsurl = `https://${split[2]}`;
        }
      }
      
      if (pdsurl) {
        const rawResponse = await fetch(
          `${pdsurl}/xrpc/com.atproto.repo.listRecords?repo=${userDid}&collection=blue.linkat.board&rkey=self`
        );
        const response = await rawResponse.json();
        if (response && response.records && response.records.length > 0) {
          userLinkBoards[userDid] = response.records[0].value as LinkBoard;
        }
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
        return false; // Hide the owner's card if HIDE_OWNER_CARD is true
      }
      return true; // Always include the user if not hidden
    }),
    noUsersConfigured: false,
    primaryUserDid,
  };
}