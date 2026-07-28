<script lang="ts">
  // ── User Directory ────────────────────────────────────────────────────
  // Main user grid on the home page. Fetches Bluesky profiles for each
  // configured DID, then renders clickable cards. Cards with link boards
  // navigate to the internal user page; cards without link boards open the
  // user's Bluesky profile in a new tab.

  import { goto } from "$app/navigation";
  import type { User } from "$lib/components/shared/interfaces";
  import type { LinkBoard } from "$lib/components/shared/interfaces";
  import { safeBackgroundImage, safeMediaUrl } from "$utils/untrusted";

  interface DirectoryUser extends User {
    hasLinks: boolean;
    banner?: string;
  }

  let {
    users,
    primaryUserDid,
    userLinkBoards,
    displayBanner = false,
    displayDescription = false
  }: {
    users: User[];
    primaryUserDid: string | undefined;
    userLinkBoards: { [did: string]: LinkBoard | undefined };
    displayBanner?: boolean;
    displayDescription?: boolean;
  } = $props();

  let loading = $state(true);
  let userProfiles = $state<DirectoryUser[]>([]);

  // Fetch Bluesky profile metadata for each user, enriching the base User
  // object with avatar, displayName, handle, description, and banner.
  //
  // `loading` and `userProfiles` are runes, not stores: they are assigned,
  // never `.set()`. Remote avatar/banner URLs are scheme-checked here so no
  // unsafe value reaches the markup below.
  $effect(() => {
    if (!users || users.length === 0) {
      userProfiles = [];
      loading = false;
      return;
    }

    // Guard against an out-of-order response overwriting a newer user list.
    let cancelled = false;
    loading = true;

    (async () => {
      const profiles = await Promise.all(
        users.map(async (user): Promise<DirectoryUser> => {
          const enrichedUser: DirectoryUser = {
            ...user,
            hasLinks: !!userLinkBoards?.[user.did]?.cards?.length
          };

          try {
            const response = await fetch(
              `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(user.did)}`
            );
            if (response.ok) {
              const profile = await response.json();
              return {
                ...enrichedUser,
                handle: typeof profile.handle === "string" ? profile.handle : user.handle,
                displayName:
                  typeof profile.displayName === "string" ? profile.displayName : user.displayName,
                avatar: safeMediaUrl(profile.avatar),
                description:
                  displayDescription && typeof profile.description === "string"
                    ? profile.description
                    : undefined,
                banner: safeMediaUrl(profile.banner)
              };
            }
          } catch (error) {
            console.error(`Error fetching profile for ${user.did}:`, error);
          }

          return enrichedUser; // fallback if any individual fetch fails
        })
      );

      if (cancelled) return;
      userProfiles = profiles;
      loading = false;
    })();

    return () => {
      cancelled = true;
    };
  });

  function navigateToUser(user: DirectoryUser) {
    const userBoard = userLinkBoards[user.did];
    if (userBoard && userBoard.cards?.length > 0) {
      goto(`/user/${encodeURIComponent(user.did)}`);
    } else {
      // No link board — send them to the Bluesky profile directly.
      // `noopener,noreferrer` keeps the opened tab from reaching window.opener.
      window.open(
        `https://bsky.app/profile/${encodeURIComponent(user.did)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  }
</script>

<div class="user-directory">
  <h2 class="text-3xl font-bold mb-8 text-center">Users</h2>
  {#if loading}
    <div class="text-center py-8">
      <p class="text-lg opacity-75">Loading user profiles...</p>
    </div>
  {:else if userProfiles.length === 0}
    <div class="text-center py-8">
      <p class="text-lg opacity-75">
        No users configured or found. Please check your configuration and ensure users have associated Linkat data.
        {#if primaryUserDid}
          <br />Directory owner is set to: {primaryUserDid}
        {:else}
          <br />No directory owner is set.
        {/if}
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each userProfiles as user (user.did)}
        <button
          class="user-card cursor-pointer rounded-lg p-6 transition-transform hover:scale-105 text-left w-full"
          style="background: var(--card-bg); border: 1px solid var(--border-color);"
          onclick={() => navigateToUser(user)}
        >
          {#if displayBanner && user.banner}
            <div
              class="w-full h-32 rounded-t-lg mb-4 bg-cover bg-center"
              style={safeBackgroundImage(user.banner)}
            ></div>
          {/if}

          <div class="flex items-start gap-4">
            {#if user.avatar}
              <img
                src={user.avatar}
                alt={user.displayName || user.handle}
                class="w-16 h-16 rounded-full object-cover"
              />
            {:else}
              <div class="w-16 h-16 rounded-full bg-[var(--muted-bg)] flex items-center justify-center">
                <span class="text-2xl font-bold text-[var(--text-color)]">
                  {(user.displayName || user.handle || '?').charAt(0).toUpperCase()}
                </span>
              </div>
            {/if}

            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-lg truncate">
                {user.displayName || user.handle || 'Unknown User'}
              </h3>
              <p class="text-sm opacity-75 truncate">
                @{user.handle || user.did}
              </p>
              {#if displayDescription && user.description}
              <p class="text-[var(--text-color)] mt-2">{user.description}</p>
              {/if}
            </div>
          </div>

          <div class="mt-4 text-center">
            {#if user.hasLinks}
              <span class="text-sm text-link hover:text-link-hover">
                View links &rarr;
              </span>
            {:else}
              <span class="text-sm text-link hover:text-link-hover">
                No links - View Bluesky profile &rarr;
              </span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>