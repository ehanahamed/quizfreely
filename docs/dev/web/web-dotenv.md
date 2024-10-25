# Web dotenv config

This lists all the details about quizfreely-web's .env file.

To setup quizfreely-web & it's .env file for **production** see [production > web-setup.md](../production/web-setup.md)

- `PORT=`
  - port number to use
  - should be `PORT=8080` for production and development
- `HOST=`
  - `localhost` to listen on localhost, `0.0.0.0` to listen on all all IPv4 addresses, see https://fastify.dev/docs/latest/Reference/Server/#listen
  - should be `HOST=localhost` for production
  - should be `HOST=0.0.0.0` for development
- `API_URL=`
  - url of the api, it's localhost even in production because that localhost url is proxied by quizfreely-web so that you can access the api from https://quizfreely.com/api (with https and everything)
  - NO trailing slash (`https://example.com`, NOT `https://example.com/`)
  - should be `API_URL=http://localhost:8008` for development AND PRODUCTION
- `COOKIES_DOMAIN=`
  - domain attribute to use for cookies
  - NO protocol (`example.com`, NOT `https://example.com`)
  - NO trailing slash (`example.com`, NOT `example.com/`)
  - should be `COOKIES_DOMAIN=quizfreely.com` for production
  - should be `COOKIES_DOMAIN=localhost` for development
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
