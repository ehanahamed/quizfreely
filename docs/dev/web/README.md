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

## Extra Info for GitHub Codespaces

If your Codespaces url is `https://abc-example-123456.github.dev/`, its `localhost:8080` is at `https://abc-example-123456-8080.app.github.dev/`.

Codespaces also will show you a little pop-up/button/link thingy when you start a process on any port so you can easily get to that url.

On Codespaces, edit quizfreely-web's dotenv file (`.env`) to have `COOKIES_DOMAIN=` set to our `...app.github.dev` url:
```sh
PORT=8080
HOST=0.0.0.0
# ...
COOKIES_DOMAIN=abc-example-123456-8080.app.github.dev
# ...
```

All the other dotenv default values for local development already work perfectly with Codespaces. See [developer docs > web > web-dotenv.md](./web-dotenv.md) for all dotenv options and more details.
