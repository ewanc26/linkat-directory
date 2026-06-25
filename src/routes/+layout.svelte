<script lang="ts">
  // ── Root Layout ───────────────────────────────────────────────────────
  // Wraps every page with the directory header, a centred content container,
  // and the footer. Global CSS and profile data cascade through here.

  import "$css/app.css";
  import { Footer } from "$components/layout";
  import DirectoryHeader from "$lib/components/layout/DirectoryHeader.svelte";

  let { data, children } = $props();
</script>

<div class="min-h-screen">
  <DirectoryHeader />

  <div class="box-border mx-auto px-4 sm:px-8 max-w-[1000px] pb-8">
    {@render children()}

    <Footer profile={data.profile} />
  </div>
</div>
