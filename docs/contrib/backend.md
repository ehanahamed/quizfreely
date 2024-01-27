# Backend

Explaining important details about how Quizfreely's backend works.

This does not explain how to set up a local backend for testing or how to setup our real "production" backend, those are explained in other places.

- See `backend/README.md` to setup our production backend
- See `docs/contrib/localdev.md` to setup a local testing backend

## Relations and cascade delete

Study sets have a relation to its author, `user`. That relation has "cascade delete" on, which means when that user gets deleted, their studysets also get deleted.

However, that does NOT work the other way around, when a study set gets deleted, the user's record is uneffected.

This works exactly how we want it to (yay)
