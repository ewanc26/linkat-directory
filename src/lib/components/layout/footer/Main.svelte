<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import TidClock from "./TidClock.svelte";

  export let profile: any;
  export const posts: any = undefined;

  onMount(() => {
    const copyrightYearElement = document.getElementById("copyright-year");
    if (copyrightYearElement) {
      copyrightYearElement.textContent = new Date().getFullYear().toString();
    }
  });
</script>

<footer class="text-center py-8 text-primary text-sm opacity-60">
  <div class="max-w-2xl mx-auto px-4">
    <!-- Main attribution line -->
    <div class="mb-4">
      <span>&copy; <span id="copyright-year"></span></span>
      <span class="mx-2">•</span>
      {#if profile?.handle}
        <a
          href="https://bsky.app/profile/{profile.did}"
          class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
        >
          @{profile.handle}
        </a>
      {:else}
        <span>{profile?.displayName || profile?.did}</span>
      {/if}
      <span class="mx-2">•</span>
      <span>powered by 
        <a
          class="text-[var(--link-color)] hover:text-[var(--link-hover-color)] transition-colors"
          href="https://atproto.com/guides/glossary#at-protocol"
        >
          atproto
        </a>
      </span>
    </div>

    <!-- Project info -->
    <div class="mb-4 text-xs opacity-75 leading-relaxed">
      <div class="mb-2">
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

    <!-- Clock -->
    <TidClock />
  </div>
</footer>