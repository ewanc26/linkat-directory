<script lang="ts">
  import { onMount } from "svelte";
  import { getStores } from "$app/stores";
  const { page } = getStores();
  import { DynamicLinks, LatestBlogPost } from "$components/layout/main";

  let { data } = $props();

  // State to track if locale has been properly loaded
  let localeLoaded = $state(false);

  onMount(() => {
    // Set a brief timeout to ensure the browser has time to determine locale
    setTimeout(() => {
      localeLoaded = true;
    }, 10);
  });
</script>

<svelte:head>
  <title>Site Name</title>
  <meta
    name="description"
    content="Welcome to Site Name - A personal space where I share my thoughts on coding, technology, and life."
  />
  <meta
    name="keywords"
    content="Ewan, personal website, coding, technology, programming, tech blog, Site Name"
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.origin + $page.url.pathname} />
  <meta property="og:title" content="Site Title" />
  <meta
    property="og:description"
    content="Welcome to Site Name - A personal space where I share my thoughts on coding, technology, and life."
  />
  <meta property="og:site_name" content="Site Name" />
  {#if $page.url.origin}
    <meta property="og:image" content={$page.url.origin + "/embed/main.png"} />
{/if}
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={$page.url.origin + $page.url.pathname} />
  <meta name="twitter:title" content="Site Title" />
  <meta
    name="twitter:description" content="A personal space where I share my thoughts on coding, technology, and life."
  />
  {#if $page.url.origin}
    <meta name="twitter:image" content={$page.url.origin + "/embed/main.png"} />
{/if}
</svelte:head>

<!-- Latest Blog Post section (only show if we have posts) -->
{#if data.latestPosts && data.latestPosts.length > 0}
  <LatestBlogPost posts={data.latestPosts} {localeLoaded} />
{/if}

<DynamicLinks data={data.dynamicLinks} />