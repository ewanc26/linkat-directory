import { env } from "$env/dynamic/public";
import { getCache, setCache } from "$utils/cache";
import type { Profile } from "$components/shared";

export async function safeFetch(url: string, fetch: typeof globalThis.fetch) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    return await response.json();
  } catch (error: unknown) {
    // Catch network errors (e.g., connection refused, timeout)
    console.error(`Network error fetching ${url}:`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch ${url}: An unknown error occurred`);
    }
  }
}

export async function getProfile(fetch: typeof globalThis.fetch): Promise<Profile> {
  const cacheKey = `profile_${env.DIRECTORY_OWNER}`;
  let profile: Profile | null = getCache<Profile>(cacheKey);

  if (profile) {
    return profile;
  }

  try {
    const fetchProfile = await safeFetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${env.DIRECTORY_OWNER}`,
      fetch
    );
    const split = fetchProfile["did"].split(":");
    let diddoc;
    if (split[0] === "did") {
      if (split[1] === "plc") {
        diddoc = await safeFetch(`https://plc.directory/${fetchProfile["did"]}`, fetch);
      } else if (split[1] === "web") {
        diddoc = await safeFetch("https://" + split[2] + "/.well-known/did.json", fetch);
      }
    } else {
      throw new Error("Invalid DID, malformed");
    }
    let pdsurl;
    for (const service of diddoc["service"]) {
      if (service["id"] === "#atproto_pds") {
        pdsurl = service["serviceEndpoint"];
      }
    }
    if (!pdsurl) {
      throw new Error("DID lacks #atproto_pds service");
    }
    profile = {
      avatar: fetchProfile["avatar"],
      banner: fetchProfile["banner"],
      displayName: fetchProfile["displayName"],
      did: fetchProfile["did"],
      handle: fetchProfile["handle"],
      description: fetchProfile["description"],
      pds: pdsurl,
    };
    setCache(cacheKey, profile);
    return profile;
  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    if (error instanceof Error) {
      throw error; // Re-throw the error after logging
    } else {
      throw new Error("An unknown error occurred while fetching profile");
    }
  }
}