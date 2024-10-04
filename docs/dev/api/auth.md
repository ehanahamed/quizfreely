# How Authentication & OAuth works in Quizfreely's API

## Auth with a Username and Password

When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session token in the database, and sends it to Quizfreely's website in the http response json.

Quizfreely's website's client javascript code stores the user's session token on the user's device (with localStorage). Then, when the user does some action, like creating a studyset, the client javascript sends the stored session token in that http request's Authorization header. Quizfreely's API checks our Postgres database to make sure the session is valid. If the session is valid, the api will do whatever action the user requested, and then will return a new session token in the reponse. The client js will save the new token from the api response, and will use it in the next request.

These sessions expire after 5 days. Any action the user does generates a new token and extends the expire time. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session.

Hashing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

## OAuth (Google, etc)

Quizfreely Web (SSR and client js and website) (source code in `web/`) links to `https://api.quizfreely.com/oauth/google` in the little "sign in with google" button on the sign in and sign up pages. That `/oauth/google` is where `@fastify/oauth2` generates a redirect url to google's "sign in with google" page. After a user chooses their google account, google redirects them to `https://api.quizfreely.com/oauth/google/callback`. Our api's js code for `/oauth/google/callback` sends a request to google's api to get the user's google account id, google display name, and email using the token we got from the redirect. Then our js upserts (inserts or updates if that user already exists) the user's google account id, display name, and email into our postgres database. Then, our api js creates a new temporary session, and redirects the user back to our website with the temporary session id and token in the url, like this: `https://quizfreely.com/sign-up?token=SESSIONTOKEN`. This temporary session expires after 5 seconds, but it usually becomes invalid after a few milliseconds because the client js in the redirect url with the token requests the api for a new, not temporary, token that the client js stores on the users device to keep them logged in securely.

Users' session id and token are stored in localstorage, just like username and password auth, and are sent whenever a user tries to do an action. These sessions expire after 5 days, and the user will have to sign in again (using the same process).

## Technical Info

### Postgres roles

When we setup our PostgreSQL database we create three roles: `quizfreely_api`, `quizfreely_auth`, and `quizfreely_auth_user`. (The commands to setup the database are in [`api/quizfreely-db-setup.sql`](../../../api/quizfreely-db-setup.sql) and the process is explained in [developer docs > production > api-setup.md > Postgres setup](../production/api-setup.md#postgres-setup))

- `quizfreely_api` role
  - can be logged in/connected as
  - has a password (set it using `\password quizfreely_api` in the database shell (`psql -d quizfreely-db`))
  - can view public information
    - can view `public.studysets` rows where `private = false`
    - can view `public.profiles`
- `quizfreely_auth` role
  - can NOT be logged in/connected as
    - the server process/js code connects as `quizfreely_api` and then switches to this role
  - can view and edit sensitive information
    - can view and edit `auth.users`
    - can view and edit `auth.sessions`
    - we use this role to manage users' accounts, so this role needs permissions for account data and encrypted/hashed passwords to let users log in or sign up
- `quizfreely_auth_user` role
  - can NOT be logged in/connected as
    - the server process/js code connects as `quizfreely_api` and then switches to `quizfreely_auth` and then after logging in/verifying a user's session, it switches to `quizfreely_auth_user`
  - can view public information
    - can view `public.studysets` rows where `private = false`
  - sets `quizfreely_auth.user_id` to the specific quizfreely user's id, so they can only get permission to access their own data
  - can view & edit their own account data, sessions, and studysetes
    - can view and edit their own user data in `auth.users`
    - can view and edit their own sessions in `auth.sessions`
    - can view and edit their own studysets in `public.studysets`

The server process/js code connects to the database as the `quizfreely_api` role.

`quizfreely_api` can switch to other roles (`quizfreely_auth` or `quizfreely_auth_user`) after it connects, so that it only has permissions when we decide/the server js code decides it needs those permissions. It uses `set role role_goes_here;`, it can only become roles we allow it to become. When we setup the database with [`api/quizfreely-db-setup.sql`](../../../api/quizfreely-db-setup.sql) (explained in [developer docs > production > api-setup.md > Postgres setup](../production/api-setup.md#postgres-setup)) we grant `quizfreely_api` permission to become `quizfreely_auth`, and grant `quizfreely_auth` permission to become `quizfreely_auth_user`.

The api's paths that return public information (like `https://api.quizfreely.com/studysets/public/studyset-id-goes-here`) do a simple postgres query and return the requested data. `quizfreely_api` has permission to view public stuff.

The api's paths that verify or modify auth/account information (like `https://api.quizfrely.com/sign-up`) start a postgres transaction and do queries after switching to the `quizfreely_auth` role, because `quizfreely_api` can NOT view or edit auth/account info (`auth.users` or `auth.sessions`). `quizfreely_auth` can manage auth/account info, so the api switches to it before doing postgres queries that need those permissions.

The api's paths that manage user's stuff like studysets (like `https://api.quizfreely.com/studysets/create`) start a postgres transaction. Then it switches to the `quizfreely_auth` user to make queries that verifiy the user's session/check if they should actually be logged in, then it switches to the `quizfreely_auth_user` role to make queries that edit the user's studyset(s), because `quizfreely_auth_user` has permission to view and edit their own studysets, while `quizfreely_api` only has permission to view public studysets.

(We use postgres transactions when we need to do multiple "related" queries so that if one of them has an error, none of the other changes apply. This makes sure there is no "mismatching data" where one thing was updated but another related thing was not.)

### Session Expiry & Cron Deletion

Sessions expire after 5 days. Users need to log in again to get a new session. Every action a user does will refresh their session with a new token and recalculated/reset expiry.

When the API tries to validate a session, it checks the expire_at time. Expired sessions are deleted for storage space & performance, but they still expire/become-invalid even if they haven't been deleted yet. (maximum secuirity for real)

Expired sessions are deleted every day. Our API's nodejs process (`api/index.js`) has the cron job/function which runs `auth.delete_expired_sessions()` on our postgres db (see `quizfreely-db-setup.sql`).
