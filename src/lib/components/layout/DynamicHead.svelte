<script lang="ts">
  import { getStores } from '$app/stores';
  const { page } = getStores();

  import type { DynamicHeadProps } from '$lib/components/shared/interfaces';

  // Define props for dynamic head content
  let { 
    title,
    description,
    keywords,
    ogUrl = $page.url.origin + $page.url.pathname,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth = '1200',
    ogImageHeight = '630',
    twitterCard = 'summary_large_image',
    twitterUrl = $page.url.origin + $page.url.pathname,
    twitterTitle,
    twitterDescription,
    twitterImage
  }: DynamicHeadProps = $props();

  // Fallback for Open Graph and Twitter titles/descriptions if not provided
  ogTitle = ogTitle || title;
  ogDescription = ogDescription || description;
  twitterTitle = twitterTitle || title;
  twitterDescription = twitterDescription || description;
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:site_name" content="Linkat Directory" />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content={ogImageWidth} />
    <meta property="og:image:height" content={ogImageHeight} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:url" content={twitterUrl} />
  <meta name="twitter:title" content={twitterTitle} />
  <meta name="twitter:description" content={twitterDescription} />
  {#if twitterImage}
    <meta name="twitter:image" content={twitterImage} />
  {/if}
</svelte:head>