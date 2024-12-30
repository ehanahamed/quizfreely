# API Dotenv File

This document/page documents quizfreely-api's dotenv file (`api/.env`) with instructions/explanations/stuff **for production and/or development**.

For more details to setup quizfreely-api & it's .env file **for production** see [production > api-setup.md](../production/api-setup.md)

## PORT

`PORT=` is the port number to use.

This is `PORT=8008` for production and development by default.

## HOST

Use `HOST=0.0.0.0` to listen on all all IPv4 addresses (this is the **default for development**)

Use `HOST="::"` to listen on all IPv6 addresses (and all IPv4 addresses "depending on OS"). For more details, see https://fastify.dev/docs/latest/Reference/Server/#listentextresolver and https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback

Use `HOST=localhost` to only listen on the same machine, IPv6 and IPv4 (this is the **default for production**).

Quizfreely-API's server process is proxied by quizfreely-web so that it can be accessed from `/api` on quizfreely-web (like https://quizfreely.com/api). In production, if quizfreely-api and quizfreely-web are running on the same machine, then quizfreely-api should have `HOST=localhost`, because quizfreely-web will proxy quizfreely-api's process from `localhost:8008`. For production if quizfreely-api and quizfreely-web are on different machines, we will still have `HOST=localhost` and we will use a server, like caddy, to reverse-proxy quizfreely-web's process (that listens on localhost) so it can be accessed from a domain with https and stuff (see [developer docs > production > README.md](../production/README.md) and [developer docs > production > caddy-setup.md](../production/caddy-setup.md)) and then quizfreely-web lets that domain be accessed from `/api`. (Requests between quizfreely-api and quizfreely-web on the same machine use localhost with http, but requests between quizfreely-api and quizfreely-web on different machines use https)

We only need caddy and it's reverse-proxy for production when web and api are running on different machines, developers can just access the server process itself (like with `localhost`) for development.

Should be `HOST=localhost` for **production**.

Should be `HOST=0.0.0.0` for **development**.

## LOG_LEVEL
`LOG_LEVEL=` is the log level for fastify using pino. This can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`

We should probably use `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production.

The default for **development and production** is `LOG_LEVEL=warn`

## LOG_PRETTY
`LOG_PRETTY=` is `true` or `false` to enable or disable pretty-printing/formatting logs.

When enabled, logs are pretty-printed to the terminal/console (STDOUT) AND written into the log file (`api/quizfreely-api.log`)

When disabled, logs are only printed into the log file (`api/quizfreely-api.log`) in their default json format (no pretty printing/fancy formatting)

Formatting/pretty-printing makes every request/response slightly slower, which is why we disable it for production

This should be `LOG_PRETTY=false` for **production**.

This should be `LOG_PRETTY=true` for **development**.

## POSTGRES_URI

`POSTGRES_URI=` is our PostgreSQL database connection URI, it should be `POSTGRES_URI=postgres://quizfreely_api:PASSWORD_GOES_HERE@localhost/quizfreely_db`
    - replace `PASSWORD_GOES_HERE` with your/our password
    - Some other dotenv variables replace localhost in production, but we keep "@localhost" in POSTGRES_URI because the server process connects to the database through localhost, because both are on the same machine

## CORS_ORIGIN
`CORS_ORIGIN=` sets the allowed CORS origin.

Quizfreely-API's CORS_ORIGIN should be set to quizfreely-web's address/origin. (so that qzfr-web is allowed to make requests to qzfr-API)

Use `CORS_ORIGIN=https://quizfreely.com` for **production**.

Use `CORS_ORIGIN=http://localhost:8080` for **development**.

## ENABLE_OAUTH_GOOGLE
`ENABLE_OAUTH_GOOGLE=` is true or false to enable or disable Google OAuth.

When it's set to true, we must configure/set values for `OAUTH_GOOGLE_CLIENT_ID=`, `OAUTH_GOOGLE_CLIENT_SECRET=`, and `OAUTH_GOOGLE_CALLBACK_URI=`

## OAUTH_GOOGLE_CLIENT_ID

`OAUTH_GOOGLE_CLIENT_ID=` is your/our google oauth client id.

You can comment it out or leave it empty if `ENABLE_OAUTH_GOOGLE` is false.

You/we get it from "google auth platform" in google cloud something: https://console.cloud.google.com/auth/clients

## OAUTH_GOOGLE_CLIENT_SECRET

`OAUTH_GOOGLE_CLIENT_SECRET=` is your/our google oauth client secret

We can comment it out or leave it empty if `ENABLE_OAUTH_GOOGLE` is false.

You/we get it from "google auth platform" google cloud something: https://console.cloud.google.com/auth/clients

## OAUTH_GOOGLE_CALLBACK_URI

`OAUTH_GOOGLE_CALLBACK_URI=` is the url to handle google oauth signin/signup

We can comment it out or leave it empty if `ENABLE_OAUTH_GOOGLE` is false

Remember to put this url under "Authorized redirect URIs" in google cloud something. See https://console.cloud.google.com/auth/clients
    - find it under: "Google Auth Platform" > "Clients" > "OAuth 2.0 Client IDs" > "Authorized redirect URIs"
    - It used to be named "APIs & Services" > "Credidentials" > "OAuth 2.0 Client IDs" > "Authorized redirect URIs"
    - You have to put the full uri (`http://localhost:1234/abc/def`, NOT `http://localhost:1234`)

This should be `OAUTH_GOOGLE_CALLBACK_URI=https://quizfreely.com/api/oauth/google/callback` for **production**.

This should be `OAUTH_GOOGLE_CALLBACK_URI=http://localhost:8080/api/oauth/google/callback` for **development**.

## OAUTH_REDIRECT

`OAUTH_REDIRECT=` is the url to redirect to after oauth signin/signup is done.

This does NOT need to be added as an authorized redirect thingy under that google cloud thingy.

Should be `OAUTH_REDIRECT=https://quizfreely.com/sign-in` **for production**.

Should be `OAUTH_REDIRECT=http://localhost:8080/sign-in` **for development**.

## CRON_CLEAR_LOGS
`CRON_CLEAR_LOGS=` is `true` or `false` to enable or disable a cron job to clear logs (clears contents of `api/quizfreely-api.log`) every hour, day, week, or month, etc (interval set with `CRON_CLEAR_LOGS_INTERVAL=`)

Should be `CRON_CLEAR_LOGS=true` for production (it's also true default btw).

## CRON_CLEAR_LOGS_INTERVAL

`CRON_CLEAR_LOGS_INTERVAL=` is the croner pattern to schedule when to run cron job to clear logs.

See https://croner.56k.guru/usage/pattern/
        - for example: daily is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * *"`
        - another example, weekly is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * 0"`

`CRON_CLEAR_LOGS_INTERVAL` does not matter if `CRON_CLEAR_LOGS` is `false`. You/we can comment it out or leave it blank if you have `CRON_CLEAR_LOGS=false`, but you must give it a valid value if you have `CRON_CLEAR_LOGS=true`

## CRON_DELETE_EXPIRED_SESSIONS

`CRON_DELETE_EXPIRED_SESSIONS` is `true` or `false` to enable or disable a cron job to delete expired sessions from `auth.sessions` in your/our PostgreSQL database every hour, day, week, or month, etc (interval set with `CRON_DELETE_EXPIRED_SESSIONS_INTERVAL=`)

This is NOT security-related. Session tokens will always stop working immediately after they expire. We only delete them for storage space and performance. (See [developer docs > api > auth.md](./auth.md) for more details)

This should be `CRON_DELETE_EXPIRED_SESSIONS=true` for production.

## CRON_DELETE_EXPIRED_SESSIONS_INTERVAL

`CRON_DELETE_EXPIRED_SESSIONS_INTERVAL` is the croner pattern to schedule when to run cron job to delete expired sessions (https://croner.56k.guru/usage/pattern/)
    - for example: hourly is `CRON_DELETE_EXPIRED_SESSIONS_INTERVAL="0 * * * *"`
    - another example, daily is `CRON_DELETE_EXPIRED_SESSIONS_INTERVAL="0 0 * * *"`
    - another example, weekly is `CRON_DELETE_EXPIRED_SESSIONS_INTERVAL="0 0 * * 0"`

This is NOT security-related. Session tokens will always stop working immediately after they expire. We only delete them for storage space and performance. (See [developer docs > api > auth.md](./auth.md) for more details)

This does not matter if `CRON_DELETE_EXPIRED_SESSIONS` is `false`. You/we can comment it out or leave it blank if you have `CRON_DELETE_EXPIRED_SESSIONS=false`, but you must give it a valid value if you have `CRON_DELETE_EXPIRED_SESSIONS=true`

Daily or weekly should be fine (i think).
