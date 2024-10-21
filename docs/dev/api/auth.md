# How Authentication & OAuth works in Quizfreely's API

## Auth with a Username and Password

When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session token in the database, and sends it to the user in a cookie.

Then, when the user does some action, like creating a studyset, the cookie with the session token is in that http request. Quizfreely's API checks our Postgres database to make sure the session is valid.

These sessions expire after 10 days. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session. There is no "refresh token", user's just sign in again to get a new session.

Hashing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

## OAuth (Google, etc)

Quizfreely Web (SSR and client js and website) (source code in `web/`) links to `https://api.quizfreely.com/oauth/google` in the little "sign in with google" button on the sign in and sign up pages. That `/oauth/google` is where `@fastify/oauth2` generates a redirect url to google's "sign in with google" page. After a user chooses their google account, google redirects them to `https://api.quizfreely.com/oauth/google/callback`. Our api's js code for `/oauth/google/callback` sends a request to google's api to get the user's google account id, google display name, and email using the token we got from the redirect. Then our js upserts (inserts or updates if that user already exists) the user's google account id, display name, and email into our postgres database. Then, quizfreely-api creates a session token, and sends it as a cookie (just like username+password auth).

These sessions also expire after 10 days. When they expire, users will have to sign in again using the same "sign in with google" button (which uses that same process explained above).

## Technical Info

### Postgres roles

When we setup our PostgreSQL database we create three roles: `quizfreely_api`, `quizfreely_auth`, and `quizfreely_auth_user`. (The commands to setup the database are in [`config/db/quizfreely-db-setup.sql`](../../../config/db/quizfreely-db-setup.sql) and the process is explained in [developer docs > production > api-setup.md > Postgres setup](../production/api-setup.md#postgres-setup))

- `quizfreely_api` role
  - can be logged in/connected as
  - has a password (set it using `\password quizfreely_api` in the database shell (`psql -d quizfreely-db`))
  - can view public information
    - can view `public.studysets` rows where `private = false`
    - can view `public.profiles`
- `quizfreely_auth` role
  - can NOT be logged in/connected as
    - the server process/js code connects as `quizfreely_api` and then switches to this role when it needs to
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

`quizfreely_api` can switch to other roles (`quizfreely_auth` or `quizfreely_auth_user`) after it connects, so that it only has permissions when we decide/the server js code decides it needs those permissions. It uses `set role role_goes_here;`, it can only become roles we allow it to become. When we setup the database with [`config/db/quizfreely-db-setup.sql`](../../../config/db/quizfreely-db-setup.sql) (explained in [developer docs > production > api-setup.md > Postgres setup](../production/api-setup.md#postgres-setup)) we grant `quizfreely_api` permission to become `quizfreely_auth`, and grant `quizfreely_auth` permission to become `quizfreely_auth_user`.

The api's paths that return public information (like `https://api.quizfreely.com/studysets/public/studyset-id-goes-here`) do a simple postgres query and return the requested data. `quizfreely_api` has permission to view public stuff.

The api's paths that verify or modify auth/account information (like `https://api.quizfrely.com/sign-up`) start a postgres transaction and do queries after switching to the `quizfreely_auth` role, because `quizfreely_api` can NOT view or edit auth/account info (`auth.users` or `auth.sessions`). `quizfreely_auth` can manage auth/account info, so the api switches to it before doing postgres queries that need those permissions.

The api's paths that manage user's stuff like studysets (like `https://api.quizfreely.com/studysets/create`) start a postgres transaction. Then it switches to the `quizfreely_auth` user to make queries that verifiy the user's session/check if they should actually be logged in, then it switches to the `quizfreely_auth_user` role to make queries that edit the user's studyset(s), because `quizfreely_auth_user` has permission to view and edit their own studysets, while `quizfreely_api` only has permission to view public studysets.

(We use postgres transactions when we need to do multiple "related" queries so that if one of them has an error, none of the other changes apply. This makes sure there is no "mismatching data" where one thing was updated but another related thing was not.)

### Session Expiry & Cron Deletion

Sessions expire after 10 days. Users need to log in again to get a new session. When the API tries to validate a session, it checks the expire_at time. Expired sessions are deleted for storage space & performance, but they still expire/become-invalid even if they haven't been deleted yet. (maximum secuirity for real)

Expired sessions are deleted every day. Our API's nodejs process (`api/index.js`) has the cron job/function which runs `auth.delete_expired_sessions()` on our postgres db (see `quizfreely-db-setup.sql`).
