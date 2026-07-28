<script lang="ts">
  // ── Archive Card ──────────────────────────────────────────────────────
  // Renders a single card in the directory grid. Two modes: 'link' shows an
  // emoji + title + URL; 'user' shows title + URL.
  //
  // `url` for a 'link' card comes from someone else's `blue.linkat.board`
  // record and is untrusted. It is scheme-checked before it becomes an
  // href, so a `javascript:` or `data:` card renders as inert text rather
  // than a clickable script payload.

  import { safeLinkUrl } from "$utils/untrusted";

  let {
    type,
    url,
    title,
    value = undefined
  }: {
    type: 'link' | 'user';
    url: string;
    title: string;
    value?: string | undefined;
  } = $props();

  let safeUrl = $derived(type === 'link' ? safeLinkUrl(url) : url);
</script>

{#if type === 'link'}
  {#if safeUrl}
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="block p-4 rounded-lg border hover:shadow-lg transition-shadow"
      style="background: var(--card-bg); border-color: var(--border-color);"
    >
      {#if value}
        <div class="text-2xl mb-2">{value}</div>
      {/if}
      <h3 class="font-semibold text-lg mb-1">{title}</h3>
      <p class="text-sm text-link opacity-75 truncate">{safeUrl}</p>
    </a>
  {:else}
    <div
      class="block p-4 rounded-lg border opacity-60"
      style="background: var(--card-bg); border-color: var(--border-color);"
    >
      {#if value}
        <div class="text-2xl mb-2">{value}</div>
      {/if}
      <h3 class="font-semibold text-lg mb-1">{title}</h3>
      <p class="text-sm italic opacity-75">This link was hidden because it uses an unsupported address.</p>
    </div>
  {/if}
{:else if type === 'user'}
  <a
    href={url}
    class="block p-4 rounded-lg border hover:shadow-lg transition-shadow"
    style="background: var(--card-bg); border-color: var(--border-color);"
  >
    <h3 class="font-semibold text-lg mb-1">{title}</h3>
    <p class="text-sm text-link opacity-75 truncate">{url}</p>
  </a>
{/if}
