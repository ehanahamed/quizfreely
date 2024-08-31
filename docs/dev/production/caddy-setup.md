# Caddy setup

First, we need to download Caddy with [Caddy's DigitalOcean module](https://github.com/caddy-dns/digitalocean) from https://caddyserver.com/download

We can right click the download link/button and copy the download url to paste it into the droplet's console in a curl command.
```sh
curl -O "https://caddyserver.com/api/download?os=linux&arch=amd64&p=github.com%2Fcaddy-dns%2Fdigitalocean"
```

This will download 
