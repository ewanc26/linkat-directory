import { env } from "$env/dynamic/public";

/**
 * Configuration for Linkat users to display
 * 
 * Users can be configured via environment variables:
 * - PUBLIC_LINKAT_USERS: Comma-separated list of DIDs (e.g., "did:plc:abc123,did:web:example.com")
 * - DIRECTORY_OWNER: Primary user DID (fallback if no users configured)
 * 
 * Format: "did:plc:xxxxxxxxxxxxxxxxxxxxxxxx" or "did:web:xxxxxxxxxxxxxxxxxxxxxxxx"
 * The first user will be treated as the primary user
 */

function parseUsersFromEnv(): string[] {
  const users: string[] = [];
  
  // Always include DIRECTORY_OWNER as the primary user if configured
  if (env.DIRECTORY_OWNER) {
    users.push(env.DIRECTORY_OWNER);
  }
  
  // Add additional users from PUBLIC_LINKAT_USERS, avoiding duplicates
  if (env.PUBLIC_LINKAT_USERS) {
    const envUsers = env.PUBLIC_LINKAT_USERS.split(',')
      .map(did => did.trim())
      .filter(did => did.startsWith('did:') && did !== env.DIRECTORY_OWNER);
    users.push(...envUsers);
  }
  
  return users;
}

export const LINKAT_USERS = parseUsersFromEnv();

// Maximum number of users to display (1-10)
export const MAX_USERS = 10;