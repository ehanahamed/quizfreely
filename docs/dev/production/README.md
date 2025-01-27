# Production Setup - Dev/Contributor Docs

Right now, Quizfreely's website and api run on the same server/droplet.

Important thingies:
- `/root/quizfreely/api/`
    - `.env`
- `/root/quizfreely/web/`
    - `build/`
    - `.env`
- `/etc/caddy/Caddyfile`
- `/etc/systemd/system/`
    - `quizfreely-web.service`
    - `quizfreely-api.service`
    - `caddy.service`
- `/usr/bin/`
    - `caddy`
    - `node`
    - `npm`

Quizfreely's website (`/root/quizfreely/web/`, "quizfreely-web") runs on port `:8080`. See [web-setup.md](./web-setup.md)

Quizfreely's API (`/root/quizfreely/api/`, "quizfreely-api") runs on port `:8008`. See [api-setup.md](./api-setup.md)

Caddy lets quizfreely-web be accessed from https://quizfreely.org with valid https. See [caddy-setup.md](./caddy-setup.md)

Quizfreely Web proxies Quizfreely API's process on port `:8008` so that quizfreely-api can be accessed from `quizfreely.org/api/`

Quizfreely's API connects to Quizfreely's PostgreSQL database to store all our data. See [api-setup.md](./api-setup.md) to setup the database (and api). See [db.md](./db.md) to manage the database.

## Droplet Specs

Right now our digitalocean droplet has:
- Debian 12 x64 (Linux)
- 1GB memory
- 1 AMD vCPU
- 25GB NVMe SSD storage
