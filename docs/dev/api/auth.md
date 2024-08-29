# How Authentication & OAuth works in Quizfreely's API

## Auth with a Username and Password

When a user signs up with a username & password, Quizfreely's website makes a http request to Quizfreely's API. The API stores the username & hashed/encrypted password in Quizfreely's PostgreSQL database. Then it creates a session id and token in the database, and sends it to Quizfreely's website in the http response json.

Quizfreely's website's client javascript code stores the user's session id & token on the user's device (with localStorage). Then, when the user does some action, like creating a studyset, the client javascript sends the stored session id and token with the http request to Quizfreely's API. Quizfreely's API checks the Postgres database to make sure the session is valid. If the session is valid, the api will do whatever action the user requested, and then will return a new session token in the reponse. The client js will save the new token from the api response, and will use it in the next request.

These sessions expire after 5 days. Any action the user does generates a new token and extends the expire time. If a user's session is expired, they just log in again to get a new session. When they log in with a username and password, the api checks if the password is correct by comparing the inputted password's hash with the hashed/encrypted password stored in the database. If they match, the user is given a new session.

Hasing/encryption uses postgres' cryptographic functions (`pgcrypto`), so it's reliable & secure :3

## OAuth (Google, etc)

Quizfreely Web (SSR and client js and website) (source code in `web/`) links to `https://api.quizfreely.com/oauth/google` in the little "sign in with google" button on the sign in and sign up pages. That `/oauth/google` is where `@fastify/oauth2` generates a redirect url to google's "sign in with google" page. After a user chooses their google account, google redirects them to `https://api.quizfreely.com/oauth/google/callback`. Our api's js code for `/oauth/google/callback` sends a request to google's api to get the user's google account id, google display name, and email using the token we got from the redirect. Then our js upserts (inserts or updates if that user already exists) the user's google account id, display name, and email into our postgres database. Then, our api js creates a new temporary session, and redirects the user back to our website with the temporary session id and token in the url, like this: `https://quizfreely.com/sign-up?id=SESSIONID&token=SESSIONTOKEN`. This temporary session expires after 10 seconds, but it usually becomes invalid after a few milliseconds because the client js in the redirect url with the token requests the api for a new, not temporary, token that the client js stores on the users device to keep them logged in securely.

Users' session id and token are stored in localstorage, just like username and password auth, and are sent whenever a user tries to do an action. These sessions expire after 5 days, and the user will have to sign in again (using the same process).

Session expiry is "controlled by" postgres; when the api tries to validate a session it check's the expire_at time stored in postgres with postgres' current time. Expired sessions are also deleted for storage space, but they still expire even if they don't get deleted. (maximum secuirity fr)
