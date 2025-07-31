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

  // Profile state for directory owner
  let ownerProfile = $state<{ displayName?: string; handle?: string } | null>(null);

  // Load the directory owner's profile
  $effect(() => {
    if (directoryOwner) {
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
</script>

<DynamicHead
  title={
    directoryOwner
      ? `${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Linkat Directory"
  }
  description={
    directoryOwner
      ? `Discover users' links curated by ${getDisplayName(ownerProfile) || directoryOwner} in ${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Discover amazing users curated by the Linkat community"
  }
  keywords={`Linkat, directory, links, Bluesky, community, curation${directoryOwner ? `, ${getDisplayName(ownerProfile) || directoryOwner}` : ""}`}
  ogTitle={
    directoryOwner
      ? `${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Linkat Directory"
  }
  ogDescription={
    directoryOwner
      ? `Discover users' links curated by ${getDisplayName(ownerProfile) || directoryOwner} in ${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Discover amazing users' links curated by the Linkat community"
  }
  twitterTitle={
    directoryOwner
      ? `${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Linkat Directory"
  }
  twitterDescription={
    directoryOwner
      ? `Discover users' links curated by ${getDisplayName(ownerProfile) || directoryOwner} in ${getDisplayName(ownerProfile) || directoryOwner}'s Linkat Directory`
      : "Discover amazing users' links curated by the Linkat community"
  }
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