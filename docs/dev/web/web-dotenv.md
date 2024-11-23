# Web dotenv config

This lists all the details about quizfreely-web's .env file.

To setup quizfreely-web & it's .env file for **production** see [production > web-setup.md](../production/web-setup.md)

- `PORT=`
    - port number to use
    - should be `PORT=8080` for production and development
- `HOST=`
    - `::` to listen on all IPv6 and IPv4 addresses, `0.0.0.0` to listen on all all IPv4 addresses, or `localhost` to only listen on the same machine (IPv6 and IPv4)
        - see https://fastify.dev/docs/latest/Reference/Server/#listentextresolver for all details
        - "Using `::` for the address will listen on all IPv6 addresses and, depending on OS, may also listen on all IPv4 addresses" (https://fastify.dev/docs/latest/Reference/Server/#listentextresolver and https://nodejs.org/api/net.html#serverlistenport-host-backlog-callback)
    - we use `HOST=localhost` for production because we use caddy to reverse-proxy quizfreely-web's server process (that listens on localhost) so it can be accessed from the real domain (https://quizfreely.com) with https and stuff (see [developer docs > production > README.md](../production/README.md) and [developer docs > production > caddy-setup.md](../production/caddy-setup.md)). We only need caddy and it's reverse-proxy for production, developers can just access the server process itself for development.
    - if you need IPv4 only, use `HOST=0.0.0.0` for development
    - should be `HOST=localhost` for production
    - should be `HOST=::` for development
- `LOG_LEVEL=`
    - log level for fastify using pino
    - can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`
    - should be `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production
    - we switch between them for development
- `LOG_PRETTY=`
    - `true` or `false` to enable or disable pretty-printing/formatting logs
    - when enabled, logs are pretty-printed to the terminal/console (STDOUT) AND written into the log file (`web/quizfreely-web.log`)
    - when disabled, logs are only printed into the log file (`web/quizfreely-web.log`) in their default json format (no pretty printing/fancy formatting)
    - formatting/pretty-printing makes every request/response slightly slower, which is why we disable it for production
    - should be `LOG_PRETTY=false` for production
    - should be `LOG_PRETTY=true` for development
- `API_URL=`
    - Url where Quizfreely-API is running
    - NO trailing slash (`https://example.com`, NOT `https://example.com/`)
    - When quizfreely-web and quizfreely-api are running on the same machine, API_URL should be an internal/loopback address like `API_URL=http://localhost:8008` (even in production) because API_URL is proxied by quizfreely-web so that we can access API_URL from `/api` on quizfreely-web (with quizfreely-web's https and same-origin policies and stuff)
    - Quizfreely-web's server js code makes requests to API_URL directly. Quizfreely-web's client js on users' browsers makes requests to `/api` on quizfreely-web's domain (like `https://quizfreely.com/api`), NOT directly to API_URL
    - If quizfreely-web and quizfreely-api are running on different machines we/you might have `API_URL=https://123.234.123.234:8008` or `API_URL=https://api.example.com`
    - should be `API_URL=http://localhost:8008` for development AND PRODUCTION
- `COOKIES_DOMAIN=`
    - domain attribute to use for cookies
    - NO protocol (`example.com`, NOT `https://example.com`)
    - NO trailing slash (`example.com`, NOT `example.com/`)
    - should be `COOKIES_DOMAIN=quizfreely.com` for production
    - should be `COOKIES_DOMAIN=localhost` for development
- `CACHE_VIEWS=`
    - Enable or disable caching Eta views/templates & rendering thingies with @fastify/view
    - `CACHE_VIEWS=true` for production
    - `CACHE_VIEWS=false` for development
- `CRON_CLEAR_LOGS=`
    - `true` or `false` to enable or disable cron job to clear logs (clears contents of `quizfreely-web.log`) every hour, day, week, or month, etc (interval set with `CRON_CLEAR_LOGS_INTERVAL=`)
    - should be `CRON_CLEAR_LOGS=true` for production
- `CRON_CLEAR_LOGS_INTERVAL=`
    - croner pattern to schedule when to run cron job to clear logs (https://croner.56k.guru/usage/pattern/)
        - for example: daily is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * *"`
        - another example, weekly is `CRON_CLEAR_LOGS_INTERVAL="0 0 * * 0"`
    - this does not matter if `CRON_CLEAR_LOGS` is `false`. You/we can comment it out or leave it blank if you have `CRON_CLEAR_LOGS=false`, but you must give it a valid value if you have `CRON_CLEAR_LOGS=true`
    - Hourly is probably too frequent for most use cases. Daily or weekly are reccomended
- `ENABLE_OAUTH_GOOGLE=`
    - true or false to show or hide Google OAuth buttons/menus/etc
    - you should also check quizfreely-api's dotenv file for it's oauth configuration stuff
