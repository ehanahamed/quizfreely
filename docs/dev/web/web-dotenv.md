# Web dotenv config

This documents everything about quizfreely-web's dotenv file (`web/.env`). There are explanations, defaults, and reccomendations for **development and/or production** here.

To setup quizfreely-web & it's dotenv file **for production** see [production > web-setup.md](../production/web-setup.md)

## PORT

`PORT=` is the port number to use.

This is `PORT=8080` for production and development by default.

## HOST

Use `HOST=0.0.0.0` to listen on all all IPv4 addresses (this is the **default for development**)

Use `HOST="::"` to listen on all IPv6 addresses (and all IPv4 addresses "depending on OS"). For more details, see https://fastify.dev/docs/latest/Reference/Server/#listentextresolver and https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback

Use `HOST=localhost` to only listen on the same machine, IPv6 and IPv4 (this is the **default for production**).

We use `HOST=localhost` for production because we use caddy to reverse-proxy quizfreely-web's server process (that listens on localhost) so it can be accessed from the real domain (https://quizfreely.com) with https and stuff (see [developer docs > production > README.md](../production/README.md) and [developer docs > production > caddy-setup.md](../production/caddy-setup.md)). We only need caddy and it's reverse-proxy for production when web and api are running on different machines. Developers can just access the server process itself (like with `localhost`) for development.

Should be `HOST=localhost` for **production**.

Should be `HOST=0.0.0.0` for **development**.

## LOG_LEVEL
`LOG_LEVEL=` is the log level for fastify using pino. This can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`

We should probably use `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production.

The default for **development and production** is `LOG_LEVEL=warn`

## LOG_PRETTY
`LOG_PRETTY=` is `true` or `false` to enable or disable pretty-printing/formatting logs.

When enabled, logs are pretty-printed to the terminal/console (STDOUT) AND written into the log file (`web/quizfreely-web.log`)

When disabled, logs are only printed into the log file (`web/quizfreely-web.log`) in their default json format (no pretty printing/fancy formatting)

Formatting/pretty-printing makes every request/response slightly slower, which is why we disable it for production

This should be `LOG_PRETTY=false` for **production**.

This should be `LOG_PRETTY=true` for **development**.

## API_URL

`API_URL` is the url where Quizfreely-API is running.
    - NO trailing slash (`https://example.com`, NOT `https://example.com/`)

When quizfreely-web and quizfreely-api are running on the same machine, API_URL should be an internal/loopback address like `API_URL=http://localhost:8008` (even in production) because API_URL is proxied by quizfreely-web so that we can access API_URL from `/api` on quizfreely-web (with quizfreely-web's https and same-origin policies and stuff)
 
Quizfreely-web's server js code makes requests to API_URL directly. Quizfreely-web's client js on users' browsers makes requests to `/api` on quizfreely-web's domain (like `https://quizfreely.com/api`), NOT directly to API_URL.

If quizfreely-web and quizfreely-api are running on different machines we/you might have `API_URL=https://123.234.123.234:8008` or `API_URL=https://api.example.com`

This is `API_URL=http://localhost:8008` by default for **development AND PRODUCTION**

## CACHE_VIEWS
`CACHE_VIEWS=` is true or false to enable or disable caching Eta views/templates & rendering thingies with @fastify/view

`CACHE_VIEWS=true` for production
`CACHE_VIEWS=false` for development


## CRON_CLEAR_LOGS
`CRON_CLEAR_LOGS=` is `true` or `false` to enable or disable a cron job to clear logs (clears contents of `web/quizfreely-web.log`) every hour, day, week, or month, etc (interval set with `CRON_CLEAR_LOGS_INTERVAL=`)

It's `CRON_CLEAR_LOGS=true` by default and should be true for production.

## CRON_CLEAR_LOGS_INTERVAL

`CRON_CLEAR_LOGS_INTERVAL=` is the croner pattern to schedule when to run cron job to clear logs.

See https://croner.56k.guru/usage/pattern/
        - for example: daily is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * *"`
        - another example, weekly is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * 0"`

`CRON_CLEAR_LOGS_INTERVAL` does not matter if `CRON_CLEAR_LOGS` is `false`. You/we can comment it out or leave it blank if you have `CRON_CLEAR_LOGS=false`, but you must give it a valid value if you have `CRON_CLEAR_LOGS=true`

## ENABLE_OAUTH_GOOGLE

`ENABLE_OAUTH_GOOGLE=` is true or false to show or hide Google OAuth buttons/menus/etc

You should also check quizfreely-api's dotenv file for it's related oauth configuration stuff
