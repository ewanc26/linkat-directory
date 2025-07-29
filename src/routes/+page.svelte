<script lang="ts">
  import { onMount } from "svelte";
  import { getStores } from "$app/stores";
  const { page } = getStores();
  import UserDirectory from "$lib/components/archive/UserDirectory.svelte";
  import DynamicHead from "$lib/components/layout/DynamicHead.svelte";

  let { data } = $props();
  let displayUserBanner = $derived(data.displayUserBanner);
let displayUserDescription = $derived(data.displayUserDescription);

  // State to track if locale has been properly loaded
  let localeLoaded = $state(false);

  onMount(() => {
    // Set a brief timeout to ensure the browser has time to determine locale
    setTimeout(() => {
      localeLoaded = true;
    }, 10);
  });

  import { getProfile } from "$lib/components/profile/profile";
  let profile = $state<{ displayName?: string; handle?: string } | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    if (import.meta.env.DIRECTORY_OWNER) {
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

<DynamicHead
  title={profile?.displayName || "Linkat Directory"}
  description={profile?.displayName ? `Discover users' links curated by ${profile.displayName}` : "Discover amazing users curated by the Linkat community"}
  keywords={`Linkat, directory, links, Bluesky, community, curation${profile?.displayName ? `, ${profile.displayName}` : ''}`}
  ogTitle={profile?.displayName || "Linkat Directory"}
  ogDescription={profile?.displayName ? `Discover users' links curated by ${profile.displayName}` : "Discover amazing users' links curated by the Linkat community"}
  twitterTitle={profile?.displayName || "Linkat Directory"}
  twitterDescription={profile?.displayName ? `Discover users' links curated by ${profile.displayName}` : "Discover amazing users' links curated by the Linkat community"}
/>

<div class="container mx-auto px-4 py-8">
  {#if data.noUsersConfigured}
    <div class="text-center py-12">
      <div class="max-w-md mx-auto">
        <p class="text-lg mb-4 opacity-75">
          Welcome to Linkat Directory! No users are currently configured.
        </p>
        <div class="bg-[var(--muted-bg)] rounded-lg p-6 text-left">
          <h3 class="font-semibold mb-2">To get started:</h3>
          <ol class="list-decimal list-inside space-y-2 text-sm">
            <li>Create a <code>.env</code> file in your project root</li>
            <li>Add your user DID: <code>DIRECTORY_OWNER=did:plc:your-did-here</code></li>
            <li>Or add multiple users: <code>PUBLIC_LINKAT_USERS=did:plc:user1,did:web:user2</code></li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  {:else}
    <UserDirectory users={data.linkatUsers.map(did => ({ did }))} primaryUserDid={data.primaryUserDid} userLinkBoards={data.userLinkBoards} displayBanner={displayUserBanner} displayDescription={displayUserDescription} />
  {/if}
</div>