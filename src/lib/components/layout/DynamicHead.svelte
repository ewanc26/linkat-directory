<script lang="ts">
  // ── Dynamic Head ──────────────────────────────────────────────────────
  // Sets <title>, meta description/keywords, Open Graph, and Twitter Card
  // tags. Falls back titles/descriptions across the OG and Twitter families
  // when a specific variant isn't provided.

  import { getStores } from '$app/stores';
  const { page } = getStores();

  import type { DynamicHeadProps } from '$lib/components/shared/interfaces';

  let {
    title,
    description,
    keywords,
    ogUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth = '1200',
    ogImageHeight = '630',
    twitterCard = 'summary_large_image',
    twitterUrl,
    twitterTitle,
    twitterDescription,
    twitterImage
  }: DynamicHeadProps = $props();

  // These are all $derived rather than plain assignments: props and $page are
  // reactive, so a plain `ogTitle = ogTitle || title` would freeze the tag at
  // whatever the first render produced and leave stale metadata behind on
  // client-side navigation.
  const canonicalUrl = $derived($page.url.origin + $page.url.pathname);

  // Fallback chain: OG/Twitter-specific values -> generic title/description
  const resolvedOgUrl = $derived(ogUrl || canonicalUrl);
  const resolvedOgTitle = $derived(ogTitle || title);
  const resolvedOgDescription = $derived(ogDescription || description);
  const resolvedTwitterUrl = $derived(twitterUrl || canonicalUrl);
  const resolvedTwitterTitle = $derived(twitterTitle || title);
  const resolvedTwitterDescription = $derived(twitterDescription || description);
</script>

<svelte:head>
  <title>{title}</title>
  <link rel="canonical" href={resolvedOgUrl} />
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}

  <!-- ── Open Graph / Facebook ────────────────────────────────────── -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={resolvedOgUrl} />
  <meta property="og:title" content={resolvedOgTitle} />
  <meta property="og:description" content={resolvedOgDescription} />
  <meta property="og:site_name" content="Linkat Directory" />
  {#if ogImage}
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content={ogImageWidth} />
    <meta property="og:image:height" content={ogImageHeight} />
  {/if}

  <!-- ── Twitter Card ─────────────────────────────────────────────── -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:url" content={resolvedTwitterUrl} />
  <meta name="twitter:title" content={resolvedTwitterTitle} />
  <meta name="twitter:description" content={resolvedTwitterDescription} />
  {#if twitterImage}
    <meta name="twitter:image" content={twitterImage} />
  {/if}
</svelte:head>