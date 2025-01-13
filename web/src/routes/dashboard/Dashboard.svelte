<script>
    import Header from "$lib/components/Header.svelte";
    import Noscript from "$lib/components/Noscript.svelte";
    let authed = false;
    let data = {};
</script>

<Noscript />
<main>
  <div class="grid page">
    <div class="content">
      <div id="mainDashboarddiv">
        {#if !authed}
          <p id="dashboard-noaccount-alert" class="fg0">
            You're not signed in, so your sets will be saved locally (on your device)
          </p>
        {/if}
        <div class="flex">
          <a href="/studyset/create" class="button">
            <i class="nf nf-oct-plus"></i>
            Create new
          </a>
        </div>
        {#if authed}
        <div class="grid list" id="studyset-list" style="overflow-wrap:anywhere">
          {#if data.studysetList && data.studysetList.length > 0}
            {#each data.studysetList as studyset}
              <div class="box">
                <a href="/studysets/{ studyset.id }">{ studyset.title }</a>
                <p class="h6" data-timestamp={ studyset.updated_at }>...</p>
              </div>
            {/each}
          {:else}
            <div class="box flex center-h center-v">
              <div>Tap "create new" to create a studyset</div>
            </div>
          {/if}
        </div>
        {/if}
        {#if authed}
        <!-- only show "Local Studysets" title to tell the difference from studysets saved to an account when logged in -->
        <!-- also, the element has class="... hide" cause client/browser js only shows it if there are local studysets and the user is signed in -->
        <p class="h3 hide" id="local-list-title">Local Studysets</p>
        {/if}
        <div class="grid list hide" id="local-list">
          {#if !authed}
          <!-- only show empty message if user is logged out and can therefore only have local studysets -->
          <div class="hide box flex center-h center-v" id="local-list-empty">
            <div>Tap "create new" to create a studyset</div>
          </div>
          {/if}
        </div>
        <div id="mainDashboardImportother" class="modal hide">
          <div class="content">
            <h2>Import from another app</h2>
            <p>Delimiter/Seperator between term and definition</p>
            <input
              type="text"
              placeholder="Term delimiter"
              id="mainDashboardImportotherTermdelimiter"
            />
            <p>
              Delimiter/Seperator between rows, leave blank to use a
              newline/enter
            </p>
            <input
              type="text"
              placeholder="Row delimiter"
              id="mainDashboardImportotherRowdelimiter"
            />
            <textarea
              id="mainDashboardImportotherData"
              class="fullWidth"
              rows="10"
              placeholder="Paste data here"
            ></textarea>
            <div class="flex">
              <button id="mainDashboardImportotherImportbutton">
                Import
              </button>
              <button
                class="red"
                onclick={document.getElementById('mainDashboardImportother').classList.add('hide')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
<!--<eta>~ include("./partials/footer") </eta>
<script src="/assets/js/fancyTimestamp.js"></script>
<script>
  if (window.localStorage && (localStorage.getItem("settingTimeHour") == "24h")) {
    fancyTimestamp.hours = 24;
  } else if (window.localStorage && (localStorage.getItem("settingTimeHour") == "12h")) {
    fancyTimestamp.hours = 12;
  }
</script>
<eta> if (data.authed && data.studysetList && data.studysetList.length > 0) { </eta>
<script>
  for (var i = 0; i < document.getElementById("studyset-list").children.length; i++) {
    var timestampElement = document.getElementById("studyset-list").children[i].children[1]
    timestampElement.innerText = fancyTimestamp.format(timestampElement.dataset.timestamp);
  }
</script>
<eta> } </eta>
<script src="/assets/js/indexedDB.js"></script>
<script>
  openIndexedDB(function (db) {
    var studysetsObjectStore = db.transaction(["studysets"], "readonly").objectStore("studysets");
    var dbStudysetsReq = studysetsObjectStore.getAll();
    dbStudysetsReq.onsuccess = function (event) {
      var studysets = dbStudysetsReq.result;
      if (studysets.length >= 1) {
        var localListTitleElement = document.getElementById("local-list-title");
        if (localListTitleElement) {
          localListTitleElement.classList.remove("hide");
        }
        document.getElementById("local-list").classList.remove("hide");
        for (var i = 0; i < studysets.length; i++) {
          var div = document.createElement("div");
          div.classList.add("box");
          var title = document.createElement("a");
          title.innerText = studysets[i].title;
          title.href = "/studyset/local?id=" + studysets[i].id;
          div.appendChild(title);
          if (studysets[i].updated_at) {
            var timestamp = document.createElement("p");
            timestamp.classList.add("h6");
            timestamp.innerText = fancyTimestamp.format(studysets[i].updated_at);
            div.appendChild(timestamp);
          }
          document.getElementById("local-list").appendChild(div);
        }
      } else {
        var emptyMessageElement = document.getElementById("local-list-empty");
        if (emptyMessageElement) {
          document.getElementById("local-list").classList.remove("hide");
          emptyMessageElement.classList.remove("hide");
        }
      }
    }
    dbStudysetsReq.onerror = function (error) {
      alert("error getting local studysets list from indexeddb");
      console.error(error);
    }
  })
</script>-->
