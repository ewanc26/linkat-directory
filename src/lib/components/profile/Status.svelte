<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { fade } from "svelte/transition";

  /**
   * The profile object is passed as a prop to this component.
   * It should contain at least 'displayName', 'handle', or 'did' fields.
   */
  export let profile: any;

  // RecentFM-related state
  let musicLoading = false;
  let musicError: string | null = null;
  let trackData: {
    name: string;
    artist: string;
    url: string;
  } | null = null;
  let showContent = false;

  /**
   * Fetches recent music from Last.fm via RecentFM API
   */
  async function fetchRecentMusic(): Promise<void> {
    const lastfmUsername = env.PUBLIC_LASTFM_USERNAME;

    if (!lastfmUsername) {
      return;
    }

    musicLoading = true;
    musicError = null;

    try {
      const params = new URLSearchParams({
        username: lastfmUsername,
        emoji: "🎧",
        nomoji: "false",
      });

      const url = `https://recentfm.rknight.me/now.php?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, "text/html");
        const link = doc.querySelector("a");

        if (link) {
          const fullText = link.textContent || "";
          const url = link.href;

          const match = fullText.match(/^(.+?) by (.+)$/);
          if (match) {
            trackData = {
              name: match[1].trim(),
              artist: match[2].trim(),
              url: url,
            };
          }
        }
      }
    } catch (err) {
      console.error("[RecentFM] Error fetching RecentFM data:", err);
      musicError = "Failed to load recent tracks";
    } finally {
      musicLoading = false;
    }
  }

  // Load data on mount
  onMount(async () => {
    await fetchRecentMusic();

    // Introduce a delay before showing content
    setTimeout(() => {
      showContent = true;
    }, 2000); // 2 second delay
  });
</script>

<!-- Last.fm Music Display -->
{#if showContent && profile}
  <div transition:fade={{ duration: 500 }}>
    <div class="py-2">
      {#if trackData}
        <!-- Music Display -->
        <div class="recent-track-info">
          <p class="text-xs opacity-60 text-center sm:text-left">
            {profile.displayName || profile.handle || profile.did} was last listening
            to
          </p>
          <p class="text-xs font-medium text-center sm:text-left mt-0.5">
            <a
              href={trackData.url}
              class="text-link hover:text-link-hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              "{trackData.name}" by {trackData.artist}
            </a>
          </p>
        </div>
      {:else if musicError}
        <p class="text-xs opacity-60 text-center sm:text-left text-red-500">
          {musicError}
        </p>
      {/if}

      {#if musicLoading}
        <p class="text-xs opacity-60 italic text-center sm:text-left">
          Loading recent tracks...
        </p>
      {/if}
    </div>
  </div>
{/if}