<script>
    let { data } = $props();
</script>

<svelte:head>
    <title>Explore & Search - Quizfreely</title>
    <meta name="description" content="Quizfreely is a free and open source learning app with flashcards, practice tests, and more tools to help you study." />
    <meta name=”robots” content="index, follow" />
</svelte:head>

<main>
  <div class="grid page">
    <div class="content">
      {#if (data.featuredStudysets.length >= 1) }
      <h2 class="h4">Featured Studysets</h2>
      <div class="grid list" style="overflow-wrap:anywhere">
        {#each data.featuredStudysets as featuredStudyset }
          <div class="box">
            <a href="/studysets/{ featuredStudyset.id }">
              { featuredStudyset.title }
            </a>
            <p class="h6" style="margin-top:0.4rem;margin-bottom:0px">
              { featuredStudyset.user_display_name }
            </p>
            {#if (featuredStudyset.terms_count >= 1) }
            <p class="h6" style="margin-top:0.2rem;margin-bottom:0.2rem">
              { featuredStudyset.terms_count } Terms
            </p>
            {/if}
          </div>
        {/each}
      </div>
      {/if}
      {#if (data.recentStudysets.length >= 1) }
      <h2 class="h4">Recently Created or Updated</h2>
        <div class="grid list" style="overflow-wrap:anywhere">
          {#each data.recentStudysets as studyset }
            <div class="box">
              <a href="/studysets/{ studyset.id }">
                { studyset.title }
              </a>
              <p class="h6" style="margin-top:0.4rem;margin-bottom:0px">
                { studyset.user_display_name }
              </p>
              {#if (studyset.terms_count >= 1) }
              <p class="h6" style="margin-top:0.2rem;margin-bottom:0.2rem">
                { studyset.terms_count } Terms
              </p>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
