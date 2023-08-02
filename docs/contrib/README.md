# Contributor Documentation

This folder (`docs/contrib`) contains the current **work in progress** documentation of the source code of Quizfreely.

As of right now, all the contributor documentation is in one file (this one, `README.md`)

## Random notes

~~the reset password page is the same for both un-signed-in users and signed-in users, supabase's API doesn't need to tell the difference, because un-signed-in users get signed-in when they click on the forgot passsword email link.~~ outdated info, Quizfreely no longer uses email-sign-ins

## Basic Concepts

### User expirence & UI "flow"

When users open the website, they're greeted with the main page, index.html (obvously)

From there, they have the option to create a new "study set" or import a "study set" they already created or someone else created and shared with them.

A "study set" is the user-facing "format" or medium they think stores the data of terms and defintions that they input. In reality, this "study set" is just a javascript object variable that is saved as a json file for exporting and later re-importing.

When they choose to create a study set, they're given a table with inputs for them to edit.

All this "editing" functionality is in `site/js/edit.js` (including mapping a study set's json data into a html table)

After editing, they save their study set (as a json file)

Then they import their study set (the json file they saved earlier).

When they import their study set, from the initial main page, they are given the option to either edit to add more to their study set or to review their study set.

## Source code & stuff

All javascript code ~~is~~ (should be\*) in the `site/js` folder, and there should be **no** inline js in the html files.

The html files are in `site/`, so far there are

- `index.html` the main page (obvously)
- `src.html` page with links to source code repo
- `about.html` basically answers "why use Quizfreely" **work in progress**
- `docs.html` user, developer, and contributor documentation **work in progress**
- `404.html` 404 page **work in progress**

The javascript is linked to the html using standard `<script src="..."></script>` tags.

- The src attribute should be a relative path
  - use `js/...`, do **not** use `https://quizfreely.ehan.dev/js/...`
- Do **not** use javascript modules
- **no** `<script ... type="module"></script>`

### Reference

~~the `site/js/ui.elements.js` file has `document.getElementById("...")`s for (almost) every element with specific javascript function using an element selector (section elements, flashcards, etc do this).~~

~~Other elements use a `onclick="function"` in their html, to directly call the required javascript function (most buttons do this). They do **not** have a selector in `ui.elements.js`.~~

outdated info above, will update
