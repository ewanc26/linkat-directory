<script lang="ts">
  // ── Multi-User Links ──────────────────────────────────────────────────
  // Renders link boards for multiple users in separate sections. When only
  // one user has links, the header label is hidden to keep the UI clean.

  import ArchiveCard from "$lib/components/archive/ArchiveCard.svelte";
  import type { LinkBoard } from "$components/shared";

  let { userLinkBoards = {}, profile }: {
    userLinkBoards?: { [did: string]: LinkBoard | undefined },
    profile: any
  } = $props();

  // Collapse the boards map into a clean array, dropping users with no cards
  let validBoards = $derived(Object.entries(userLinkBoards)
    .filter(([, board]) => board && board.cards && board.cards.length > 0)
    .map(([did, board]) => ({ did, board: board! })));

  function getUserDisplayName(did: string): string {
    if (did === profile.did) {
      return profile.displayName || "My Links";
    }
    // Future: resolve profiles for non-primary users to show real names
    return `User ${did.slice(-8)}`;
  }
</script>

{#if validBoards.length > 0}
  <div class="space-y-8">
    {#each validBoards as { did, board } (did)}
      <div class="user-links-section">
        {#if validBoards.length > 1}
          <div class="flex items-center mb-4">
            <h3 class="text-lg font-semibold text-[var(--text-color)]">
              {getUserDisplayName(did)}
            </h3>
            <span class="ml-2 text-sm text-[var(--text-color-secondary)]">
              ({board.cards.length} link{board.cards.length !== 1 ? 's' : ''})
            </span>
          </div>
        {:else}
          <div class="mb-4"></div>
        {/if}

        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr)_)] gap-x-6 gap-y-6"
        >
          {#each board.cards as link}
            <ArchiveCard type="link" url={link.url} title={link.text} value={link.emoji} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="mb-12 ml-4 text-center text-sm italic opacity-75">
    create <code>blue.linkat.board</code> records at <a href="https://linkat.blue/" class="text-link hover:text-link-hover">https://linkat.blue/</a>
  </div>
{/if}