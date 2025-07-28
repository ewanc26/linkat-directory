<script lang="ts">
  import { getStores } from "$app/stores";
  const { page } = getStores();
  import { HomeIcon } from "$components/icons";

  let {} = $props();
</script>

<nav class="flex items-center box-border my-6">
  <div class="flex items-center gap-4">
    {#if $page.url.pathname !== "/"}
      <a
        href="/"
        class="font-medium text-[large] hover:text-[var(--link-hover-color)]"
        aria-label="Home"
      >
        <HomeIcon />
      </a>
    {/if}
  </div>
</nav>
