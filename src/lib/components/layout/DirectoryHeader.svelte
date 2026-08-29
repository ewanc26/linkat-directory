<script lang="ts">
  // ── Header ────────────────────────────────────────────────────────────
  // Top bar showing the directory title, computed from the owner's profile.
  // On user detail pages, a "Home" link replaces the empty space.

  import { env } from "$lib/config/public-env";
  import { page } from "$app/stores";
  import { getProfile } from "$components/profile/profile";

  let isUserPage = $derived($page.route.id === '/user/[did]');

  let profile = $state<{ displayName?: string; handle?: string } | null>(null);
  let loading = $state(true);

  $effect(() => {
    if (env.DIRECTORY_OWNER) {
      loading = true;
      getProfile(fetch)
        .then((p) => {
          profile = p;
        })
        .catch((err) => {
          // The header falls back to the raw DID, so a profile outage is not
          // surfaced as an error state here.
          console.error('Failed to load profile:', err);
          profile = null;
        })
        .finally(() => {
          loading = false;
        });
    } else {
      loading = false;
    }
  });
</script>

<header class="py-4 px-4 sm:px-8 mb-6">
  <div class="max-w-[1000px] mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-lg font-semibold text-[var(--text-color)]">
        {env.DIRECTORY_OWNER ? (
          loading ? 'Loading...' : (
            profile ?
              `${profile.displayName || profile.handle || env.DIRECTORY_OWNER}'s Linkat Directory` :
              `${env.DIRECTORY_OWNER}'s Linkat Directory`
          )
        ) : 'Linkat Directory'}
      </h1>

      {#if isUserPage}
        <a
          href="/"
          class="text-sm text-link hover:text-link-hover transition-colors"
        >
          &larr; Home
        </a>
      {/if}
    </div>
  </div>
</header>
