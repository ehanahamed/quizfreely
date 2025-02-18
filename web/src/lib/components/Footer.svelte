<script>
  import IconCodeberg from "$lib/icons/Codeberg.svelte";
  import IconGitHub from "$lib/icons/GitHub.svelte";
</script>

<div id="footer-wave" class="wave-top bg0"></div>
<footer id="footer" class="background-bg0" style="border: none; margin: 0px; padding-top: 1rem; padding-bottom: 8rem;">
    <h2>Quizfreely</h2>
    <p>Quizfreely is free and open source <br> Made by Ehan A & contributors</p>
    <div class="flex center compact-gap">
      <a href="https://codeberg.org/quizfreely/quizfreely" class="button icon-only-button">
        <IconCodeberg />
        Codeberg
      </a>
      <a href="https://github.com/quizfreely/quizfreely" class="button icon-only-button">
        <IconGitHub />
        GitHub
      </a>
    </div>
    <div class="grid list" style="text-align: start; padding: 2rem; margin-top: 2rem">
      <div>
        <p class="h4">About</p>
        <div class="flex col compact-gap" style="width:fit-content">
          <a href="/landing-page">Landing Page</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
      <div>
        <p class="h4">Development</p>
        <div class="flex col compact-gap" style="width:fit-content">
          <a href="https://codeberg.org/quizfreely/quizfreely">Source Code (Codeberg)</a>
          <a href="https://github.com/quizfreely/quizfreely">Source Code (GitHub)</a>
          <a href="/api-status">API Status</a>
        </div>
      </div>
      <div>
        <p class="h4">Community</p>
        <div class="flex col compact-gap" style="width:fit-content">
          <a href="https://matrix.to/#/#quizfreely-space:matrix.org">Matrix Space</a>
          <a href="https://quizfreely.org/discord">Discord Server</a>
        </div>
      </div>
    </div>
    <div style="text-align: start; padding: 0px 2rem">
      <p>
        v0.29.1 · <a href="https://codeberg.org/quizfreely/quizfreely/releases">Changelog (on Codeberg)</a> or <a href="https://github.com/quizfreely/quizfreely/releases">on GitHub</a>
      </p>
      <p>
        Copyright © 2022-2025 Ehan Ahamed and contributors
        <br />
        <!--<a href="/license">License</a>-->
      </p>
    </div>
</footer>
