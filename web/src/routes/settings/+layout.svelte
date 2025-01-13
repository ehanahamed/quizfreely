
<!-- <eta>~ include("./partials/noscript") </eta> -->
<main>
  <div class="grid page">
    <div class="content">
      <h2>Settings</h2>
      <h3>Appearance</h3>
      <p>Theme</p>
      <div class="grid list">
        <a href="/settings/themes/auto" class={
            "button button-box no-clickable-effect" + (data.theme == "auto" ? "selected" : "")
        }>
          <img src="/assets/img/themes/theme-preview-auto.png" style="width:100%;border-radius:0.8rem" alt="Auto Dark/Light Theme Preview">
          <p>Auto</p>
        </a>
        <a href="/settings/themes/dark" class={
            "button button-box no-clickable-effect" + (data.theme == "dark" ? "selected" : "")
        }>
          <img src="/assets/img/themes/theme-preview-dark.png" style="width:100%;border-radius:0.8rem" alt="Dark Theme Preview">
          <p>Dark</p>
        </a>
        <a href="/settings/themes/light" class={
            "button button-box no-clickable-effect" + (data.theme == "light" ? "selected" : "")
        }>
          <img src="/assets/img/themes/theme-preview-light.png" style="width:100%;border-radius:0.8rem" alt="Light Theme Preview">
          <p>Light</p>
        </a>
      </div>
      <p>Date & Time</p>
      <div>
        <div class="combo-select">
          <button id="time-24h" class="left">
            <i class="combo-selected-icon nf nf-fa-check"></i>
            24 Hour
          </button>
          <!--
            12h has selected class by default before being modified by js with localStorage
            because everywhere else also defaults to 12h if the setting isn't set in localStorage
          -->
          <button id="time-12h" class="right selected">
            <i class="combo-selected-icon nf nf-fa-check"></i>
            12 Hour (AM/PM)
          </button>
        </div>
      </div>
      <h3>Account</h3>
      {#if data.authed}
      <div id="account-signedin-div" class="box">
        <div class="flex compact-gap align-end" id="display-name-view-div">
          <p>
            <span class="h6">Display name:</span><br />
            <span id="account-display-name">{ data.authedUser.display_name }</span>
          </p>
          <button class="icon-only-button" id="display-name-edit-button"><i class="nf nf-fa-pencil"></i></button>
        </div>
        <div id="display-name-edit-div" class="hide" style="margin-top:0px">
          <p class="h6" style="margin-bottom:0.6rem">Display Name:</p>
          <div class="flex" style="margin-top:0px">
            <input type="text" id="display-name-edit" placeholder="Display Name" value={ data.authedUser.display_name } />
          </div>
          <div class="flex">
            <button id="display-name-edit-save-button">Save</button>
            <button id="display-name-edit-cancel-button" class="alt">Cancel</button>
          </div>
        </div>
        {#if data.authedUser.auth_type == "oauth_google"}
        <div id="account-oauth-google-div">
            <p class="fg0">Signed in with Google</p>
            <p>
              <span class="h6">Google account:</span><br />
              <span id="account-oauth-google-email">{ data.authedUser.oauth_google_email }</span>
            </p>
          </div>
        {:else}
        <div id="account-username-password-div">
          <p>
            <span class="h6">Username:</span><br />
            <span id="account-username">{ data.authedUser.username }</span>
          </p>
        </div>
        {/if}
        <div class="flex">
          <button id="account-sign-out-button" class="ohno">Sign out</button>
        </div>
      </div>
      {:else}
      <div id="account-not-signedin-div" class="box">
        <p>
          You're not signed in.<br />
          Do you want to <a href="./sign-in">sign in</a> or <a href="./sign-up">create an account</a>?
        </p>
      </div>
      {/if}
      <!--<h3>Data & Privacy</h3>
      <div class="box">
        <p>Some settings are stored as cookies.<br />
        Quizfreely does not use third-party cookies or trackers.<br />
        Clearing cookies will reset some settings and sign you out.</p>
        <a href="/settings/clear-cookies" class="button ohno">Clear cookies</a>
        <p>
          ~~Local data~~ and some settings are saved using localStorage.<br/>
          Clearing localStorage will delete local/on-device studysets and will sign out of your account.
        </p>
        <button class="ohno">Clear localStorage</button>
      </div>
      <div class="modal hide">
        <div class="content">
          <p></p>
        </div>
      </div>-->
    </div>
  </div>
</main>
<script>
  document.getElementById("time-24h").addEventListener("click", function () {
    document.getElementById("time-24h").classList.add("selected")
    document.getElementById("time-12h").classList.remove("selected")
    if (window.localStorage) {
      localStorage.setItem("settingTimeHour", "24h")
    }
  })
  document.getElementById("time-12h").addEventListener("click", function () {
    document.getElementById("time-24h").classList.remove("selected")
    document.getElementById("time-12h").classList.add("selected")
    if (window.localStorage) {
      localStorage.setItem("settingTimeHour", "12h")
    }
  })
  if (window.localStorage && (localStorage.getItem("settingTimeHour") == "24h")) {
    document.getElementById("time-24h").classList.add("selected")
    document.getElementById("time-12h").classList.remove("selected")
  } else if (window.localStorage && (localStorage.getItem("settingTimeHour") == "12h")) {
    document.getElementById("time-24h").classList.remove("selected")
    document.getElementById("time-12h").classList.add("selected")
  }
</script>
{#if data.authed}
<script>
  document.getElementById("display-name-edit-button").addEventListener("click", function () {
    document.getElementById("display-name-edit").value = document.getElementById("account-display-name").innerText;
    document.getElementById("display-name-edit-div").classList.remove("hide");
    document.getElementById("display-name-view-div").classList.add("hide");
  })
  document.getElementById("display-name-edit-save-button").addEventListener("click", function () {
    fetch("/api/v0/auth/user", {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        display_name: document.getElementById("display-name-edit").value
      })
    }).then(function (rawResponse) {
      rawResponse.json().then(function (response) {
        if (response.data && response.data.user) {
          document.getElementById("account-display-name").innerText = response.data.user.display_name;
        }
        document.getElementById("display-name-view-div").classList.remove("hide");
        document.getElementById("display-name-edit-div").classList.add("hide");
      })
    })
  })
  document.getElementById("display-name-edit-cancel-button").addEventListener("click", function () {
    document.getElementById("display-name-view-div").classList.remove("hide");
    document.getElementById("display-name-edit-div").classList.add("hide");
  })
  document.getElementById("account-sign-out-button").addEventListener("click", function () {
    fetch("/api/v0/auth/sign-out", {
      method: "POST",
      credentials: "same-origin",
    }).then(function (rawResponse) {
      window.location.reload();
    })
  })
</script>
{/if}
