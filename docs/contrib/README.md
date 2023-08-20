# Contributor Documentation

## Branches, Deploys, etc

### Branches

The currently published source code that's deployed to [quizfreely.ehan.dev](https://quizfreely.ehan.dev) is from the `dist` branch. This is the "production" branch.

The most recent source code of whatever is currently being developed is in the `main` branch. Once everything in the main branch is finished and ready for production, its merged into the `dist` branch.

If something needs to be developed that will prevent `main` from being merged into `dist` even when all other stuff in `main` are finished and ready for production, then it will be developed on a seperate branch, and once finished that branch will be merged into `main` and then later into `dist`.

### Branch URLs

Quizfreely uses Netlify to host it's website. Netlify deploys the `dist` (production) and `main` (development) branch.

Branch urls look like this: `https://branch--quizfreelyehandev.netlify.app`

so the `main` (development) branch can be viewed at [main--quizfreelyehandev.netlify.app](https://main--quizfreelyehandev.netlify.app), this is useful for debugging and testing the currently-being-developed source code

the `dist` (production) branch is of course deployed to [quizfreely.ehan.dev](https://quizfreely.ehan.dev), but its also deployed to [dist--quizfreelyehandev.netlify.app](https://dist--quizfreelyehandev.netlify.app), the extra url is kinda pointless tho.
