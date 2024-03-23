# Local Testing

These instructions are for running a local instance of Quizfreely's backend to test and develop Quizfreely.

## Install & Setup

First, install docker (on archlinux, just `pacman -S docker`)

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

Before we can install conduit, start `docker.service`. It's `start`, NOT `enable`. For local testing, we don't want docker to autostart every boot, which is what `enable` does.
```
systemctl start docker.service
```

Install conduit's cli (it doesn't matter what folder you run this in, it will download conduit into `~/.conduit/`)
```
$ sh <(curl -s https://getconduit.dev/bootstrap)
```

The command above installs conduit and then runs `conduit deploy setup --config` It should open conduit's dashboard (at `http://localhost:8080/`) when it's done!

## Starting & Restarting

Conduit's dashboard should be at `http://localhost:8080/`

To setup a new conduit backend:
```
conduit deploy setup --config
```

To start a deployment that you already setup before:
```
conduit deploy start
```

To stop a currently running deployment:
```
conduit deploy stop
```

See `conduit --help` for all the commands & info
