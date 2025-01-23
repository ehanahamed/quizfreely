# Caddy setup

Install caddy using caddy's official packages, binaries, or other stuff idk. (On quizfreely.org's production server, we use their debian package)

After installing caddy, we can copy our caddy configuration: ([config/Caddyfile](../../../config/Caddyfile) in Quizfreely's source code)
```
quizfreely.org {
        reverse_proxy localhost:8080
        handle /api/* {
                reverse_proxy localhost:8008
        }
}
www.quizfreely.org, quizfreely.com, www.quizfreely.com {
        redir https://quizfreely.org{uri} permanent
}
```

Before we start caddy, check our DNS settings to make sure domains and stuff point to the correct droplet(s)/server(s) that you/we are running quizfreely-web and/or quizfreely-api on.

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

Caddy automatically renews certificates for https. We usually don't need any extra caddy plugins/modules (for example, on our production server, we do not need digitalocean-dns for caddy even though we use digitalocean; caddy serves everything and can get our SSL certificate automatically and everything without those dns thingies)
