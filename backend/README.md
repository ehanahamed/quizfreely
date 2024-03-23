# Local Testing

## Docker & Docker Compose

First, install docker. (on archlinux, just `pacman -S docker`)

Next, add the `docker` group to your linux user.
```
# usermod -a -G docker YOURUSERNAME
```

Next, install docker-compose (on archlinux, just `pacman -S docker-compose`)

After all of that, reboot. (Usermod thingy needs a reboot for changes to work)

Now, run `docker info` as your regular user (no sudo) to make sure everything works:
```
$ docker info
```

Now we have docker & docker compose installed, we can now install Conduit.

## Conduit

Install conduit's cli (it doesn't matter what folder you run this in, it will download conduit into `~/.conduit/`)
```
$ sh <(curl -s https://getconduit.dev/bootstrap)
```
