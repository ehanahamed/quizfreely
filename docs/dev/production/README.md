# Production Setup - Dev/Contributor Docs

Right now, Quizfreely's website, https://quizfreely.com and api, https://api.quizfreely.com, run on the same server/droplet.

- `/root/quizfreely/api/`
  - `.env`
  - `quizfreely-api.service`
  - Quizfreely's API runs on port `:8008`
- `/root/quizfreely/web/`
  - `.env`
  - `quizfreely-web.service`
  - Quizfreely's website runs on port `:8080`
- `/etc/caddy/Caddyfile`
  - Caddy serves Quizfreely's api AND website with a reverse proxy and it also automatically renews SSL certificates for https

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

## Setup/Maintenance Instructions

To setup Quizfreely's website see [web-setup.md](./web-setup.md)

To setup Quizfreely's API see [api-setup.md](./api-setup.md)
