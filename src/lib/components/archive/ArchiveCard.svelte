<script lang="ts">
  export let type: 'link' | 'user';
  export let url: string;
  export let title: string;
  export let value: string | undefined = undefined;
</script>

{#if type === 'link'}
  <a 
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class="block p-4 rounded-lg border hover:shadow-lg transition-shadow"
    style="background: var(--card-bg); border-color: var(--border-color);"
  >
    {#if value}
      <div class="text-2xl mb-2">{value}</div>
    {/if}
    <h3 class="font-semibold text-lg mb-1">{title}</h3>
    <p class="text-sm text-link opacity-75 truncate">{url}</p>
  </a>
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