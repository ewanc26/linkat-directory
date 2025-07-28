<script lang="ts">
  import DynamicLinks from "$lib/components/layout/main/DynamicLinks.svelte";
  import DynamicHead from "$lib/components/layout/DynamicHead.svelte";
  import { getStores } from "$app/stores";
  const { page } = getStores();
  
  let { data } = $props();
  
  let profile = $derived(data.profile);
  let dynamicLinks = $derived(data.dynamicLinks);
  let error = $derived(data.error);
  let did = $derived(data.did);
</script>

<DynamicHead
  title={profile?.displayName || did + " - Linkat Directory"}
  description={"View " + (profile?.displayName || did) + "'s curated Linkat links"}
  ogTitle={profile?.displayName || did + " - Linkat Directory"}
  ogDescription={"View " + (profile?.displayName || did) + "'s curated Linkat links"}
  twitterTitle={profile?.displayName || did + " - Linkat Directory"}
  twitterDescription={"View " + (profile?.displayName || did) + "'s curated Linkat links"}
  keywords={`Linkat, directory, links, Bluesky, curation, ${profile?.displayName || did}`}
/>

<div class="container mx-auto px-4 py-8">
  {#if error}
    <div class="text-center py-8">
      <h1 class="text-2xl font-bold mb-4">Error</h1>
      <p class="text-[var(--error-color)]">{error}</p>
    </div>
  {:else if !profile}
    <div class="text-center py-8">
      <h1 class="text-2xl font-bold mb-4">User Not Found</h1>
      <p class="text-[var(--placeholder-color)]">The user with DID {did} was not found.</p>
    </div>
  {:else}
    <div class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="bg-[var(--card-bg)] rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
          {#if profile.avatar}
            <img 
              src={profile.avatar} 
              alt={profile.displayName || profile.handle}
              class="w-20 h-20 rounded-full object-cover"
            />
          {:else}
            <div class="w-20 h-20 rounded-full bg-[var(--muted-bg)] flex items-center justify-center">
              <span class="text-3xl font-bold text-[var(--text-color)]">
                {(profile.displayName || profile.handle || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          {/if}
          
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold">{profile.displayName || profile.handle}</h1>
            <p class="text-[var(--secondary-text-color)]">@{profile.handle}</p>
            <code class="text-[var(--secondary-text-color)] text-sm">{did}</code>
            {#if profile.description}
              <p class="text-[var(--text-color)] mt-2">{profile.description}</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Links Section -->
      <div class="bg-[var(--card-bg)] rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Links</h2>
        <DynamicLinks data={dynamicLinks} />
      </div>
    </div>
  {/if}
</div>