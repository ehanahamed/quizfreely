# Caddy setup

First, we need to download Caddy with [Caddy's DigitalOcean module](https://github.com/caddy-dns/digitalocean) from https://caddyserver.com/download

We can right click the download link/button and copy the download url to paste it into the droplet's console in a curl command.
```sh
curl -o caddy "https://caddyserver.com/api/download?os=linux&arch=amd64&p=github.com%2Fcaddy-dns%2Fdigitalocean"
```

Now, make sure `caddy` can be executed, and then copy it into `/usr/bin/`
```sh
sudo chmod a+x caddy
sudo mv caddy /usr/bin/
```

Create `caddy` group & user
```sh
# this is from Caddy's docs:
# https://caddyserver.com/docs/running#manual-installation
sudo groupadd --system caddy
sudo useradd --system \
    --gid caddy \
    --create-home \
    --home-dir /var/lib/caddy \
    --shell /usr/sbin/nologin \
    --comment "Caddy web server" \
    caddy
```

Download/copy Quizfreely's Caddyfile from [config/Caddyfile](../../../config/Caddyfile) in Quizfreely's source code.

Edit `Caddyfile` and replace `DIGITAL_OCEAN_API_TOKEN_GOES_HERE` with our digitalocean api token. (See https://github.com/caddy-dns/digitalocean for more details)

The api token is supposed to have scopes for "domain"

Now, move `Caddyfile` to `/etc/caddy/Caddyfile`

It **needs** to be under `/etc/caddy/` because of the systemd service we are going to get/setup next.

Download/copy Caddy's `caddy.service` service file [from their GitHub repo](https://github.com/caddyserver/dist/blob/master/init/caddy.service) or copy the exact same version Quizfreely uses from [config/caddy.service](../../../config/caddy.service) in Quizfreely's repo.

Move the file to `/etc/systemd/system/caddy.service`

Reload systemctl thingies:
```sh
sudo systemctl daemon-reload
```

Before you start caddy, check the DNS settings for `quizfreely.com` to make sure subdomains and stuff point to the correct droplet(s)/server(s) that you/we are running quizfreely-web and/or quizfreely-api on.

Also make sure the server processes of quizfreely-web and/or quizfreely-api are running (`systemctl status quizfreely-web`, `systemctl status quizfreely-api`) See [web-setup.md](./web-setup.md) and/or [api-setup.md](./api-setup.md) for details.

Now start caddy:
```sh
sudo systemctl start caddy
# check that it's running:
# systemctl status caddy
# stop caddy:
# sudo systemctl stop caddy

# to reload caddy after changing /etc/caddy/Caddyfile:
# sudo systemctl reload caddy
```
