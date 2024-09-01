# API Dotenv File

To setup quizfreely-api & it's .env file for **production** see [production > api-setup.md](../production/api-setup.md)

- `PORT=`
  - port number to use
  - should be `PORT=8008` for production and development
- `HOST=`
  - `localhost` to listen on localhost, `0.0.0.0` to listen on all all IPv4 addresses, see https://fastify.dev/docs/latest/Reference/Server/#listen
  - should be `HOST=localhost` for production
  - should be `HOST=0.0.0.0` for development
- `API_URL=`
  - url of the api, with **NO trailing slash**
  - should be `API_URL=https://api.quizfreely.com` for production
  - should be `API_URL=http://localhost:8008` for development
- `POSTGRES_URI=`
  - PostgreSQL connection URI
  - should be `POSTGRES_URI=postgres://quizfreely_auth:PASSWORD@localhost/quizfreely-db`
  - replace `PASSWORD` with your/our passowrd
- `CORS_ORIGIN=`
  - allowed CORS origin, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  - should be `CORS_ORIGIN=https://quizfreely.com` for production
  - should be `CORS_ORIGIN=http://localhost:8080` for development
- `LOG_LEVEL=`
  - log level for fastify using pino
  - can be `trace`, `debug`, `info`, `warn`, `error`, `fatal`
  - should be `LOG_LEVEL=warn` or `LOG_LEVEL=error` for production
  - we switch between them for development
- `OAUTH_GOOGLE_CLIENT_ID=`
  - google oauth client id
  - get it from google cloud something: https://console.cloud.google.com/apis/credentials
- `OAUTH_GOOGLE_CLIENT_SECRET=`
  - google oauth client secret
  - get it from google cloud something: https://console.cloud.google.com/apis/credentials
- `WEB_OAUTH_CALLBACK_URL=`
  - url to redirect/callback to after oauth signin/signup
  - should be `WEB_OAUTH_CALLBACK_URL=https://quizfreely.com/sign-up`
  - should be `WEB_OAUTH_CALLBACK_URL=http://localhost:8080/sign-up` for development
