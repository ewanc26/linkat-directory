<script lang="ts">
  import { getStores } from "$app/stores";
  import { env } from "$env/dynamic/public";
  import UserDirectory from "$lib/components/archive/UserDirectory.svelte";
  import DynamicHead from "$lib/components/layout/DynamicHead.svelte";
  import { getProfile } from "$lib/components/profile/profile";

  const { page } = getStores();
  let { data } = $props();

  // Environment variable for directory owner
  let directoryOwner = env.DIRECTORY_OWNER ?? "";

  // Profile state for directory owner - initialize with data.profile if available
  let ownerProfile = $state<{ displayName?: string; handle?: string } | null>(
    data.profile || null
  );

  // Load the directory owner's profile only if we don't already have it
  $effect(() => {
    if (directoryOwner && !ownerProfile) {
      const loadOwner = async () => {
        try {
          const result = await getProfile(fetch);
          ownerProfile = result;
        } catch (err) {
          console.error("Could not fetch owner profile:", err);
          ownerProfile = null;
        }
      };
      loadOwner();
    }
  });

  // Derived reactive values for user display options
  let displayUserBanner = $derived(data.displayUserBanner);
  let displayUserDescription = $derived(data.displayUserDescription);

  /**
   * Shuffles an array in place using the Fisher-Yates (Knuth) algorithm.
   * @param array The array to shuffle.
   * @returns The shuffled array.
   */
  function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const getDisplayName = (p: { displayName?: string; handle?: string } | null | undefined) =>
    p?.displayName || p?.handle || null;

  // Computed title that prioritizes display name, then handle, then DID
  const pageTitle = $derived(() => {
    if (!directoryOwner) return "Linkat Directory";
    
    const displayName = getDisplayName(ownerProfile);
    if (displayName) {
      return `${displayName}'s Linkat Directory`;
    }
    
    // Fallback to directoryOwner (DID) while loading
    return `${directoryOwner}'s Linkat Directory`;
  });

  const pageDescription = $derived(() => {
    if (!directoryOwner) return "Discover amazing users curated by the Linkat community";
    
    const displayName = getDisplayName(ownerProfile) || directoryOwner;
    return `Discover users' links curated by ${displayName} in ${displayName}'s Linkat Directory`;
  });

  const pageKeywords = $derived(() => {
    const baseKeywords = "Linkat, directory, links, Bluesky, community, curation";
    if (!directoryOwner) return baseKeywords;
    
    const displayName = getDisplayName(ownerProfile) || directoryOwner;
    return `${baseKeywords}, ${displayName}`;
  });
</script>

<DynamicHead
  title={pageTitle()}
  description={pageDescription()}
  keywords={pageKeywords()}
  ogTitle={pageTitle()}
  ogDescription={pageDescription()}
  twitterTitle={pageTitle()}
  twitterDescription={pageDescription()}
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
    <UserDirectory
      users={shuffleArray([...data.linkatUsers]).map(did => ({ did }))}
      primaryUserDid={directoryOwner}
      userLinkBoards={data.userLinkBoards}
      displayBanner={displayUserBanner}
      displayDescription={displayUserDescription}
    />
  {/if}
</div>