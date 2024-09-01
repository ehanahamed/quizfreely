# Production Setup - Dev/Contributor Docs

Right now, Quizfreely's website, https://quizfreely.com and api, https://api.quizfreely.com, run on the same server/droplet.

Important thingies:
- `/root/quizfreely/api/`
  - `.env`
  - `quizfreely-api.service`
- `/root/quizfreely/web/`
  - `.env`
  - `quizfreely-web.service`
- `/etc/caddy/Caddyfile`
- `/etc/systemd/system/`
  - `quizfreely-web.service`
  - `quizfreely-api.service`
  - `caddy.service`
- `/usr/bin/`
  - `caddy`
  - `node`
  - `npm`

Quizfreely's API (`/root/quizfreely/api/`, "quizfreely-api") runs on port `:8008`. See [web-setup.md](./web-setup.md)

Quizfreely's website (`/root/quizfreely/web/`, "quizfreely-web") runs on port `:8080`. See [api-setup.md](./api-setup.md)

Caddy lets quizfreely-web and quizfreely-api be accessed from https://quizfreely.com and https://api.quizfreely.com with valid https. See [caddy-setup.md](./caddy-setup.md)

## Droplet Specs

Right now our digitalocean droplet has:
- Debian 12 x64
- 1GB memory
- 1 vCPU
- 25GB storage SSD

With those specs, we usually have:
- 30% cpu usage
- 85% memory usage
- 15% disk usage
