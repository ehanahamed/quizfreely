<script>
    let { data } = $props();
</script>

<svelte:head>
    <title>Quizfreely: Free & Open Source Studying Tool</title>
    <meta name="description" content="Quizfreely is a free and open source learning app with flashcards, practice tests, and more tools to help you study." />
    <meta name=”robots” content="index, follow" />
    <link rel="canonical" href="https://quizfreely.org" />
</svelte:head>

<main>
<div class="grid intro" style="margin-bottom: 0px; padding-bottom: 0px; border:none">
    <div class="logotype">
      <div class="logo">
        <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="a"><stop style="stop-color:#00b377;stop-opacity:1" offset="0"/><stop style="stop-color:#6fc;stop-opacity:1" offset="1"/></linearGradient><linearGradient id="b"><stop style="stop-color:#7c49f2;stop-opacity:1" offset="0"/><stop style="stop-color:#9466ff;stop-opacity:1" offset="1"/></linearGradient><linearGradient xlink:href="#a" id="d" x1="130" y1="400" x2="385" y2="150" gradientUnits="userSpaceOnUse" gradientTransform="translate(36.902 -20.78)"/><linearGradient xlink:href="#b" id="c" gradientUnits="userSpaceOnUse" gradientTransform="translate(33.36 -551.01)" x1="70" y1="140" x2="375" y2="450"/></defs><path d="M295.74-412.406q6.927 6.745 6.927 16.406 0 9.662-6.927 16.589-6.745 6.744-16.407 6.744H116q-9.661 0-16.588-6.744-6.745-6.927-6.745-16.589 0-9.661 6.745-16.406 6.927-6.927 16.588-6.927h163.333q9.662 0 16.407 6.927zm0 186.666q6.927 6.745 6.927 16.407 0 9.661-6.927 16.588Q288.995-186 279.333-186H116q-9.661 0-16.588-6.745-6.745-6.927-6.745-16.588 0-9.662 6.745-16.407 6.927-6.927 16.588-6.927h163.333q9.662 0 16.407 6.927zM99.412-286.078q-6.745-6.927-6.745-16.589 0-9.661 6.745-16.406Q106.339-326 116-326h280q9.661 0 16.406 6.927 6.927 6.745 6.927 16.406 0 9.662-6.927 16.589-6.745 6.745-16.406 6.745H116q-9.661 0-16.588-6.745zm312.994 153.672q6.927 6.744 6.927 16.406 0 9.661-6.927 16.406-6.745 6.927-16.406 6.927H116q-9.661 0-16.588-6.927-6.745-6.745-6.745-16.406 0-9.662 6.745-16.406 6.927-6.927 16.588-6.927h280q9.661 0 16.406 6.927z" style="font-size:373.333px;font-family:'NotoMono Nerd Font Propo';-inkscape-font-specification:'NotoMono Nerd Font Propo';fill:url(#c);stroke-width:40;paint-order:markers stroke fill" transform="scale(1 -1)"/><path d="M395.792 139.333q8.333 0 14.166 5.834 5.834 5.833 5.834 14.166 0 8.334-5.834 14.167L216.625 366.833q-5.833 5.834-14.167 5.834-8.333 0-14.166-5.834l-21.667-21.666-43.333-43.334-21.667-21.666q-5.417-5.834-5.417-13.75 0-8.125 5.834-13.959 6.041-6.041 14.166-6.041 7.917 0 13.75 5.416l18.125 18.125 36.25 36.25 18.125 18.125 179.167-179.166q5.833-5.834 14.167-5.834z" style="font-size:426.667px;font-family:'NotoMono Nerd Font Propo';-inkscape-font-specification:'NotoMono Nerd Font Propo';fill:url(#d);stroke:#2b2b3d;stroke-width:40;paint-order:markers stroke fill"/></svg>
      </div>
      <div>
        <p class="h3">Quizfreely</p>
      </div>
    </div>
    <div class="content">
      <h1 class="h2" style="max-width: 36rem; margin: auto">
        A studying tool that's <span class="extra">actually free</span>
      </h1>
      <p style="max-width: 28rem; margin: auto; margin-top: 1rem">
        Quizfreely is a free and open source learning app with flashcards, review/learn mode, practice tests, & more!
      </p>
      <div class="flex center">
        <a href="/sign-up" class="button large">Get Started</a>
        <a href="/explore" class="button large alt">Explore</a>
      </div>
    </div>
  </div>
  <div class="wave-top extra-bg"></div>
  <div class="grid page extra">
    <div class="content">
      <div>
        <h2 class="h3">It's <span class="extra">free</span> and <span class="extra">open source</span></h2>
        <p>
          Quizfreely is made by volunteers and contributors.<br />
          Quizfreely is not owned by any company or buisness.<br />
          You can see our source code and contribute on Codeberg or GitHub.
        </p>
        <div class="flex">
          <a class="button extra" href="https://codeberg.org/quizfreely/quizfreely">
            Codeberg
          </a>
          <a class="button extra alt" href="https://github.com/quizfreely/quizfreely">
            GitHub
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="wave-bottom extra-bg"></div>
  <div class="grid page">
    <div class="content">
      {#if data?.featuredRows && data.featuredRows.length >= 1 }
      <h2 class="h3">Find flashcard sets & study guides</h2>
      <p>
        Quizfreely has <span class="s">hundreds of</span> <span class="fg0 i">a few</span> sets made by teachers & students.<br />
        <a href="/explore">Explore more studysets</a>
      </p>
      <div class="grid list" style="overflow-wrap:anywhere">
        {#each data.featuredRows as featuredStudyset }
          <div class="box">
            <a href={"/studysets/" + featuredStudyset.id}>
              { featuredStudyset.title }
            </a>
            <p class="h6" style="margin-top:0.4rem;margin-bottom:0px">
              { featuredStudyset.user_display_name }
            </p>
            {#if featuredStudyset.terms_count >= 1}
            <p class="h6" style="margin-top:0.2rem;margin-bottom:0.2rem">
              { featuredStudyset.terms_count } Terms
            </p>
            {/if}
          </div>
        {/each}
      </div>
      {:else}
      <h2 class="h3">Find flashcard sets & study guides</h2>
      <p>Quizfreely has <span class="s">hundreds of</span> <span class="fg0 i">a few</span> sets made by teachers & students.</p>
      <div class="flex">
        <a href="/explore" class="button">
          Explore
        </a>
      </div>
      <br />
      <br />
      {/if}
      <!--<div class="flex">
        <a href="/sign-up" class="button">
          Create account
        </a>
        <a href="/dashboard" class="button alt">
          Study without an account
        </a>
      </div>
      <p>Already have an account? <a href="/sign-in">Sign in</a></p>-->
    </div>
  </div>
</main>
