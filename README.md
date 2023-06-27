TODO NOW

- CLEAN UP THE GODDAMN CODE
  - `ui. ...` object/var & `document.getElement ...` function stuff
    - move js stuff to `ui. ...` because then only ui.js needs to be updated when element structure changes, otherwise `document.getElement ...` references will break
- then after that:
  - seperate-from-open-screen/fullscreen flashcards
  - ability to share study sets
  - docs & help menu
  - confirmation for deleting stuff

TODO

- remove "change passwd" button for non-email/googleapi accounts
- **_create VS make in source code_**
- **_studyset title vs studyset name in source code_**
- **camelCase** it
- documentation & help menu
- code quality
  - implement [designsys/docs](https://codeberg.org/ehanahamed/designsys/src/branch/main/docs/)
  - move `<script>...` tags into js files & make js consistent
  - consistent-ify use of `document.getElement...` vs `ui.abc...`
- implement [designsys/docs/styleguide.md#html-ids](https://codeberg.org/ehanahamed/designsys/src/branch/main/docs/styleguide.md#html-ids)
- implement [designsys/docs/wording.md#grammar-and-capitalization](https://codeberg.org/ehanahamed/designsys/src/branch/main/docs/wording.md#grammar-and-capitalization)

TODO EXTRA

- make sure tab works on file inputs (designsys)
- make fancy betterthantab keyboard shortcut system (designsys)
- autofil/autocomplete colors (designsys)
- enter key to focus next form element (designsys)
  - and to submit signin/signup when keyboard focus is on password input
- document when to use `i` vs `b` (designsys/styleguide)
- consistant image alt tag (+ designsys)
  - currently most are `<img ... alt="image" ...`
