<script>
    import Noscript from "$lib/components/Noscript.svelte";
    import Searchbar from "$lib/components/Searchbar.svelte";

    let { data } = $props();
</script>

<svelte:head>
    {#if data.query}
    <title>Search "{ data.query }" - Quizfreely</title>
    <meta name=”robots” content="noindex" />
    {:else}
    <title>Search Quizfreely</title>
    <meta name="description" content="Quizfreely is a free and open source learning app with flashcards, practice tests, and more tools to help you study." />
    {/if}
</svelte:head>

<Noscript />
<main>
  <div class="grid page">
    <div class="content">
      {#if (data.query) }
      <p>Results for "{ data.query }"</p>
      <div class="grid list" style="overflow-wrap:anywhere">
      {#each data.results as studyset }
      <div class="box">
        <a href="/studysets/{ studyset.id }">
          { studyset.title }
        </a>
        {#if (studyset.terms_count >= 1) }
        <p class="h6">
          { studyset.terms_count } Terms
        </p>
        {/if}
      </div>
      {/each}
      </div>
      {:else}
      <h2 style="text-align:center;margin-top:4rem;margin-bottom:0px">Google 2</h2>
      <p class="fg0" style="text-align:center;margin-top:0.2rem">The Sequel</p>
      <Searchbar />
      <div style="margin-bottom:20rem"></div>
      {/if}
    </div>
  </div>
</main>
