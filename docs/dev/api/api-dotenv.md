# API Dotenv File

To setup quizfreely-api & it's .env file for **production** see [production > api-setup.md](../production/api-setup.md)

- `PORT=`
  - port number to use
  - should be `PORT=8080` for production and development
- `HOST=`
  - `localhost` to listen on localhost, `0.0.0.0` to listen on all all IPv4 addresses, see https://fastify.dev/docs/latest/Reference/Server/#listen
  - should be `HOST=localhost` for production
  - should be `HOST=0.0.0.0` for development
- `API_URL=`
  - url of the api, with **NO trailing slash**
  - should be `API_URL=https://api.quizfreely.com` for production
  - should be `API_URL=http://localhost:8008` for development
- `COOKIES_DOMAIN=`
  - domain attribute to use for cookies
  - should be `COOKIES_DOMAIN=quizfreely.com` for production
  - should be `COOKIES_DOMAIN=localhost` for development
- `LOG_LEVEL=`
  - log level for fastify using pino
  - can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`
  - should be `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production
  - we switch between them for development
