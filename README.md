# Quizfreely

Quizfreely is a free and open source studying tool.

## Server setup

To run `quizfreely/web/` server:

Clone without downloading the whole repo:
```sh
git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely
# or, for dist branch:
# git clone --filter=blob:none --no-checkout --depth 1 --sparse https://github.com/ehanahamed/quizfreely --branch dist
```

Then, get just the web folder:
```sh
cd quizfreely
git sparse-checkout add web
git checkout
```

Now you will have `quizfreely/web/`
```sh
cd web
```

Now copy the example .env file:
```sh
cp .env.example .env
```

Now edit the .env file and make sure everything is correct, there are comments inside it for everything.

Now, copy the systemd service file into its correct location (usually `/etc/systemd/system/`)
```sh
cp quizfreely-web.service /etc/systemd/system/
```

The systemd service file assumes you cloned quizfreely/web into `/root/quizfreely/web`. If you cloned it into a different path, change the path in the `ExecStart` line of the systemd file you just copied.

Reload systemd thingies
```sh
systemctl daemon-reload
```

Start the systemd service
```sh
systemctl start quizfreely-web
```

### Checking & managing the service
In case you don't know how to use systemctl, useful commands are listed here:

```sh
# start the service
systemctl start quizfreely-web
# check if it's running or if there's errors
systemctl status quizfreely-web
# stop the service
systemctl stop quizfreely-web
```

We **usually** don't need to enable or disable the service, we just start or stop it.

## Before merging main to dist

- remove temporary, cherry-picked, commits currently in dist
- make sure all `quizfreely.ehan.dev` urls have been updated to `quizfreely.com`
  - check stuff outside the source code like ~~supabase~~, google cloud, social profiles, ehan.dev site, etc
- make sure all `main.quizfreely.com` urls and `abc.supabase.co` urls have been removed
  - check stuff outside the source code like google cloud, social profiles, ehan.dev site, etc

Implement import & export from/to:
- scholarsome
  - https://scholarsome.com/
  - https://github.com/hwgilbert16/scholarsome
  - ❤️ it's free & open source, just like quizfreely

Implement import from...

- Study Stack
  - https://www.studystack.com/
  - Can export with custom term-delimeters and newlines for row-delimeters
- Quizlet
  - https://quizlet.com/
  - Can export with custom term & row delimiters
- Omnisets
  - https://www.omnisets.com/
  - not sure

TODO NOW:

- make dashboard's delete button NOT reload, reset some other way
- clean up code
  - make sure eventListners are not created multiple times
  - decide order of script tags
- homepage/index.html
  - add "its effective" section explaining how quizfreelys thingies are "backed by science"
    - this section would be under "its open source" and before the wave-y section
  - add "the code is public, but your data isn't" section explaining stuff like "ur data isnt used for marketing or sold to ppl" and "the privacy policy is easy to read" and link to the privacy policy
  - add links/buttons to the grid paragraph section thingies
    - like under open source there would be view source code and under its free there would be informatino about why accounts etc
- then after that:
  - seperate-from-open-screen/fullscreen flashcards
  - docs & help menu
  - confirmation for deleting stuff

TODO

- **_create VS make in source code_**
- **_studyset title vs studyset name in source code_**
- **camelCase** it
- documentation & help menu
- code quality
  - implement [designsys/docs](https://codeberg.org/ehanahamed/designsys/src/branch/main/docs/)
  - move `<script>...` tags into js files & make js consistent
  - consistent-ify use of `document.getElement...` vs `ui.elements.abc...`
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
