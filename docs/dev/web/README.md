# Quizfreely Web

Quizfreely's website is written in JavaScript with NodeJS. It gets data from (and saves data with) Quizfreely's API.

To setup quizfreely-web for production see [developer docs > production > web-setup.md](../production/web-setup.md)

## Local Quizfreely Web setup

Clone Quizfreely's source code repo (if you didn't already)
```sh
git clone https://github.com/ehanahamed/quizfreely
# or, from codeberg:
# git clone https://codeberg.org/ehanahamed/quizfreely
```

Copy the .env.example file:
```sh
cd quizfreely/web/
cp .env.example .env
```

The .env file already has reasonable defaults for local devleopment. See [web-dotenv.md](./web-dotenv.md) for all .env options & more info

You need NodeJS (v20 or higher) installed

Install NodeJS dependencies
```sh
npm install
```

Now, start quizfreely-web:
```sh
npm run start
```

quizfreely-web runs on http://localhost:8080 by default. You can change this in `.env`

See [developer docs > api](../api/README.md) to set up quizfreely-api.

## Domains and Forwarded Addresses

In qzfr-web's dotenv file, we need to set COOKIES_DOMAIN to the url users/developers access from their browser. By default, this is `COOKIES_DOMAIN=localhost`, but if we're accessing it from something other than localhost, we need to change COOKIES_DOMAIN (for example, we have `COOKIES_DOMAIN=quizfreely.com` for production). See [developer docs > web > web-dotenv.md](./web-dotenv.md) for all dotenv configuration details.

HOST is always an internal or localhost address.

COOKIES_DOMAIN is the forwarded address or user-facing/devleoper-facing domain.

## Info for GitHub Codespaces

When `PRETTY_PRINT` is `PRETTY_PRINT=true` (see [developer docs > web > web-dotenv.md](./web-dotenv.md)), Quizfreely-web will print our internal/localhost url.

Codespaces should automatically send you to the correct forwarded address when you click a localhost link in our terminal. Codespaces also has a forwarded ports menu with the forwarded address and stuff.

In qzfr-web's dotenv file, we need to set COOKIES_DOMAIN to the forwarded address. Edit quizfreely-web's dotenv file (`.env`) to have `COOKIES_DOMAIN=` set to our `...app.github.dev` url or other forwarded url:
```sh
PORT=8080
HOST=0.0.0.0
# ...
# no protocol (`example.com`, NOT `https://example.com`)
# and no trailing slash (`example.com` NOT `example.com/`)
COOKIES_DOMAIN=abc-example-123456-8080.app.github.dev
# ...
```

Most of the other dotenv default values for local development already work perfectly in codespaces. See [developer docs > web > web-dotenv.md](./web-dotenv.md) for all dotenv options and more details.
