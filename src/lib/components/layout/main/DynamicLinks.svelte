<script lang="ts">
  // ── Dynamic Links ─────────────────────────────────────────────────────
  // Renders a link board's cards as an auto-filling grid. Shows a help
  // message with a link to Linkat when no cards exist.

  import ArchiveCard from "$lib/components/archive/ArchiveCard.svelte";
  import type { LinkBoard } from "$components/shared";

  let { data }: { data: LinkBoard | undefined } = $props();
</script>

{#if data && data.cards.length > 0}
  <div class="mb-12">
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr)_)] gap-x-6 gap-y-6 my-6"
    >
      {#each data.cards as link}
        <ArchiveCard
          type="link"
          url={link.url}
          title={link.text}
          value={link.emoji}
        />
      {/each}
    </div>
  </div>
{:else}
  <div class="mb-12 ml-4 text-center text-sm italic opacity-75">
    create a <code>blue.linkat.board</code> record at <a href="https://linkat.blue/" class="text-link hover:text-link-hover">https://linkat.blue/</a>
  </div>
{/if}