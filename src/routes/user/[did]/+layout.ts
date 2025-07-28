import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
  const { did } = params;

  try {
    // Fetch user profile
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

    // Get user's PDS and fetch Linkat links
    const split = did.split(":");
    let pdsurl: string | null = null;
    let dynamicLinks = undefined;

    if (split[0] === "did") {
      if (split[1] === "plc") {
        const diddocResponse = await fetch(`https://plc.directory/${did}`);
        if (diddocResponse.ok) {
          const diddoc = await diddocResponse.json();
          for (const service of diddoc["service"] || []) {
            if (service["id"] === "#atproto_pds") {
              pdsurl = service["serviceEndpoint"];
              break;
            }
          }
        }
      } else if (split[1] === "web") {
        pdsurl = `https://${split[2]}`;
      }
    }

    if (pdsurl) {
      try {
        const linksResponse = await fetch(
          `${pdsurl}/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=blue.linkat.board&rkey=self`
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