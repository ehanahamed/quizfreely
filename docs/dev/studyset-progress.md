## Studyset Progress

When users use review mode or take a practice test, Quizfreely keeps track of what terms they get correct and what terms the get wrong and how users accuracy changes over time. Quizfreely uses that to calculate what terms users should review more. We call that their "progress", and in our source code the PostgreSQL table is named `studyset_progress`, and the IndexedDB object store is named `studysetprogress`.

Users without an account have their progress stored on their device, using a thingy in their web browser called IndexedDB. Users with an account have their progress stored in our PostgreSQL database which is accessed through Quizfreely's API.

In our PostgreSQL table `studyset_progress`, the primary key of each record is a unique UUID because each user has their own record for each studyset they interact with.

In our IndexedDB object store `studysetprogress`, the primary key of each record is the same as the studyset's id, because there is only one user, so each record is for each studyset.

Account-less users can still use studysets made by users with an account. So our `studysetprogress` object store will have records for both that user's local studysets AND other users' studysets. This doesn't actually make any difference for `studysetprogress` in IndexedDB because local studyset ids are just numbers and other users' studysets (on our PostgreSQL database) have UUIDs as ids.
