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
      {#if (data.featuredStudysets?.length >= 1) }
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
      {#if (data.recentStudysets?.length >= 1) }
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
      {#if data?.pageServerJSError}
      <div class="box ohno">
        <h4>Oh no!!</h4>
        <p class="fg1">There was an error in the code that loads this page.</p>
        <p class="fg1">If you're a developer/contributor, check web/src/routes/explore/+page.server.js</p>
        <p class="fg1">You probably don't need to check <a href="/api-status">API Status</a>, because this error is from qzfr-web, but have the link anyway i guess</p>
      </div>
      {:else if !(data.featuredStudysets?.length >= 1 || data.recentStudysets?.length >= 1) }
        {#if data?.apiStatus?.apiUp}
          {#if data?.apiStatus?.dbConnectionUp}
            {#if data?.graphQLErrors?.length >= 1}
            <div class="box ohno">
              <h4>Oh no!!</h4>
              <p class="fg1">Quizfreely's API sent us an error via GraphQL.</p>
              <p class="fg1">That usually means the API is running, but something is wrong in qzfr-web's query or qzfr-api's resolver (i don't know which one while i'm writing this error message)</p>
            </div>
            {:else}
              <div class="box">
                There are no public studysets to show here. <br>
                Everything loaded correctly tho (i think)
              </div>
            {/if}
          {:else}
          <div class="box ohno">
            <h4>Oh no!!</h4>
            <p class="fg1">We couldn't load anything because our API's database connection is down.</p>
            <p class="fg1">Quizfreely's API is running correctly and everything, but the DB isn't :(</p>
            <p class="fg1">Check <a href="/api-status">API Status</a> for more info</p>
          </div>
          {/if}
        {:else}
          <div class="box ohno">
            <h4>Oh no!!</h4>
            <p class="fg1">We couldn't load anything because Quizfreely's API is down.</p>
            <p class="fg1">Check <a href="/api-status">API Status</a> for more info</p>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</main>
