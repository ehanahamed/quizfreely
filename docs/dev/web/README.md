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

## Info for GitHub Codespaces

When `PRETTY_PRINT` is set to `true` (see [developer docs > web > web-dotenv.md](./web-dotenv.md)), Quizfreely-web will print our internal/localhost url.

Codespaces should automatically send you to the correct forwarded address when you click a localhost link in our terminal. Codespaces also has a forwarded ports menu with the forwarded address and stuff (in the same place as the terminal and debug console by default).

See [developer docs > web > web-dotenv.md](./web-dotenv.md) for all dotenv options and more details. The default values copied from `.env.example` should work fine (i think).
