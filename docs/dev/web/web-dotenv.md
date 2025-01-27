# Web dotenv config

This documents everything about quizfreely-web's dotenv file (`web/.env`). There are explanations, defaults, and reccomendations for **development and/or production** here.

To setup quizfreely-web & it's dotenv file **for production** see [production > web-setup.md](../production/web-setup.md)

## PORT

`PORT=` is the port number to use.

This is `PORT=8080` for production and development by default.

## HOST

Should be `HOST=127.0.0.1` for **production**.

Leave it commented out for **development**

## API_URL

`API_URL` is the url where Quizfreely-API is running.
    - NO trailing slash (`https://example.com`, NOT `https://example.com/`)

When quizfreely-web and quizfreely-api are running on the same machine, API_URL should be an internal/loopback address like `API_URL=http://localhost:8008` (even in production) because API_URL is proxied by quizfreely-web so that we can access API_URL from `/api` on quizfreely-web (with quizfreely-web's https and same-origin policies and stuff)
 
Quizfreely-web's server js code makes requests to API_URL directly. Quizfreely-web's client js on users' browsers makes requests to `/api` on quizfreely-web's domain (like `https://quizfreely.org/api`), NOT directly to API_URL.

If quizfreely-web and quizfreely-api are running on different machines we/you might have `API_URL=https://123.234.123.234:8008` or `API_URL=https://api.example.com`

This is `API_URL=http://localhost:8008` by default for **development AND PRODUCTION**

## ENABLE_OAUTH_GOOGLE

`ENABLE_OAUTH_GOOGLE=` is true or false to show or hide Google OAuth buttons/menus/etc

You should also check quizfreely-api's dotenv file for it's related oauth configuration stuff
