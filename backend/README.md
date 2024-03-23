# Local Testing

## work in progress instructions

install docker, add docker group to user
```
# pacman -S docker
$ systemctl start docker
# usermod -a -G docker YOURUSERNAME
```

check that `docker info` can be ran from user, install docker-compose
```
$ docker info
# pacman -S docker-compose
```

now install conduit (doesn't matter what folder you run it in, it will download conduit into `~/.conduit/`)
```
$ sh <(curl -s https://getconduit.dev/bootstrap)
```
