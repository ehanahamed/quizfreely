<script>
    import Noscript from "$lib/components/Noscript.svelte";
    import { onMount, mount } from "svelte";
    import { openIndexedDB } from "$lib/indexedDB";
    import { goto } from "$app/navigation";
    let { data } = $props();

    import IconLocal from "$lib/icons/Local.svelte";
    import IconCheckmark from "$lib/icons/Checkmark.svelte";
    import IconTrash from "$lib/icons/Trash.svelte";
    import IconMoreDotsHorizontal from "$lib/icons/MoreDotsHorizontal.svelte";
    import IconArrowUp from "$lib/icons/ArrowUp.svelte";
    import IconArrowDown from "$lib/icons/ArrowDown.svelte";
    import IconPlus from "$lib/icons/Plus.svelte";

    onMount(function () {
      var editTermsTable = {
      insert: function (index) {
        var newRow = document
          .getElementById("edit-terms-table")
          .insertRow(index);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term' />";
        var col1 = newRow.insertCell(1);
        col1.innerHTML =
          "<textarea class='vertical' rows='2' placeholder='Definition'></textarea>";
        col1.addEventListener("input", function(event) {
          event.target.style.height = "auto";
          event.target.style.height = (event.target.scrollHeight + 10) + "px";
        });
        var actions = newRow.insertCell(2);
        actions.innerHTML =
          "<div class='flex center'><div class='dropdown'>" +
          "  <button class='dropdown-toggle'></button>" +
          "  <div class='content'>" +
          "    <button></button>" +
          "    <button></button>" +
          "    <button class='ohno'></button>" +
          "  </div>" +
          "</div></div>";
        mount(IconMoreDotsHorizontal, {
          target: actions.children[0].children[0].children[0]
        })
        mount(IconArrowUp, {
          target: actions.children[0].children[0].children[1].children[0]
        })
        actions.children[0].children[0].children[1].children[0].innerHTML += " Move Up"
        mount(IconArrowDown, {
          target: actions.children[0].children[0].children[1].children[1]
        })
        actions.children[0].children[0].children[1].children[1].innerHTML += " Move Down"
        mount(IconTrash, {
          target: actions.children[0].children[0].children[1].children[2]
        })
        actions.children[0].children[0].children[1].children[2].innerHTML += " Delete"
        actions.children[0].children[0].children[1].children[0].addEventListener("click", function (event) {
          editTermsTable.move(
            event.target.parentElement.parentElement
              .parentElement.parentElement
              .parentElement.rowIndex,
            event.target.parentElement.parentElement
              .parentElement.parentElement
              .parentElement.rowIndex - 1,
          );
        });
        actions.children[0].children[0].children[1].children[1].addEventListener("click", function (event) {
          editTermsTable.move(
            event.target.parentElement.parentElement
              .parentElement.parentElement
              .parentElement.rowIndex,
            event.target.parentElement.parentElement
              .parentElement.parentElement
              .parentElement.rowIndex + 2,
          );
        });
        actions.children[0].children[0].children[1].children[2].addEventListener("click", function (event) {
          editTermsTable.delete(
            event.target.parentElement.parentElement
              .parentElement.parentElement
              .parentElement.rowIndex,
          );
        });
      },
      add: function () {
        editTermsTable.insert(
          document.getElementById("edit-terms-table").rows.length - 1,
        );
      },
      delete: function (index) {
        document.getElementById("edit-terms-table").deleteRow(index);
      },
      move: function (index, newIndex) {
        /*
            Note to self: make this readable later
            */
        if (
          index !== newIndex &&
          ((index > newIndex && index !== 1) || index < newIndex) &&
          ((index < newIndex &&
            index <
              document.getElementById("edit-terms-table").rows.length -
                2) ||
            index > newIndex)
        ) {
          editTermsTable.insert(newIndex);
          var newOldIndex;
          if (index > newIndex) {
            newOldIndex = index + 1;
          } else if (index < newIndex) {
            newOldIndex = index;
          }
          document.getElementById("edit-terms-table").rows[
            newIndex
          ].children[0].children[0].value = document.getElementById(
            "edit-terms-table"
          ).rows[newOldIndex].children[0].children[0].value;
          document.getElementById("edit-terms-table").rows[
            newIndex
          ].children[1].children[0].value = document.getElementById(
            "edit-terms-table"
          ).rows[newOldIndex].children[1].children[0].value;
          editTermsTable.delete(newOldIndex);
        }
      },
      arrayFromTable: function () {
        var element = document.getElementById("edit-terms-table")
        var tableArray = [];
        for (var i = 1; i < element.rows.length - 1; i++) {
          var row = [];
          var tableCells = element.rows[i].children;
        
          row.push(tableCells[0].children[0].value);
          row.push(tableCells[1].children[0].value);
        
          tableArray.push(row);
        }
        return tableArray;
      },
      tableFromArray: function (array) {
        var table = document.getElementById("edit-terms-table");
        for (var i = 0; i < array.length; i++) {
          editTermsTable.insert(i + 1);
          table.rows[i + 1].children[0].children[0].value = array[i][0];
          var col1Textarea = table.rows[i + 1].children[1].children[0];
          col1Textarea.value = array[i][1];
          col1Textarea.style.height = (col1Textarea.scrollHeight + 10) + "px";
        }
      },
    };
    document.getElementById("edit-terms-add-row-button").addEventListener("click", function () {
      editTermsTable.add();
    })
    if (data.authed && !(data.local)) {
      document.getElementById("edit-private-false").addEventListener("click",
        function () {
          document.getElementById("edit-private-false").classList.add("selected");
          document.getElementById("edit-private-true").classList.remove("selected");
        }
      )
      document.getElementById("edit-private-true").addEventListener("click",
        function () {
          document.getElementById("edit-private-false").classList.remove("selected");
          document.getElementById("edit-private-true").classList.add("selected");
        }
      )
    }
    if (data.new) {
      editTermsTable.add();
      document.getElementById("create-button-local").addEventListener("click", function () {
        openIndexedDB(function (db) {
          var studysetsObjectStore = db.transaction("studysets", "readwrite").objectStore("studysets");
          var title = "Untitled Studyset";
          var newTitle = document.getElementById("edit-title").value;
          if (
            newTitle.length > 0 &&
            newTitle.length < 9000 &&
            /*
                use regex to make sure title is not just a bunch of spaces
                (if removing all spaces makes it equal to an empty string, it's all spaces)
                notice the exclamation mark for negation
            */
            !(newTitle.replace(/[\s\p{C}]+/gu, "") == "")
          ) {
              title = newTitle;
          }
          var dbAddReq = studysetsObjectStore.add({
            title: title,
            data: {
              terms: editTermsTable.arrayFromTable()
            },
            updated_at: (new Date()).toISOString()
          });
          dbAddReq.onsuccess = function (event) {
            /*
              "If the operation is successful,
              the value of the request's result property is the key
              for the new record" (https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/add)
            */
            goto("/studyset/local?id=" + dbAddReq.result)
          }
          dbAddReq.onerror = function (error) {
            console.error(error);
            alert("indexeddb error while trying to add studyset")
          }
        })
      })
      if (data.authed) {
      /* and data.new is true (creating a new studyset, not updating one) */
      var doubleReq = false;
      document.getElementById("create-button-authed").addEventListener("click", function () {
        if (doubleReq == false) {
          doubleReq = true;
          fetch("/api/v0/studysets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              studyset: {
                title: document.getElementById("edit-title").value,
                private: document.getElementById("edit-private-true").classList.contains("selected"),
                data: {
                  terms: editTermsTable.arrayFromTable()
                }
              }
            })
          }).then(function (rawRes) {
            rawRes.json().then(function (result) {
              if (result.data && result.data.studyset) {
                goto("/studysets/" + result.data.studyset.id)
              } else if (result.error) {
                var errorModal = document.createElement("div");
                errorModal.classList.add("modal")
                errorModal.id = "create-error-modal"
                var errorModalContent = document.createElement("div");
                errorModalContent.classList.add("content");
              } else {
                alert("big error")
              }
            })
          }).catch(function (error) {
            alert("fetch error?");
            console.error(error);
          })
        }
      })
      }
    } else if (data.studysetId) {
    /* data.new is false (updating an existing studyset, not creating one) */
    if (data.authed) {
        fetch("/api/v0/studysets/" + data.studysetId, {
          method: "GET",
          credentials: "same-origin"
        }).then(function (rawResponse) {
          rawResponse.json().then(function (result) {
              if (result.error) {
              alert("error, could not load studyset while trying to edit")
            } else {
              document.getElementById("edit-title").value = result.data.studyset.title;
              editTermsTable.tableFromArray(result.data.studyset.data.terms);
              if (result.data.studyset.private) {
                document.getElementById("edit-private-false").classList.remove("selected");
                document.getElementById("edit-private-true").classList.add("selected");
              } else {
                document.getElementById("edit-private-false").classList.add("selected");
                document.getElementById("edit-private-true").classList.remove("selected");
              }
            }
          })
        })
        document.getElementById("save-button").addEventListener("click", function () {
          fetch("/api/v0/studysets/" + data.studysetId, {
            method: "PUT",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              studyset: {
                title: document.getElementById("edit-title").value,
                private: document.getElementById("edit-private-true").classList.contains("selected"),
                data: {
                  terms: editTermsTable.arrayFromTable()
                }
              }
            })
          }).then(function (rawResponse) {
            rawResponse.json().then(function (result) {
              if (result.error) {
                alert("error while trying to update studyset")
              } else {
                goto("/studysets/" + result.data.studyset.id)
              }
            })
          })
        })
      }
    }
    if (data.local && !data.new) {
      var studysetIDBRecord;
      openIndexedDB(function (db) {
        var studysetsObjectStore = db.transaction(["studysets"], "readonly").objectStore("studysets");
        var dbGetReq = studysetsObjectStore.get(data.localId);
        dbGetReq.onsuccess = function (event) {
          if (dbGetReq.result) {
            document.getElementById("edit-title").value = dbGetReq.result.title;
            if (dbGetReq.result.data && dbGetReq.result.data.terms) {
              editTermsTable.tableFromArray(dbGetReq.result.data.terms);
            }

            document.getElementById("save-button").addEventListener("click", function (_) {
              var title = "Untitled Studyset";
              var newTitle = document.getElementById("edit-title").value;
              if (
                newTitle.length > 0 &&
                newTitle.length < 9000 &&
                /*
                    use regex to make sure title is not just a bunch of spaces
                    (if removing all spaces makes it equal to an empty string, it's all spaces)
                    notice the exclamation mark for negation
                */
                !(newTitle.replace(/[\s\p{C}]+/gu, "") == "")
              ) {
                  title = newTitle;
              }
              var updatedStudyset = {
                id: data.localId,
                title: title,
                data: {
                  terms: editTermsTable.arrayFromTable()
                },
                updated_at: (new Date()).toISOString()
              }
              openIndexedDB(function (db) {
                var studysetsObjectStore = db.transaction(["studysets"], "readwrite").objectStore("studysets");
                var dbPutReq = studysetsObjectStore.put(updatedStudyset);
                dbPutReq.onsuccess = function (event) {
                  goto("/studyset/local?id=" + data.localId);
                }
                dbPutReq.onerror = function (error) {
                  console.error(error);
                  alert("indexeddb error while trying to update studyset")
                }
              })
            })
          } else {
            alert("couldn't load local studyset, mabye it doesn't exist?")
          }
        }
        dbGetReq.onerror = function (error) {
          console.error(error);
          alert("indexeddb error while trying to load local studyset")
        }
      })
    }
    })
</script>
<svelte:head>
    <title>Quizfreely</title>
</svelte:head>

    <Noscript />
    <main>
      <div class="grid page" style="min-height: 80vh;">
        <div class="content">
            <div id="mainEditStudySetIsCopy" class="modal hide">
              <div class="content">
                <h2>¯\_(ツ)_/¯</h2>
                <p>
                  A study set with this name already exists in your account.
                  <br />
                  You can update/overwrite the existing copy or go back and
                  rename this copy.
                </p>
                <div class="flex">
                  <button id="mainEditStudySetIsCopyUpdate">
                    Update existing
                  </button>
                  <button id="mainEditStudySetIsCopyBack">Go back</button>
                </div>
              </div>
            </div>
            <input id="edit-title" type="text" placeholder="Title" />
            {#if (data.authed && !data.local) }
            <div id="edit-private-div">
              <div class="combo-select">
                <button class="left selected" id="edit-private-false">
                  <IconCheckmark class="combo-selected-icon" />
                  Public
                </button>
                <button class="right" id="edit-private-true">
                  <IconCheckmark class="combo-selected-icon" />
                  Private
                </button>
              </div>
            </div>
            {/if}
            <table class="outer" id="edit-terms-table">
              <thead>
                <tr>
                  <th class="center">Term</th>
                  <th class="center">Definition</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="flex">
                      <button id="edit-terms-add-row-button">
                        <IconPlus />
                        Add row
                      </button>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            {#if (data.new && data.authed) }
            <button id="create-button-authed">
              <IconCheckmark />
              Create
            </button>
            <div class="dropdown">
              <button class="dropdown-toggle" aria-label="saving options dropdown">
                <IconMoreDotsHorizontal />
              </button>
              <div class="content">
                <button id="create-button-local">
                  <IconLocal />
                  Save Locally
                </button>
              </div>
            </div>
            {:else if (data.new) }
            <button id="create-button-local">
              <IconCheckmark />
              Create
            </button>
            {:else}
            <button id="save-button">
              <IconCheckmark />
              Save Changes
            </button>
            {/if}
        </div>
      </div>
    </main>
