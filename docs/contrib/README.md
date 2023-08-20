# Contributor Documentation

## Branches, Deploys, etc

The currently published source code that's deployed to [quizfreely.ehan.dev](https://quizfreely.ehan.dev) is from the `dist` branch. This is the "production" branch.

The most recent source code of whatever is currently being developed is in the `main` branch. Once everything in the main branch is finished and ready for production, its merged into the `dist` branch.

If something needs to be developed that will prevent `main` from being merged into `dist` even when all other stuff in `main` are finished and ready for production, then it will be developed on a seperate branch, and once finished that branch will be merged into `main` and then later into `dist`.
