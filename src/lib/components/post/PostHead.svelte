<script lang="ts">
  import { getStores } from "$app/stores";
  const { page } = getStores();
  import type { Post } from "$components/shared";
  import { env } from "$env/dynamic/public";

  export let post: Post | undefined;
</script>

<svelte:head>
  {#if post !== undefined}
    <title>{post?.title} - Blog - Site Name</title>
    <meta name="description" content={post.excerpt} />
    <meta
      name="keywords"
      content="personal blog, Blog - Site Name"
    />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content={$page.url.origin + $page.url.pathname} />
    <meta
      property="og:title"
      content={`${post.title} - Blog - Site Name`}
    />
    <meta property="og:description" content={post.excerpt} />
    <meta property="og:site_name" content="Blog - Site Name" />
    {#if $page.url.origin}
    <meta property="og:image" content={$page.url.origin + "/embed/blog.png"} />
{/if}
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta
      property="article:published_time"
      content={post.createdAt.toISOString()}
    />
    <meta property="article:word_count" content={post.wordCount.toString()} />

    <!-- Fediverse -->
    {#if env.PUBLIC_ACTIVITYPUB_USER && env.PUBLIC_ACTIVITYPUB_USER.length > 0}
      <meta name="fediverse:creator" content={env.PUBLIC_ACTIVITYPUB_USER}>
    {/if}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={$page.url.origin + $page.url.pathname} />
    <meta
      name="twitter:title"
      content={`${post.title} - Blog - Site Name`}
    />
    <meta name="twitter:description" content={post.excerpt} />
    {#if $page.url.origin}
    <meta name="twitter:image" content={$page.url.origin + "/embed/blog.png"} />
{/if}
  {:else}
    <title>Post Not Found - Blog - Site Name</title>
    <meta
      name="description"
      content="The requested blog post could not be found."
    />
  {/if}
</svelte:head>
