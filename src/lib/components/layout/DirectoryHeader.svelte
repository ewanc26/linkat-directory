<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { getProfile } from "$components/profile/profile";
  
  let isUserPage = $derived($page.route.id === '/user/[did]');
  
  let profile = $state<{ displayName?: string; handle?: string } | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  
  $effect(() => {
    if (env.DIRECTORY_OWNER) {
      loading = true;
      getProfile(fetch)
        .then((p) => {
          profile = p;
          error = null;
        })
        .catch((err) => {
          console.error('Failed to load profile:', err);
          error = err.message;
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
          ← Home
        </a>
      {/if}
    </div>
  </div>
</header>