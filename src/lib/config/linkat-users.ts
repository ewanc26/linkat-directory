// ── Linkat User Configuration ─────────────────────────────────────────
// Parses DIRECTORY_OWNER and PUBLIC_LINKAT_USERS env vars into a user list.

import { env } from "$env/dynamic/public";

/**
 * Configures which users appear in the directory.
 *
 * Env sources:
 * - DIRECTORY_OWNER (always first, treated as primary)
 * - PUBLIC_LINKAT_USERS (comma-separated DIDs, deduplicated)
 *
 * DID format: did:plc:... or did:web:...
 */

function parseUsersFromEnv(): string[] {
  const users: string[] = [];

  // DIRECTORY_OWNER is always the primary user when set
  if (env.DIRECTORY_OWNER) {
    users.push(env.DIRECTORY_OWNER);
  }

  // Append additional users, filtering out the owner to avoid duplicates
  if (env.PUBLIC_LINKAT_USERS) {
    const envUsers = env.PUBLIC_LINKAT_USERS.split(',')
      .map(did => did.trim())
      .filter(did => did.startsWith('did:') && did !== env.DIRECTORY_OWNER);
    users.push(...envUsers);
  }

  return users;
}

export const LINKAT_USERS = parseUsersFromEnv();

export const MAX_USERS = 10;