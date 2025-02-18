# Quizfreely Web

Quizfreely's website is written in JavaScript with NodeJS & SvelteKit. It gets data from (and saves data with) Quizfreely's API.

To setup quizfreely-web for production see [developer docs > production > web-setup.md](../production/web-setup.md)

## Local Quizfreely Web setup

Clone Quizfreely's source code repo (if you didn't already)
```sh
git clone https://codeberg.org/quizfreely/quizfreely
# or, from github:
# git clone https://github.com/quizfreely/quizfreely
```

Copy the .env.example file:
```sh
cd quizfreely/web/
cp .env.example .env
```

The .env file already has reasonable defaults for local devleopment. See [web-dotenv.md](./web-dotenv.md) for all .env options & more info

You need NodeJS (v20 or higher) installed

Install dependencies
```sh
npm install
```

Now, start quizfreely-web:
```sh
npm run dev
```

quizfreely-web runs on http://localhost:8080 by default. You can change this in `.env`

See [developer docs > api](../api/README.md) to set up quizfreely-api.

## Build & Preview

To generate/compile a build:
```bash
npm run build
```

You can preview the build with `npm run preview`.

### Production

Edit `.env` (variables like `HOST` need to be updated for production, for production stuff see [developer docs > production > web-setup.md](../production/web-setup.md))

Use `node build` instead of `npm run ...`.
```bash
node build
```

Those `npm run ...` commands use vite, but for production, we just run the compiled sveltekit build with sveltekit's node adapter, using `node`.

For full production documentation stuff see [developer docs > production > web-setup.md](../production/web-setup.md)

## Info for GitHub Codespaces

Quizfreely-web will print our internal/localhost url and Codespaces should automatically send you to the correct forwarded address when you click a localhost link in our terminal. Codespaces also has a forwarded ports menu with the forwarded address and stuff (in the same place as the terminal and debug console by default).

See [developer docs > web > web-dotenv.md](./web-dotenv.md) for all dotenv options and more details. The default values copied from `.env.example` work fine.
