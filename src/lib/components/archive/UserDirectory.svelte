<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { User } from "$lib/components/shared/interfaces";

  export let users: User[];
  export let primaryUserDid: string | undefined;
  export let userLinkBoards: { [did: string]: LinkBoard | undefined };
  export let displayBanner: boolean = false;
  export let displayDescription: boolean = false;
  import type { LinkBoard } from "$lib/components/shared/interfaces";

  let loading = true;
  let userProfiles: any[] = [];

  onMount(async () => {
    if (users && users.length > 0) {
      const profiles = await Promise.all(
        users.map(async (user) => {
          let enrichedUser = {
            ...user,
            hasLinks: !!userLinkBoards?.[user.did]?.cards?.length
          };

          try {
            const response = await fetch(
              `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${user.did}`
            );
            if (response.ok) {
              const profile = await response.json();
              return {
                ...enrichedUser,
                handle: profile.handle || user.handle,
                displayName: profile.displayName || user.displayName,
                avatar: profile.avatar,
                description: displayDescription ? profile.description : undefined,
                banner: profile.banner
              };
            }
          } catch (error) {
            console.error(`Error fetching profile for ${user.did}:`, error);
          }

          return enrichedUser; // fallback if fetch fails
        })
      );
      userProfiles = profiles.filter(Boolean);
    }
    loading = false;
  });

  function navigateToUser(user: any) {
    const userBoard = userLinkBoards[user.did];
    if (userBoard && userBoard.cards?.length > 0) {
      goto(`/user/${encodeURIComponent(user.did)}`);
    } else {
      // Construct Bluesky profile URL
      const blueskyHandle = user.did;
      window.open(`https://bsky.app/profile/${blueskyHandle}`, '_blank');
    }
  }
</script>

<div class="user-directory">
  <h1 class="text-3xl font-bold mb-8 text-center">Users</h1>
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
          on:click={() => navigateToUser(user)}
        >
          {#if displayBanner}
            <div 
              class="w-full h-32 rounded-t-lg mb-4 bg-cover bg-center"
              style="background-image: url({user.banner});"
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
                View links →
              </span>
            {:else}
              <span class="text-sm text-link hover:text-link-hover">
                No links - View Bluesky profile →
              </span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>