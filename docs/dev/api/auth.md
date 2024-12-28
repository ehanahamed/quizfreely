# How Authentication & OAuth works in Quizfreely's API

## Auth with a Username and Password

When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session token in the database, and sends it to the user in a cookie.

Then, when the user does some action, like creating a studyset, the cookie with the session token is in that http request. Quizfreely's API checks our Postgres database to make sure the session is valid.

These sessions expire after 10 days. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session. There is no "refresh token", users just sign in again to get a new session.

Hashing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

## OAuth (Google, etc)

Quizfreely Web (SSR and client js and website) (source code in `web/`) links to `https://quizfreely.com/api/oauth/google` in the little "sign in with google" button on the sign in and sign up pages. That `/oauth/google` is where `@fastify/oauth2` generates a redirect url to google's "sign in with google" page. After a user chooses their google account, google redirects them to `https://quizfreely.com/api/oauth/google/callback`. Our api's js code for `/oauth/google/callback` sends a request to google's api to get the user's google account id, google display name, and email using the token we got from the redirect. Then our js upserts (inserts or updates if that user already exists) the user's google account id, display name, and email into our postgres database. Then, quizfreely-api creates a session token, and sends it as a cookie (just like username+password auth).

These sessions also expire after 10 days. When they expire, users will have to sign in again using the same "sign in with google" button (which uses that same process explained above).

## Technical Info

### Auth Cookie and Authorization Header

When a user signs in (or signs up, or signs in with oauth) quizfreely-api gives the user a cookie named `auth` that has the user's session token. It's a `Secure`, `HttpOnly`, `SameSite` cookie that will only be sent using `https` and can't be accessed by client (and can not be stolen by XSS attacks).

When client js code in quizfreely-web makes requests to quizfreely-api, the browser sends that `auth` cookie, and the API uses that to authenticate the user.

When SSR/server-side js code in quizfreely-web makes requests to quizfreely-api, the server processs sends the user's token in an `Authorization` header as a bearer token. (Like this: `Authorization: Bearer tokengoeshere`). Since quizfreely-web is at the root/base of a domain (like `https://quizfreely.com` or `http://localhost:8080`) and quizfreely-api is at `/api` on the same domain, (like `https://quizfreely.com/api/` or `http://localhost:8080/api/`), the `auth` cookie can be used by quizfreely-web (because the cookie has SameSite for `quizfreely.com` (or `localhost` for development)). So when quizfreely-web's server side js code needs to make a request to quizfreely-api for server-side rendering (SSR) or something, quizfreely-web gets the user's `auth` cookie, but it needs to "forward"/send the session token to quizfreely-api too, so it takes the token from the `auth` cookie and puts it into an `Authorization` http header in the server-side request to quizfreely-api.

### PostgreSQL Roles

When we setup our PostgreSQL database, we create a role named `quizfreely_api`. The server process/js code connects to the database as the `quizfreely_api` role, with the login info from qzfr-api's dotenv file.

Quizfreely-API uses two postgres session settings, `qzfr_api.scope` and `qzfr_api.user_id`, in it's database's RLS (row-level-security) policies, with `set_config()` and `current_setting()`.

`qzfr_api.scope` can be `'auth'`, `'user'`, or unset. When the API is checking a user's session token or password, it should be `'auth'` to give it permission for `auth.sessions` and `auth.users`. When the API has logged in a user, it should be `user` to give it permission to for that specific user's stuff. When the API is making unauthenticated requests for public data and stuff, then it should be unset.

`qzfr_api.user_id` is the id of the currently logged in user when `current_setting('qzfr_api.scope') = 'user'`. We have to set it to the current user's id whenever `qzfr_api.scope` is `'user'`, because our RLS policies use that id to allow our postgres role, `quizfreely_api`, permissions for that user's info.

### Session Expiry & Cron Deletion

Sessions expire after 10 days. Users need to log in again to get a new session. When the API tries to validate a session, it checks the expire_at time. Expired sessions are deleted for storage space & performance, but they still expire/become-invalid even if they haven't been deleted yet. (maximum secuirity for real)

Expired sessions are deleted every day. Our API's nodejs process (`api/index.js`) has the cron job/function which runs `auth.delete_expired_sessions()` on our postgres db (see `quizfreely-db-setup.sql`).
