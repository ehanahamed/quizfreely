<script>
    import Noscript from "$lib/components/Noscript.svelte";
    import { onMount } from "svelte";
    import { openIndexedDB } from "$lib/indexedDB";
    let { data } = $props();

    onMount(function () {
        if (data.local) {
        openIndexedDB(function (db) {
        /* load local studyset from indexeddb (this whole script tag is only there if `data.local` is true) */
        var studysetsObjectStore = db.transaction(["studysets"]).objectStore("studysets");
        var dbGetReq = studysetsObjectStore.get(data.localId);
        dbGetReq.onerror = function (event) {
          alert("oopsie woopsie, indexeddb error");
        }
        dbGetReq.onsuccess = function (event) {
          if (dbGetReq.result) {
            if (dbGetReq.result.title) {
              document.getElementById("studyset-title").innerText = dbGetReq.result.title;
            }
            if (dbGetReq.result.data && dbGetReq.result.data.terms) {
              var termsTable = document.getElementById("terms-table");
              for (var i = 0; i < dbGetReq.result.data.terms.length; i++) {
                var newRow = termsTable.insertRow();
                var newCell0 = newRow.insertCell();
                var newCell1 = newRow.insertCell();
                newCell0.innerText = dbGetReq.result.data.terms[i][0];
                newCell0.style.whiteSpace = "pre-wrap";
                newCell1.innerText = dbGetReq.result.data.terms[i][1];
                newCell1.style.whiteSpace = "pre-wrap";
              }
              flashcardsChange();
            }
          } else {
            alert("studyset not found :(")
          }
        }
      })
      document.getElementById("delete-confirm-button").addEventListener("click", function () {
        openIndexedDB(function (db) {
          studysetsObjectStore = db.transaction(["studysets"], "readwrite").objectStore("studysets");
          var dbDeleteReq = studysetsObjectStore.delete(data.localId);
          dbDeleteReq.onsuccess = function (event) {
            window.location.replace("/dashboard");
          }
          dbDeleteReq.onerror = function (error) {
            console.error(error);
            alert("indexeddb error while trying to delete local studyset")
          }
        })
      })
        }

        var flashcardsIndex = 0;
      function flashcardsFlip() {
        document.getElementById("flashcard").classList.toggle("flip");
      }
      document.getElementById("flashcard").addEventListener("click", flashcardsFlip);
      document.getElementById("flashcards-flip-button").addEventListener("click", flashcardsFlip);
      
      function flashcardsChange() {
        var termsList = document.getElementById("terms-table").children[0];
        document.getElementById("flashcard-front").innerHTML = termsList.children[flashcardsIndex + 1].children[0].innerHTML
        document.getElementById("flashcard-back").innerHTML = termsList.children[flashcardsIndex + 1].children[1].innerHTML
        document.getElementById("flashcards-count").innerText = (flashcardsIndex + 1) + "/" + (termsList.children.length - 1);
      }

      function flashcardsNext() {
        if (flashcardsIndex < (document.getElementById("terms-table").children[0].children.length - 2)) {
          flashcardsIndex += 1
          flashcardsChange()
        }
      }
      document.getElementById("flashcards-next-button").addEventListener("click", flashcardsNext);

      function flashcardsPrev() {
        if (flashcardsIndex > 0) {
          flashcardsIndex -= 1
          flashcardsChange()
        }
      }
      document.getElementById("flashcards-prev-button").addEventListener("click", flashcardsPrev);

      /* the modal's html is the same for local and authed */
      if (document.getElementById("delete-button")) {
        document.getElementById("delete-button").addEventListener("click", function () {
          document.getElementById("delete-modal").classList.remove("hide");
        })
        
        document.getElementById("delete-cancel-button").addEventListener("click", function () {
          document.getElementById("delete-modal").classList.add("hide");
        })
      }
      function maximizeFlashcards() {
        document.getElementById("title-and-menu-outer-div").classList.add("hide");
        document.getElementById("terms-and-stuff-outer-div").classList.add("hide");
        document.getElementById("footer-wave").classList.add("hide");
        document.getElementById("footer").classList.add("hide");

        document.getElementById("flashcards-unmaximize").classList.remove("hide");
      }
      function unmaximizeFlashcards() {
        document.getElementById("title-and-menu-outer-div").classList.remove("hide");
        document.getElementById("terms-and-stuff-outer-div").classList.remove("hide");
        document.getElementById("footer-wave").classList.remove("hide");
        document.getElementById("footer").classList.remove("hide");

        document.getElementById("flashcards-unmaximize").classList.add("hide");
      }
      document.getElementById("flashcards-maximize").addEventListener("click", maximizeFlashcards);
      document.getElementById("flashcards-unmaximize").addEventListener("click", unmaximizeFlashcards);
    })

    if (data?.studyset?.id) {
        document.getElementById("delete-confirm-button").addEventListener("click", function () {
        fetch("/api/v0/studysets/<eta>= data.studyset.id </eta>", {
          method: "DELETE",
          credentials: "same-origin"
        }).then(function (rawResponse) {
          rawResponse.json().then(function (response) {
            if (response.error) {
              console.log(response)
              alert(response.error)
            } else {
              window.location.replace("/dashboard");
            }
          }).catch(function (error) {
            console.error(error);
            alert("json parsing fetch error");
            /* work in progress error msgs */
          })
        }).catch(function (error) {
          console.error(error);
          alert("fetch error")
          /* work in progress error messages? */
        })
      })
    }
</script>

<svelte:head>
    {#if data.studyset}
    <title>{ data.studyset.title } - Quizfreely</title>
    {:else}
    <title>Quizfreely</title>
    {/if}
</svelte:head>

{#if data.local}
<Noscript />
{/if}
<main>
  <div class="grid page">
    <div class="content">
      <div id="title-and-menu-outer-div">
        {#if (data?.studyset?.title) }
        <h2 class="caption" style="overflow-wrap:anywhere"><eta>= data.studyset.title </eta></h2>
        {:else}
        <h2 id="studyset-title" class="caption" style="overflow-wrap:anywhere">Title</h2>
        {/if}
        {#if (data.studyset && data.studyset.private == false && data.studyset.user_display_name) }
        <p>
          Created by <a href="/users/<eta>= data.studyset.user_id</eta>"><eta>= data.studyset.user_display_name </eta></a>
        </p>
        {:else if (data.studyset && data.studyset.private) }
        <p class="fg0">
          <i class="nf nf-fa-eye_slash"></i> Private Studyset
        </p>
        {:else if (data.local) }
        <p class="fg0">
          <i class="nf nf-fa-download"></i> Local Studyset
        </p>
        {/if}
        {#if (data.studyset && data.authed && (data.authedUser.id == data.studyset.user_id)) }
        <div id="edit-menu" class="flex">
          <a href="/studyset/edit/<eta>= data.studyset.id </eta>" class="button">
            <i class="nf nf-fa-pencil"></i>
            Edit
          </a>
          <a href="/studyset/edit/<eta>= data.studyset.id </eta>" class="button alt">
            <i class="nf nf-md-cog"></i>
            Settings
          </a>
          <div class="dropdown">
            <button class="dropdown-toggle" aria-label="More Options Dropdown">
              <i class="nf nf-md-dots_horizontal"></i>
            </button>
            <div class="content">
              <button class="ohno" id="delete-button"><i class="nf nf-fa-trash_o"></i> Delete </button>
            </div>
          </div>
        </div>
        {:else if (data.local) }
        <div id="edit-menu" class="flex">
          <a href="/studyset/edit-local?id=<eta>= data.localId </eta>" class="button">
            <i class="nf nf-fa-pencil"></i>
            Edit
          </a>
          <a href="/studyset/edit-local?id=<eta>= data.localId </eta>" class="button alt">
            <i class="nf nf-md-cog"></i>
            Settings
          </a>
          <div class="dropdown">
            <button class="dropdown-toggle" aria-label="More Options Dropdown">
              <i class="nf nf-md-dots_horizontal"></i>
            </button>
            <div class="content">
              <button class="ohno" id="delete-button"><i class="nf nf-fa-trash_o"></i> Delete </button>
            </div>
          </div>
        </div>
        {/if}
      </div>
      <div id="flashcards-outer-div">
        <button id="flashcards-unmaximize" class="faint hide">
          <i class="nf nf-fa-long_arrow_left"></i> Back
        </button>
        <div>
          <div
            class="card double"
            id="flashcard"
          >
            {#if (data.studyset && data.studyset.data && data.studyset.data.terms && data.studyset.data.terms.length >= 1) }
            <div class="content">
              <div class="front" id="flashcard-front" style="white-space:pre-wrap"><eta>= data.studyset.data.terms[0][0] </eta></div>
              <div class="back" id="flashcard-back" style="white-space:pre-wrap"><eta>= data.studyset.data.terms[0][1] </eta></div>
            </div>
            {:else}
            <div class="content">
              <div class="front" id="flashcard-front" style="white-space:pre-wrap">
                ...
              </div>
              <div class="back" id="flashcard-back" style="white-space:pre-wrap">
                ...
              </div>
            </div>
            {/if}
          </div>
          <div class="caption centerThree">
            {#if (data.studyset && data.studyset.data && data.studyset.data.terms) }
            <p id="flashcards-count">
              1/<eta>= data.studyset.data.terms.length </eta>
            </p>
            {:else}
            <p id="flashcards-count">
              ...
            </p>
            {/if}
            <div class="flex justifyselfcenter">
              <button
                id="flashcards-prev-button"
                aria-label="Previous Card"
              >
                <i class="nf nf-cod-arrow_left"></i>
              </button>
              <button id="flashcards-flip-button">Flip</button>
              <button
                id="flashcards-next-button"
                aria-label="Next Card"
              >
                <i class="nf nf-cod-arrow_right"></i>
              </button>
            </div>
            <div class="flex end">
              <!--<button id="flashcards-maximize-button">
                <i class="nf nf-md-fullscreen"></i>
              </button>
              <button id="flashcards-unmaximize-button" class="hide">
                <i class="nf nf-md-fullscreen_exit"></i>
              </button>-->
            </div>
          </div>
        </div>
      </div>
      <div id="terms-and-stuff-outer-div">
        <div class="caption grid list">
          <button id="flashcards-maximize" class="alt">
            <i class="nf nf-md-card_multiple"></i>
            Flashcards
          </button>
          {#if (data.local) }
          <a href="/studyset/local/review-mode?id=<eta>= data.localId </eta>" class="button alt">
            <i class="nf nf-fa-book"></i>
            Review Mode
          </a>
          <!--<a href="/studyset/local/quiz?id=<eta>= data.localId </eta>" class="button alt">
            <i class="nf nf-md-list_status"></i>
            Practice Test
          </a>-->
          {:else if (data.studyset) }
            <a href="/studysets/<eta>= data.studyset.id </eta>/review-mode" class="button alt">
              <i class="nf nf-fa-book"></i>
              Review Mode
            </a>
            <!--<a href="/studysets/<eta>= data.studyset.id </eta>/test" class="button alt">
              <i class="nf nf-md-list_status"></i>
              Practice Test
            </a>-->
          {/if}
          
        </div>
        <!-- Add "this study set is private/public..." thingy here too -->
        <table class="outer caption box" id="terms-table">
          <tbody>
            <tr>
              <th>Term</th>
              <th>Definition</th>
            </tr>
            {#if (data.studyset && data.studyset.data && data.studyset.data.terms) }
                {#each data.studyset.data.terms as term }
                    <tr>
                      <td style="white-space:pre-wrap"><eta>= term[0]</eta></td>
                      <td style="white-space:pre-wrap"><eta>= term[1]</eta></td>
                    </tr>
                {/each}
            {/if}
          </tbody>
        </table>
      </div>
      <div class="modal hide" id="delete-modal">
        <div class="content">
          <p>Are you sure you want to delete this studyset?</p>
          <div class="flex">
            <button id="delete-confirm-button" class="ohno">Delete</button>
            <button id="delete-cancel-button" class="alt">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
