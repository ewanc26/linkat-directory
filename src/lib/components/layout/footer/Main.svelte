<script lang="ts">
  // ── Footer ────────────────────────────────────────────────────────────
  // Copyright line with the owner's Bluesky handle (if available) and an
  // expandable "About" section with attribution and licensing details.

  import { onMount } from "svelte";

  export let profile: any;
  let showDetails = false;

  // Set the copyright year on mount since SvelteKit renders the shell
  // server-side and the current year won't be dynamic otherwise.
  onMount(() => {
    const copyrightYearElement = document.getElementById("copyright-year");
    if (copyrightYearElement) {
      copyrightYearElement.textContent = new Date().getFullYear().toString();
    }
  });

  function toggleDetails() {
    showDetails = !showDetails;
  }
</script>

<footer class="text-center py-6 text-primary text-sm opacity-60">
  <div class="max-w-2xl mx-auto px-4">
    <div class="mb-3">
      <span>&copy; <span id="copyright-year"></span></span>
      {#if profile?.handle}
        <span class="mx-2">&bull;</span>
        <a
          href="https://bsky.app/profile/{profile.did}"
          class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
        >
          @{profile.handle}
        </a>
      {/if}
      <span class="mx-2">&bull;</span>
      <button
        class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors underline bg-none border-none cursor-pointer text-sm"
        on:click={toggleDetails}
      >
        {showDetails ? 'Hide details' : 'About'}
      </button>
    </div>

    {#if showDetails}
      <div class="text-xs opacity-75 leading-relaxed space-y-2 transition-all duration-200">
        <div>
          Linkat Directory made by
          <a
            class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
            href="https://bsky.app/profile/did:plc:ofrbh253gwicbkc5nktqepol"
          >
            ewan
          </a>
        </div>
        <div>
          <a
            class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
            href="https://github.com/ewanc26/linkat-directory"
          >
            Open source
          </a>
          and free to use under AGPL-3.0. Not affiliated with
          <a
            class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
            href="https://linkat.blue"
          >
            Linkat
          </a>
        </div>
      </div>
    {/if}
  </div>
</footer>