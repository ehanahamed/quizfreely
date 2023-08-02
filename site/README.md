TODO REMOVEREVIEWGAME

- `localStorage.setItem("currentStudyset", ...` might not be needed anymore (is in cloud & local import thing)

TODO JS

- remove button.js stuff for removed elements
- make `sessionData.flashcards.index = 0; flashcards.load(sessionData.flashcards.index);` run after all import/open (importLocal AND cloud import thing)
- make `studySet.load(...` run ONLY on importLocal
  - if it runs on cloud import or inside of open (open includes cloud & local) then it breaks cloud import
    - wait what, why would that happen, studySet.load is supposed to be universal???
- make sure all edit-related stuff is ONLY in editjs
- make sure all importLocal-related stuff is ONLY in importlocaljs, some of it (like JSON.parse) was in open and in studySetjs
- find JSON.parse-s and make sure they dont break already-parsed JSON from cloud imports/loads
- make the cloud load and local load organized
  - they both use `sessionData.studySetData = ...`, `localStorage.set("currentStudyset", sessionData.studySetData);`, and `sections.changeTo("open");`

## Findings

```javascript
// re-logs-in the user
supabaseClient.auth.getSession();
// returns user data with username and metadata,
// only after logging in or re-logging in
supabaseClient.auth.getUser();

// returns "result.data.session" as equal to "null" when NOT logged in
supabaseClient.auth.getSession().then(function (result) {
  console.log(result);
});
```

```javascript
// multiple child functions apperently work just fine?
supabaseClient
  .from("table")
  .select()
  .then(function (result) {
    console.log(result);
  });
```

NOTETOSELF: I have confirmed that using `.select()` will only show data with the users id. (what i made my RLS policy do)
