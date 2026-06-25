<script lang="ts">
  // ── Home Page ─────────────────────────────────────────────────────────
  // Shows the user directory grid or, if no users are configured, a setup guide.
  // Metadata is generated dynamically from the owner's profile display name.

  import { getStores } from "$app/stores";
  import { env } from "$env/dynamic/public";
  import UserDirectory from "$lib/components/archive/UserDirectory.svelte";
  import DynamicHead from "$lib/components/layout/DynamicHead.svelte";
  import { getProfile } from "$lib/components/profile/profile";

  const { page } = getStores();
  let { data } = $props();

  let directoryOwner = env.DIRECTORY_OWNER ?? "";

  // Prime owner profile from layout data; fetch separately if unavailable
  let ownerProfile = $state<{ displayName?: string; handle?: string } | null>(
    data.profile || null
  );

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

  let displayUserBanner = $derived(data.displayUserBanner);
  let displayUserDescription = $derived(data.displayUserDescription);

  /**
   * Fisher-Yates (Knuth) shuffle — unbiased, in-place, O(n).
   * Used to randomise user card order so the same person isn't always first.
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

  // ── Reactive page metadata ──────────────────────────────────────────
  const pageTitle = $derived(() => {
    if (!directoryOwner) return "Linkat Directory";

    const displayName = getDisplayName(ownerProfile);
    if (displayName) {
      return `${displayName}'s Linkat Directory`;
    }

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
    <!-- ── Onboarding state ──────────────────────────────────────────── -->
    <div class="text-center py-12">
      <div class="max-w-4xl mx-auto px-4">
        <p class="text-lg mb-4 opacity-75">
          Welcome to Linkat Directory! No users are currently configured.
        </p>
        <div class="bg-[var(--muted-bg)] rounded-lg p-6 text-left overflow-hidden">
          <h3 class="font-semibold mb-2">To get started:</h3>
          <ol class="list-decimal list-inside space-y-2 text-sm">
            <li class="break-words">Copy <code class="break-all bg-[var(--card-bg)] px-1 py-0.5 rounded text-xs">. env.example</code> to <code class="break-all bg-[var(--card-bg)] px-1 py-0.5 rounded text-xs">.env</code></li>
            <li class="break-words">Set your DID: <code class="break-all bg-[var(--card-bg)] px-1 py-0.5 rounded text-xs">DIRECTORY_OWNER=did:plc:your-did-here</code></li>
            <li class="break-words">Set the origin: <code class="break-all bg-[var(--card-bg)] px-1 py-0.5 rounded text-xs">PUBLIC_ORIGIN=http://localhost:5713</code></li>
            <li class="break-words">Optionally add more users: <code class="break-all bg-[var(--card-bg)] px-1 py-0.5 rounded text-xs">PUBLIC_LINKAT_USERS=did:plc:user1,did:plc:user2</code></li>
            <li class="break-words">Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  {:else}
    <!-- ── User directory grid ───────────────────────────────────────── -->
    <UserDirectory
      users={shuffleArray([...data.linkatUsers]).map(did => ({ did }))}
      primaryUserDid={directoryOwner}
      userLinkBoards={data.userLinkBoards}
      displayBanner={displayUserBanner}
      displayDescription={displayUserDescription}
    />
  {/if}
</div>