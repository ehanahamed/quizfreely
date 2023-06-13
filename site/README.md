TODO JS
 - make `sessionData.flashcards.index = 0; flashcards.load(sessionData.flashcards.index);` run after all import/open (importLocal AND cloud import thing)
 - make `studySet.load(...` run ONLY on importLocal
    - if it runs on cloud import or inside of actionoptions (actionoptions includes cloud & local) then it breaks cloud import
 - make sure all edit-related stuff is ONLY in editjs
 - make sure all importLocal-related stuff is ONLY in importlocaljs, some of it (like JSON.parse) was in actionoptions and in studySetjs
 - find JSON.parse-s and make sure they dont break already-parsed JSON from cloud imports/loads 
 - make the cloud load and local load organized
    - they both use `sessionData.studySetData = ...`, `localStorage.set("currentStudyset", sessionData.studySetData);`, and `sections.changeTo("actionOptions");`

## Findings

```javascript
// re-logs-in the user
supabaseClient.auth.getSession()
// returns user data with email and metadata,
// only after logging in or re-logging in
supabaseClient.auth.getUser()


// returns "result.data.session" as equal to "null" when NOT logged in
supabaseClient.auth.getSession().then(function (result) { console.log(result) } );
```

```javascript
// multiple child functions apperently work just fine?
supabaseClient.from("table").select().then(function (result) { console.log(result) } )
```

NOTETOSELF: I have confirmed that using `.select()` will only show data with the users id. (what i made my RLS policy do)
